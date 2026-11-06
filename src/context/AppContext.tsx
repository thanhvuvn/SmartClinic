import React, { createContext, useContext, useState } from 'react';
import {
  APPOINTMENTS,
  AppointmentItem,
  BOOKING_DAYS,
  DaySlotItem,
  DOCTORS,
  DoctorItem,
  PATIENT_PROFILE,
  PRESCRIPTION_DRUGS,
  PrescriptionDrug,
  TIME_SLOTS,
  TimeSlotItem,
} from '../data/mockData';

export interface FamilyMemberItem {
  id: string;
  name: string;
  relation: string;
  code: string;
  blood: string;
  note: string;
  badge: string;
  dob?: string;
  bhyt?: string;
}

export interface LatestBookingTicket {
  code: string;
  doctor: DoctorItem;
  dayLabel: string;
  fullDate: string;
  timeRange: string;
  room: string;
  queueNumber: string;
  consultMode: string;
  paymentMethod: string;
}

interface AppContextValue {
  // 1. Appointments & Booking
  appointments: AppointmentItem[];
  latestBooking: LatestBookingTicket;
  createBooking: (params: {
    doctor: DoctorItem;
    day?: DaySlotItem;
    slot?: TimeSlotItem;
    consultMode?: string;
    paymentMethod: string;
  }) => LatestBookingTicket;
  cancelAppointment: (appointmentId: string) => void;
  completeAppointment: (appointmentId: string) => void;

  // 2. Medication Adherence Log
  takenMap: Record<string, boolean>;
  toggleMedicationTaken: (slotKey: string) => void;

  // 3. Family Profiles
  familyMembers: FamilyMemberItem[];
  addFamilyMember: (member: {
    name: string;
    dob: string;
    relation: string;
    bhyt: string;
  }) => void;

  // 4. Prescriptions & Doctors (Shared with Doctor/Admin Portals)
  prescriptions: PrescriptionDrug[];
  addPrescriptionDrug: (drug: Omit<PrescriptionDrug, 'id'>) => void;
  diagnosisNote: string;
  setDiagnosisNote: (note: string) => void;
  doctors: DoctorItem[];

  // 5. Security & Privacy (PII Masking state)
  isPiiMasked: boolean;
  togglePiiMask: () => void;
  patientProfile: typeof PATIENT_PROFILE;
}

const INITIAL_FAMILY_MEMBERS: FamilyMemberItem[] = [
  {
    id: 'fam-1',
    name: 'Bé Nguyễn Bảo Nam',
    relation: 'Con trai • 4 tuổi',
    code: '#BN-992104',
    blood: 'O+',
    note: 'Sắp tiêm nhắc MMR • Tăng trưởng chuẩn WHO',
    badge: 'Nhi đồng',
    dob: '18/09/2020',
    bhyt: 'TE1 79 234 88190',
  },
  {
    id: 'fam-2',
    name: 'Bà Trần Thị Lan',
    relation: 'Mẹ ruột • 62 tuổi',
    code: '#BN-441029',
    blood: 'A+',
    note: 'Đang theo dõi Huyết áp & Tim mạch tại BV ĐHYD',
    badge: 'Cao tuổi',
    dob: '12/04/1962',
    bhyt: 'HT2 79 234 11029',
  },
  {
    id: 'fam-3',
    name: 'Nguyễn Thị Mai',
    relation: 'Vợ • 30 tuổi',
    code: '#BN-882915',
    blood: 'B+',
    note: 'Khám sức khỏe định kỳ loại I (Tốt)',
    badge: 'BHYT 80%',
    dob: '05/11/1994',
    bhyt: 'DN4 79 234 82399',
  },
];

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  ...APPOINTMENTS,
  {
    id: 'apt-completed-1',
    code: '#KB-241028-9982',
    doctor: DOCTORS[0],
    dateLabel: 'Đã khám • 28/10/2024',
    timeRange: '09:00 - 09:30, 28/10/2024',
    queueNumber: 'STT #08',
    room: 'Phòng 302, Tầng 3, Tòa nhà A',
    status: 'completed',
    mode: 'clinic',
    statusBadge: 'Đã có kết quả',
  },
  {
    id: 'apt-cancelled-1',
    code: '#SC-241010-3310',
    doctor: DOCTORS[1],
    dateLabel: 'Đã hủy • 10/10/2024',
    timeRange: '15:00 - 15:30, 10/10/2024',
    queueNumber: 'STT #21',
    room: 'Phòng 205, Khoa Tim mạch',
    status: 'cancelled',
    mode: 'clinic',
    statusBadge: 'Đã hủy lịch',
  },
];

const DEFAULT_TICKET: LatestBookingTicket = {
  code: '#SC-241029-8892',
  doctor: DOCTORS[0],
  dayLabel: 'Thứ 3',
  fullDate: '29/10/2024',
  timeRange: '09:30 - 10:00',
  room: 'P.302 • Tầng 3, Tòa nhà A',
  queueNumber: 'STT #14',
  consultMode: 'clinic',
  paymentMethod: 'at_clinic_bhyt',
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointments, setAppointments] =
    useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [latestBooking, setLatestBooking] =
    useState<LatestBookingTicket>(DEFAULT_TICKET);
  const [takenMap, setTakenMap] = useState<Record<string, boolean>>({
    morning: true,
    afternoon: true,
    evening: false,
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>(
    INITIAL_FAMILY_MEMBERS
  );
  const [prescriptions, setPrescriptions] =
    useState<PrescriptionDrug[]>(PRESCRIPTION_DRUGS);
  const [diagnosisNote, setDiagnosisNote] = useState<string>(
    'Đau đầu căng thẳng (Tension headache) / Rối loạn vận mạch não nhẹ'
  );
  const [doctors] = useState<DoctorItem[]>(DOCTORS);
  const [isPiiMasked, setIsPiiMasked] = useState<boolean>(true);

  const createBooking = ({
    doctor,
    day,
    slot,
    consultMode = 'clinic',
    paymentMethod,
  }: {
    doctor: DoctorItem;
    day?: DaySlotItem;
    slot?: TimeSlotItem;
    consultMode?: string;
    paymentMethod: string;
  }): LatestBookingTicket => {
    const chosenDay = day || BOOKING_DAYS[1];
    const chosenSlot = slot || TIME_SLOTS[3];
    const randNum = Math.floor(1000 + Math.random() * 8999);
    const sttNum = Math.floor(15 + Math.random() * 20);
    const code = `#SC-2411-${randNum}`;
    const timeRange = `${chosenSlot.time} - ${chosenSlot.period === 'morning' ? 'Ca Sáng' : 'Ca Chiều'}`;
    const isVideo = consultMode === 'chat' || consultMode === 'video';

    const newTicket: LatestBookingTicket = {
      code,
      doctor,
      dayLabel: chosenDay.dayLabel,
      fullDate: chosenDay.fullDate,
      timeRange: `${chosenSlot.time} (${chosenDay.dayLabel})`,
      room: isVideo ? 'Phòng tư vấn Trực tuyến' : 'P.302 • Tầng 3, Tòa nhà A',
      queueNumber: isVideo ? `ONLINE #${sttNum}` : `STT #${sttNum}`,
      consultMode,
      paymentMethod,
    };

    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      code,
      doctor,
      dateLabel: `${chosenDay.dayLabel} (${chosenDay.fullDate}) • ${chosenSlot.time}`,
      timeRange: `${chosenSlot.time}, ${chosenDay.dayLabel} ${chosenDay.fullDate}`,
      queueNumber: newTicket.queueNumber,
      room: isVideo
        ? 'Tư vấn trực tuyến qua ứng dụng'
        : `Phòng 302, ${doctor.hospital}`,
      status: 'upcoming',
      mode: isVideo ? 'video' : 'clinic',
      statusBadge:
        paymentMethod === 'at_clinic_bhyt'
          ? 'Giữ chỗ BHYT'
          : 'Đã thanh toán ✓',
    };

    setLatestBooking(newTicket);
    setAppointments((prev) => [newApt, ...prev]);
    return newTicket;
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'cancelled',
              statusBadge: 'Đã hủy theo yêu cầu',
              dateLabel: `Đã hủy • ${apt.dateLabel}`,
            }
          : apt
      )
    );
  };

  const completeAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'completed',
              statusBadge: 'Đã hoàn tất khám',
            }
          : apt
      )
    );
  };

  const toggleMedicationTaken = (slotKey: string) => {
    setTakenMap((prev) => ({
      ...prev,
      [slotKey]: !prev[slotKey],
    }));
  };

  const addFamilyMember = (member: {
    name: string;
    dob: string;
    relation: string;
    bhyt: string;
  }) => {
    const randCode = Math.floor(100000 + Math.random() * 899999);
    const newMember: FamilyMemberItem = {
      id: `fam-${Date.now()}`,
      name: member.name.trim() || 'Thành viên mới',
      relation: `${member.relation} • Sinh: ${member.dob || '1995'}`,
      code: `#BN-${randCode}`,
      blood: 'O+',
      note: member.bhyt
        ? `Đã liên kết BHYT (${member.bhyt})`
        : 'Hồ sơ người thân vừa tạo mới',
      badge: 'BHYT 80%',
      dob: member.dob,
      bhyt: member.bhyt,
    };
    setFamilyMembers((prev) => [newMember, ...prev]);
  };

  const addPrescriptionDrug = (drug: Omit<PrescriptionDrug, 'id'>) => {
    const newDrug: PrescriptionDrug = {
      ...drug,
      id: `rx-${Date.now()}`,
    };
    setPrescriptions((prev) => [newDrug, ...prev]);
  };

  const togglePiiMask = () => {
    setIsPiiMasked((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        appointments,
        latestBooking,
        createBooking,
        cancelAppointment,
        completeAppointment,
        takenMap,
        toggleMedicationTaken,
        familyMembers,
        addFamilyMember,
        prescriptions,
        addPrescriptionDrug,
        diagnosisNote,
        setDiagnosisNote,
        doctors,
        isPiiMasked,
        togglePiiMask,
        patientProfile: PATIENT_PROFILE,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
};

