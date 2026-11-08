import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppointmentItem,
  DoctorItem,
  PrescriptionDrug,
} from '../data/mockData';
import {
  DoctorReviewItem,
  FamilyMemberItem,
  LatestBookingTicket,
  MedicineCabinetItem,
} from '../context/AppContext';

// ============================================================================
// 1. CẤU HÌNH API & QUẢN LÝ PHIÊN ĐĂNG NHẬP (JWT ACCESS / REFRESH TOKEN)
// ============================================================================
export const API_CONFIG = {
  BASE_URL:
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  TIMEOUT_MS: 3500,
  ENABLE_REMOTE_API: false, // Bật thành true khi chạy kèm Backend Server thật
};

export const STORAGE_KEYS = {
  APP_STATE: '@smartclinic:app_state_v1',
  AUTH_SESSION: '@smartclinic:auth_session_v1',
  BOOKMARKED_DOCTORS: '@smartclinic:bookmarked_doctors_v1',
};

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  role: 'patient' | 'doctor' | 'admin';
  email: string;
  fullName: string;
  issuedAt: number;
}

export interface PersistedAppState {
  appointments: AppointmentItem[];
  latestBooking: LatestBookingTicket;
  takenMap: Record<string, boolean>;
  familyMembers: FamilyMemberItem[];
  prescriptions: PrescriptionDrug[];
  diagnosisNote: string;
  isPiiMasked: boolean;
  cabinetMeds?: MedicineCabinetItem[];
  doctorReviews?: DoctorReviewItem[];
  updatedAt: string;
}

let inMemoryToken: string | null = null;

/**
 * Lưu phiên đăng nhập (JWT Token & Role) xuống bộ nhớ thiết bị
 */
export async function saveAuthSession(session: AuthSession): Promise<void> {
  inMemoryToken = session.accessToken;
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.AUTH_SESSION,
      JSON.stringify(session)
    );
  } catch {
    // Bỏ qua lỗi ghi bộ nhớ nếu môi trường bị giới hạn
  }
}

/**
 * Đọc phiên đăng nhập đã lưu từ bộ nhớ thiết bị
 */
export async function loadAuthSession(): Promise<AuthSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    inMemoryToken = parsed.accessToken;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Xóa phiên đăng nhập khi người dùng Đăng xuất (Logout)
 */
export async function clearAuthSession(): Promise<void> {
  inMemoryToken = null;
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  } catch {
    // Ignore
  }
}

// ============================================================================
// 2. HTTP CLIENT CHUẨN RESTFUL (CÓ TIMEOUT & OFFLINE FALLBACK)
// ============================================================================
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackFn: () => Promise<T> | T
): Promise<{ data: T; source: 'remote' | 'local' }> {
  if (!API_CONFIG.ENABLE_REMOTE_API) {
    const localData = await fallbackFn();
    return { data: localData, source: 'local' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-App': 'SmartClinic-Mobile/1.0.0',
      ...(options.headers as Record<string, string>),
    };

    if (inMemoryToken) {
      headers.Authorization = `Bearer ${inMemoryToken}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = (await response.json()) as T;
    return { data: json, source: 'remote' };
  } catch {
    clearTimeout(timer);
    // Tự động fallback về Local Storage nếu Server Backend chưa bật hoặc mất mạng
    const fallbackData = await fallbackFn();
    return { data: fallbackData, source: 'local' };
  }
}

// ============================================================================
// 3. DỊCH VỤ LƯU TRỮ BỀN VỮNG (LOCAL PERSISTENCE SERVICE)
// ============================================================================
export const storageService = {
  /**
   * Tải toàn bộ trạng thái ứng dụng đã lưu trong máy
   */
  async loadPersistedState(): Promise<Partial<PersistedAppState> | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<PersistedAppState>;
    } catch {
      return null;
    }
  },

  /**
   * Lưu toàn bộ trạng thái ứng dụng xuống máy (Debounced / Async)
   */
  async savePersistedState(state: PersistedAppState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_STATE,
        JSON.stringify(state)
      );
    } catch {
      // Ignore write error
    }
  },

  /**
   * Khôi phục toàn bộ dữ liệu ứng dụng về mặc định ban đầu
   */
  async resetAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.APP_STATE,
        STORAGE_KEYS.AUTH_SESSION,
        STORAGE_KEYS.BOOKMARKED_DOCTORS,
      ]);
    } catch {
      // Ignore
    }
  },
};

// ============================================================================
// 4. CÁC SERVICE NGHIỆP VỤ Y TẾ (DOMAIN API SERVICES)
// ============================================================================
export const authService = {
  async login(params: {
    email: string;
    role: 'patient' | 'doctor' | 'admin';
  }): Promise<AuthSession> {
    const mockSession: AuthSession = {
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${params.role}.${Date.now()}`,
      refreshToken: `rt_${params.role}_${Date.now()}`,
      role: params.role,
      email: params.email,
      fullName:
        params.role === 'admin'
          ? 'Quản trị viên Hệ thống'
          : params.role === 'doctor'
          ? 'TS. BS. Lê Thu Trang'
          : 'Nguyễn Văn Vũ',
      issuedAt: Date.now(),
    };

    const res = await apiRequest<AuthSession>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
      () => mockSession
    );

    await saveAuthSession(res.data);
    return res.data;
  },

  async logout(): Promise<void> {
    await clearAuthSession();
  },
};

export const bookingService = {
  async syncNewAppointment(
    appointment: AppointmentItem
  ): Promise<{ synced: boolean; source: 'remote' | 'local' }> {
    const res = await apiRequest(
      '/appointments',
      {
        method: 'POST',
        body: JSON.stringify(appointment),
      },
      () => ({ synced: true })
    );
    return { synced: true, source: res.source };
  },

  async syncCancelAppointment(
    appointmentId: string
  ): Promise<{ synced: boolean; source: 'remote' | 'local' }> {
    const res = await apiRequest(
      `/appointments/${appointmentId}/cancel`,
      { method: 'PATCH' },
      () => ({ synced: true })
    );
    return { synced: true, source: res.source };
  },
};

export const ehrService = {
  async syncPrescriptionDrug(
    drug: PrescriptionDrug,
    diagnosisNote: string
  ): Promise<{ synced: boolean; source: 'remote' | 'local' }> {
    const res = await apiRequest(
      '/ehr/prescriptions',
      {
        method: 'POST',
        body: JSON.stringify({ drug, diagnosisNote }),
      },
      () => ({ synced: true })
    );
    return { synced: true, source: res.source };
  },

  async toggleDoctorBookmark(
    doctor: DoctorItem
  ): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKED_DOCTORS);
      const current: string[] = raw ? JSON.parse(raw) : [];
      const next = current.includes(doctor.id)
        ? current.filter((id) => id !== doctor.id)
        : [...current, doctor.id];
      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKED_DOCTORS,
        JSON.stringify(next)
      );
      return next;
    } catch {
      return [];
    }
  },
};
