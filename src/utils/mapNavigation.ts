import { Linking, Platform, Alert } from 'react-native';
import { DoctorItem, HospitalItem, HOSPITALS } from '../data/mockData';

export type TravelMode = 'two-wheeler' | 'driving' | 'walking';

export interface MapDestination {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  travelMode?: TravelMode;
}

/**
 * Tìm HospitalItem tương ứng từ thông tin Bác sĩ
 */
export function findHospitalForDoctor(
  doctor: DoctorItem,
  hospitalList: HospitalItem[] = HOSPITALS
): HospitalItem {
  const matched = hospitalList.find(
    (h) =>
      doctor.hospital.toLowerCase().includes(h.name.toLowerCase()) ||
      h.name.toLowerCase().includes(doctor.hospital.toLowerCase()) ||
      (doctor.latitude && Math.abs(h.latitude - doctor.latitude) < 0.005)
  );
  if (matched) return matched;
  return {
    ...HOSPITALS[0],
    id: `hosp-doc-${doctor.id}`,
    name: doctor.hospital,
    address: doctor.address,
    latitude: doctor.latitude || HOSPITALS[0].latitude,
    longitude: doctor.longitude || HOSPITALS[0].longitude,
  };
}

/**
 * Mở ứng dụng Google Maps (hoặc Apple Maps / Trình duyệt) chỉ đường tới bệnh viện
 * Hoạt động 100% ở phía Client mà không cần Backend hay API Key trả phí.
 */
export async function openGoogleMapsDirections(dest: MapDestination): Promise<void> {
  const mode = dest.travelMode || 'two-wheeler';
  const hasCoords =
    typeof dest.latitude === 'number' && typeof dest.longitude === 'number';

  const destinationParam = hasCoords
    ? `${dest.latitude},${dest.longitude}`
    : encodeURIComponent(`${dest.name}, ${dest.address}`);

  // Chuẩn Universal Cross-platform URL của Google Maps
  const googleUniversalUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationParam}&travelmode=${mode}`;

  try {
    if (Platform.OS === 'android' && hasCoords) {
      // Thử mở trực tiếp app Google Maps navigation trên Android, nếu không có thì mở universal link
      const canOpenUniversal = await Linking.canOpenURL(googleUniversalUrl);
      if (canOpenUniversal) {
        await Linking.openURL(googleUniversalUrl);
        return;
      }
      const geoUrl = `geo:${dest.latitude},${dest.longitude}?q=${encodeURIComponent(
        `${dest.name}, ${dest.address}`
      )}`;
      await Linking.openURL(geoUrl);
      return;
    }

    if (Platform.OS === 'ios') {
      // Ưu tiên mở Google Maps nếu có cài, nếu không mở universal link (hoặc Apple Maps)
      const googleAppUrl = `comgooglemaps://?daddr=${destinationParam}&directionsmode=${
        mode === 'walking' ? 'walking' : 'driving'
      }`;
      const canOpenGmapsApp = await Linking.canOpenURL(googleAppUrl);
      if (canOpenGmapsApp) {
        await Linking.openURL(googleAppUrl);
        return;
      }
    }

    await Linking.openURL(googleUniversalUrl);
  } catch {
    Alert.alert(
      'Không thể mở Bản đồ',
      `Vui lòng di chuyển tới địa chỉ:\n${dest.name}\n${dest.address}`
    );
  }
}

/**
 * Mở bản đồ tìm kiếm tất cả bệnh viện liên kết tại TP.HCM trên Google Maps
 */
export async function openNearbyHospitalsOnGoogleMaps(
  query = 'Bệnh viện Đa khoa BHYT Quận 5 TP. Hồ Chí Minh'
): Promise<void> {
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
  try {
    await Linking.openURL(searchUrl);
  } catch {
    Alert.alert('Lỗi mở bản đồ', 'Không thể mở Google Maps trên thiết bị này.');
  }
}

/**
 * Gọi điện trực tiếp tới tổng đài / cấp cứu bệnh viện
 */
export async function callHospitalPhone(phone: string, hospitalName?: string): Promise<void> {
  const cleanPhone = phone.replace(/\s+/g, '');
  const telUrl = `tel:${cleanPhone}`;
  try {
    const supported = await Linking.canOpenURL(telUrl);
    if (supported) {
      await Linking.openURL(telUrl);
    } else {
      Alert.alert(
        `Tổng đài ${hospitalName || 'Bệnh viện'}`,
        `Số điện thoại liên hệ: ${phone}`
      );
    }
  } catch {
    Alert.alert(
      `Tổng đài ${hospitalName || 'Bệnh viện'}`,
      `Số điện thoại liên hệ: ${phone}`
    );
  }
}

