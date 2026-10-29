export interface SpecialtyItem {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  degree: string;
  specialty: string;
  subSpecialty: string;
  hospital: string;
  address: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  patientCount: string;
  responseTime: string;
  fee: string;
  feeNumeric: number;
  bhytSupport: string;
  availableText: string;
  avatar: string;
  verified: boolean;
  bio: string;
  strengths: string[];
}

export interface HospitalItem {
  id: string;
  name: string;
  rating: number;
  distance: string;
  tag: string;
  image: string;
  address: string;
}

export interface DaySlotItem {
  id: string;
  dayLabel: string;
  dateNumber: string;
  fullDate: string;
  badge?: string;
  slotsAvailable: number;
  isFull?: boolean;
}

export interface TimeSlotItem {
  id: string;
  time: string;
  period: 'morning' | 'afternoon';
  status: 'available' | 'selected' | 'booked' | 'fast';
}

export interface AppointmentItem {
  id: string;
  code: string;
  doctor: DoctorItem;
  dateLabel: string;
  timeRange: string;
  queueNumber?: string;
  room?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  mode: 'clinic' | 'video';
  statusBadge: string;
}

export interface PrescriptionDrug {
  id: string;
  name: string;
  indication: string;
  quantity: string;
  dosageTag: string;
  instructionTag: string;
  isWarning?: boolean;
}

export const SPECIALTIES: SpecialtyItem[] = [
  { id: 'cardio', name: 'Tim mạch', icon: 'heart', bgColor: '#FFE4E6', iconColor: '#BE123C' },
  { id: 'internal', name: 'Nội khoa', icon: 'medkit', bgColor: '#E0EAFF', iconColor: '#006194' },
  { id: 'surgery', name: 'Ngoại khoa', icon: 'bandage', bgColor: '#CCFBF1', iconColor: '#006A61' },
  { id: 'pediatrics', name: 'Nhi khoa', icon: 'happy', bgColor: '#E0EAFF', iconColor: '#006194' },
  { id: 'derma', name: 'Da liễu', icon: 'water', bgColor: '#CCFBF1', iconColor: '#006A61' },
  { id: 'dental', name: 'Nha khoa', icon: 'sparkles', bgColor: '#E0EAFF', iconColor: '#006194' },
  { id: 'eye', name: 'Mắt', icon: 'eye', bgColor: '#E0EAFF', iconColor: '#006194' },
  { id: 'neuro', name: 'Thần kinh', icon: 'pulse', bgColor: '#E0EAFF', iconColor: '#006194' },
];

export const DOCTORS: DoctorItem[] = [
  {
    id: 'doc-1',
    name: 'TS. BS. Lê Thu Trang',
    degree: 'Trưởng khoa Thần kinh',
    specialty: 'Thần kinh',
    subSpecialty: 'Nội thần kinh - Đau đầu & Mạch máu não',
    hospital: 'BV. Đại học Y Dược TP.HCM',
    address: 'Cơ sở 1: 215 Hồng Bàng, Phường 11, Quận 5, TP.HCM',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 185,
    patientCount: '2.4k+',
    responseTime: '< 15p',
    fee: '350.000 đ',
    feeNumeric: 350000,
    bhytSupport: 'Hỗ trợ BHYT chi trả đến 80%',
    availableText: 'Trống: Hôm nay (14:30)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    verified: true,
    bio: 'TS. BS. Lê Thu Trang tốt nghiệp Tiến sĩ Y khoa tại Đại học Y Dược TP.HCM, có nhiều năm tu nghiệp chuyên sâu về bệnh lý thần kinh và đột quỵ tại Bệnh viện Đại học Quốc gia Seoul (Hàn Quốc). Chuyên gia đầu ngành trong điều trị chứng đau nửa đầu mãn tính, rối loạn tiền đình, mất ngủ và đau căng cơ thần kinh.',
    strengths: [
      'Đau nửa đầu (Migraine) & căng thẳng',
      'Thiểu năng tuần hoàn não',
      'Rối loạn tiền đình & Mất ngủ kinh niên',
      'Tầm soát & dự phòng đột quỵ não sớm',
    ],
  },
  {
    id: 'doc-2',
    name: 'BS. CKII. Nguyễn Văn Minh',
    degree: 'Chuyên gia Tim mạch can thiệp',
    specialty: 'Tim mạch',
    subSpecialty: 'Tim mạch • 15 năm KN',
    hospital: 'BV. Đại học Y Dược',
    address: '215 Hồng Bàng, Quận 5, TP.HCM',
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 120,
    patientCount: '1.9k+',
    responseTime: '< 20p',
    fee: '300.000 đ',
    feeNumeric: 300000,
    bhytSupport: 'Hỗ trợ BHYT chi trả đến 80%',
    availableText: 'Lịch trống hôm nay',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    verified: true,
    bio: 'Chuyên gia đầu ngành về Nội Tim mạch, tăng huyết áp, bệnh mạch vành và siêu âm tim Doppler màu.',
    strengths: [
      'Tăng huyết áp & Suy tim mạn',
      'Bệnh lý mạch vành & Rối loạn nhịp',
      'Tầm soát tim mạch sau COVID',
    ],
  },
  {
    id: 'doc-3',
    name: 'ThS. BS. Nguyễn Minh Đức',
    degree: 'Chuyên khoa Mắt (Nhãn khoa)',
    specialty: 'Mắt',
    subSpecialty: 'Khúc xạ & Võng mạc • 12 năm KN',
    hospital: 'BV. Mắt TP.HCM',
    address: '280 Điện Biên Phủ, Quận 3, TP.HCM',
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 95,
    patientCount: '1.5k+',
    responseTime: '< 15p',
    fee: '250.000 đ',
    feeNumeric: 250000,
    bhytSupport: 'Hỗ trợ BHYT thông tuyến',
    availableText: 'Trống: Ngày mai (09:00)',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    verified: true,
    bio: 'ThS. BS. Nguyễn Minh Đức chuyên khám và điều trị tật khúc xạ, khô mắt kỹ thuật số và bệnh lý đáy mắt.',
    strengths: ['Tật khúc xạ & Điều tiết mắt', 'Hội chứng thị giác màn hình'],
  },
  {
    id: 'doc-4',
    name: 'PGS. BS. Trần Anh Tuấn',
    degree: 'Chuyên gia Ngoại Thần kinh',
    specialty: 'Thần kinh',
    subSpecialty: 'Ngoại Thần kinh • 20 năm KN',
    hospital: 'BV. Chợ Rẫy',
    address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM',
    experienceYears: 20,
    rating: 4.8,
    reviewCount: 120,
    patientCount: '3.1k+',
    responseTime: '< 30p',
    fee: '400.000 đ',
    feeNumeric: 400000,
    bhytSupport: 'Hỗ trợ BHYT đúng tuyến & thông tuyến',
    availableText: 'Trống: Ngày mai (09:00)',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    verified: true,
    bio: 'Phó Giáo sư, Bác sĩ cao cấp chuyên khoa Ngoại Thần kinh, cột sống và bệnh lý sọ não tại Bệnh viện Chợ Rẫy.',
    strengths: ['Thoát vị đĩa đệm cột sống', 'Đau dây thần kinh tọa & sọ não'],
  },
];

export const HOSPITALS: HospitalItem[] = [
  {
    id: 'hosp-1',
    name: 'BV. Đa khoa Quốc tế Vinmec',
    rating: 4.9,
    distance: '1.8 km',
    tag: 'Cấp cứu 24/7',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&auto=format&fit=crop&q=80',
    address: '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
  },
  {
    id: 'hosp-2',
    name: 'Bệnh viện Chợ Rẫy',
    rating: 4.7,
    distance: '3.2 km',
    tag: 'Đa khoa Trung ương',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
    address: '201B Nguyễn Chí Thanh, Quận 5, TP.HCM',
  },
];

export const BOOKING_DAYS: DaySlotItem[] = [
  { id: 'd1', dayLabel: 'Thứ 2', dateNumber: '28', fullDate: '28/10/2024', slotsAvailable: 0, isFull: true },
  { id: 'd2', dayLabel: 'Thứ 3', dateNumber: '29', fullDate: '29/10/2024', badge: 'HÔM NAY', slotsAvailable: 7 },
  { id: 'd3', dayLabel: 'Thứ 4', dateNumber: '30', fullDate: '30/10/2024', slotsAvailable: 6 },
  { id: 'd4', dayLabel: 'Thứ 5', dateNumber: '31', fullDate: '31/10/2024', slotsAvailable: 4 },
  { id: 'd5', dayLabel: 'Thứ 6', dateNumber: '01', fullDate: '01/11/2024', slotsAvailable: 8 },
];

export const TIME_SLOTS: TimeSlotItem[] = [
  { id: 't1', time: '08:00', period: 'morning', status: 'booked' },
  { id: 't2', time: '08:30', period: 'morning', status: 'booked' },
  { id: 't3', time: '09:00', period: 'morning', status: 'available' },
  { id: 't4', time: '09:30', period: 'morning', status: 'selected' },
  { id: 't5', time: '10:00', period: 'morning', status: 'available' },
  { id: 't6', time: '10:30', period: 'morning', status: 'available' },
  { id: 't7', time: '11:00', period: 'morning', status: 'available' },
  { id: 't8', time: '13:30', period: 'afternoon', status: 'available' },
  { id: 't9', time: '14:00', period: 'afternoon', status: 'available' },
  { id: 't10', time: '14:30', period: 'afternoon', status: 'fast' },
  { id: 't11', time: '15:00', period: 'afternoon', status: 'booked' },
  { id: 't12', time: '15:30', period: 'afternoon', status: 'available' },
  { id: 't13', time: '16:00', period: 'afternoon', status: 'available' },
  { id: 't14', time: '16:30', period: 'afternoon', status: 'available' },
];

export const APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-1',
    code: '#SC-241029-8892',
    doctor: DOCTORS[0],
    dateLabel: 'Hôm nay • 09:30',
    timeRange: '09:30 - 10:00',
    queueNumber: 'STT #14',
    room: 'Phòng 302, Tầng 3, Tòa nhà A',
    status: 'upcoming',
    mode: 'clinic',
    statusBadge: 'Đã xác nhận',
  },
  {
    id: 'apt-2',
    code: '#SC-241104-5120',
    doctor: DOCTORS[2],
    dateLabel: 'Sau 5 ngày • 04/11',
    timeRange: '14:00, Thứ Hai 04/11/2024',
    status: 'upcoming',
    mode: 'video',
    statusBadge: 'Tư vấn Video',
  },
];

export const PRESCRIPTION_DRUGS: PrescriptionDrug[] = [
  {
    id: 'rx-1',
    name: 'Flunarizine 5mg',
    indication: 'Ngăn ngừa đau nửa đầu & co thắt mạch',
    quantity: 'x 7 viên',
    dosageTag: '1 viên / ngày',
    instructionTag: 'Uống buổi tối trước ngủ',
  },
  {
    id: 'rx-2',
    name: 'Ginkgo Biloba 80mg',
    indication: 'Tăng cường tuần hoàn máu não',
    quantity: 'x 14 viên',
    dosageTag: '2 viên / ngày',
    instructionTag: 'Sáng 1v • Chiều 1v',
  },
  {
    id: 'rx-3',
    name: 'Paracetamol 500mg',
    indication: 'Giảm đau cấp tính khi căng thẳng',
    quantity: 'x 10 viên',
    dosageTag: 'Dùng khi cần',
    instructionTag: 'Cách tối thiểu 6 giờ',
    isWarning: true,
  },
];

export const PATIENT_PROFILE = {
  name: 'Nguyễn Văn Vũ',
  age: 32,
  gender: 'Nam',
  bloodType: 'O+',
  patientCode: '#BN-882910',
  tier: 'SmartCare Gold • Hồ sơ EHR chuẩn',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  emergencyContact: 'Nguyễn Thị Mai (Vợ - 0987 654 321)',
  bhytCode: 'DN4 79 234 82390',
  bhytHospital: 'BV Đại học Y Dược TP.HCM',
  bhytExpiry: '31/12/2025 (Mức hưởng 80–100%)',
  vitals: [
    { label: 'Huyết áp', value: '120/80', unit: 'mmHg • Chuẩn', highlight: false },
    { label: 'Nhịp tim', value: '74', unit: 'bpm • Đều', highlight: false },
    { label: 'SpO2', value: '98%', unit: 'Tối ưu', highlight: true },
    { label: 'Chỉ số BMI', value: '21.8', unit: 'Cân đối', highlight: false },
  ],
};

