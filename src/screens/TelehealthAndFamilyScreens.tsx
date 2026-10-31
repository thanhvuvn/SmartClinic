import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from '../theme';
import { DOCTORS, PATIENT_PROFILE, PRESCRIPTION_DRUGS } from '../data/mockData';
import {
  AppHeader,
  AppButton,
  AppInput,
  Badge,
  SectionHeader,
  SegmentedControl,
  ChatBottomInputBar,
  ActivePrescriptionCard,
} from '../components';

// ============================================================================
// SCREEN 11: [1:2703] ĐẶT LỊCH THÀNH CÔNG
// ============================================================================
export const BookingSuccessScreen: React.FC<{
  onViewAppointments?: () => void;
  onGoHome?: () => void;
  onNavigate?: (routeKey: string) => void;
}> = ({ onViewAppointments, onGoHome, onNavigate }) => {
  const doctor = DOCTORS[0];
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Đặt Lịch Thành Công"
        onBack={onGoHome}
        rightActions={[{ icon: 'share-social-outline' }]}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Section 1: Success Celebration Header */}
        <View style={[styles.cardCenter, SHADOWS.sm]}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark-circle" size={48} color={COLORS.secondary} />
          </View>
          <Text style={styles.heroTitle}>Đặt lịch khám thành công!</Text>
          <Text style={styles.heroSub}>
            Phiếu hẹn của bạn đã được xác nhận. Tin nhắn SMS và thông báo nhắc
            nhở đã được gửi tới số{' '}
            <Text style={{ fontWeight: '800', color: COLORS.primary }}>
              0912 345 678
            </Text>
            .
          </Text>
        </View>

        {/* Section 2: Smart Appointment Ticket Card */}
        <View style={[styles.card, SHADOWS.md]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.capLabel}>MÃ PHIẾU HẸN</Text>
              <Text style={styles.ticketCode}>#SC-241029-8892</Text>
            </View>
            <Badge label="Đúng hẹn • Đã xác nhận" variant="teal" showDot />
          </View>

          <View style={styles.divider} />

          <View style={styles.docRow}>
            <Image source={{ uri: doctor.avatar }} style={styles.avatarMd} />
            <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
              <Badge label="Khám chuyên khoa" variant="blue" />
              <Text style={[styles.docName, { marginTop: 4 }]} numberOfLines={1}>
                {doctor.name}
              </Text>
              <Text style={styles.docSub} numberOfLines={1}>
                {doctor.degree}
              </Text>
              <Text style={styles.docHospital} numberOfLines={1}>
                {doctor.hospital}
              </Text>
            </View>
          </View>

          <View style={styles.ticketGrid}>
            <View style={styles.ticketBox}>
              <Text style={styles.capLabel} numberOfLines={1}>
                THỜI GIAN KHÁM
              </Text>
              <Text style={styles.ticketVal} numberOfLines={1}>
                09:30 - 10:00
              </Text>
              <Text style={styles.docSub} numberOfLines={1}>
                Thứ 3, 29/10/2024
              </Text>
            </View>
            <View style={styles.ticketBox}>
              <Text style={styles.capLabel} numberOfLines={1}>
                PHÒNG KHÁM & STT
              </Text>
              <Text
                style={[styles.ticketVal, { color: COLORS.secondary }]}
                numberOfLines={1}
              >
                STT #14 • P.302
              </Text>
              <Text style={styles.docSub} numberOfLines={1}>
                Tầng 3, Tòa nhà A
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: High-speed QR Fast Check-in Module */}
        <View style={[styles.cardCenter, SHADOWS.sm]}>
          <Badge
            label="MÃ QR CHECK-IN SIÊU TỐC"
            variant="blue"
            icon="qr-code-outline"
          />
          <View style={styles.qrMockBox}>
            <Ionicons name="qr-code" size={116} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.heroSub}>
            Quét mã tại Kiosk tự động hoặc Quầy tiếp đón số 2 để nhận số vào
            phòng khám mà không cần xếp hàng.
          </Text>
          <Badge
            label="Hợp lệ check-in trước 15 phút (từ 09:15)"
            variant="teal"
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Section 4: Quick Action Floating Grid */}
        <View style={styles.quickGrid3}>
          {[
            {
              icon: 'calendar-outline',
              label: 'Thêm vào Lịch',
              action: onViewAppointments,
            },
            {
              icon: 'download-outline',
              label: 'Tải Phiếu PDF',
              action: () =>
                Alert.alert(
                  'Tải Phiếu Hẹn PDF',
                  'Đã lưu phiếu khám #SC-241029-8892 vào thiết bị.'
                ),
            },
            {
              icon: 'navigate-outline',
              label: 'Chỉ Đường',
              action: () => onNavigate?.('doctorDetail'),
            },
          ].map((act) => (
            <TouchableOpacity
              key={act.label}
              onPress={act.action}
              style={[styles.quickBtnCard, SHADOWS.sm]}
            >
              <Ionicons name={act.icon as any} size={20} color={COLORS.primary} />
              <Text style={styles.quickBtnLabel}>{act.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 5: Preparation Checklist */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Chuẩn bị khi đi khám"
            leftIcon="clipboard-outline"
          />
          {[
            'Mang theo CCCD gắn chip hoặc ứng dụng VssID / thẻ BHYT bản chính để đối chiếu.',
            'Có mặt trước giờ hẹn 15 phút (09:15) để đo chỉ số sinh hiệu (huyết áp, nhịp tim, SpO2).',
            'Mang theo sổ khám bệnh, các kết quả chụp MRI / CT và đơn thuốc cũ trong 3 tháng gần nhất (nếu có).',
          ].map((note, idx) => (
            <View key={idx} style={styles.checkItemRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={COLORS.secondary}
                style={{ marginTop: 2 }}
              />
              <Text style={styles.checkItemText}>{note}</Text>
            </View>
          ))}
        </View>

        {/* Section 6: Bottom Navigation Action Stack */}
        <AppButton
          title="Xem Lịch Khám Của Tôi"
          variant="primary"
          size="lg"
          leftIcon="calendar-outline"
          onPress={onViewAppointments}
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="Về Trang Chủ"
          variant="tonal"
          size="lg"
          leftIcon="home-outline"
          onPress={onGoHome}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 14: [1:3491] QUẢN LÝ HỒ SƠ NGƯỜI THÂN
// ============================================================================
export const FamilyProfilesScreen: React.FC<{
  onBack?: () => void;
  onSelectChild?: () => void;
  onAddMember?: () => void;
  onNavigate?: (routeKey: string) => void;
}> = ({ onBack, onSelectChild, onAddMember, onNavigate }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Quản Lý Hồ Sơ Người Thân"
        subtitle="SmartClinic Family • BHYT & lịch khám tập trung"
        onBack={onBack}
        rightActions={[{ icon: 'person-add-outline', onPress: onAddMember }]}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Primary Account / Chủ hộ Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Badge label="Chủ hộ • Đang xem" variant="primarySolid" />
            <Badge label="Đã đồng bộ VssID" variant="teal" />
          </View>
          <View style={[styles.docRow, { marginTop: 10 }]}>
            <Image
              source={{ uri: PATIENT_PROFILE.avatar }}
              style={styles.avatarMd}
            />
            <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
              <Text style={styles.docName} numberOfLines={1}>
                Nguyễn Văn Vũ (Bản thân)
              </Text>
              <Text style={styles.docSub} numberOfLines={1}>
                32 tuổi • #BN-882910 • Nhóm máu O+
              </Text>
            </View>
          </View>
        </View>

        {/* AI Family Health Overview */}
        <LinearGradient
          colors={GRADIENTS.heroCard}
          style={[styles.heroCard, SHADOWS.md]}
        >
          <View style={styles.rowBetween}>
            <Badge label="SmartClinic AI Family Care" variant="glass" icon="sparkles" />
            <Text style={styles.whiteSub}>4 thành viên</Text>
          </View>
          <Text style={styles.whiteBody}>
            Nhắc nhở y tế: <Text style={{ fontWeight: '800' }}>Bé Bảo Nam</Text>{' '}
            có lịch tiêm nhắc Sởi - Quai bị - Rubella trong 5 ngày tới. Mẹ{' '}
            <Text style={{ fontWeight: '800' }}>Trần Thị Lan</Text> cần đo huyết
            áp định kỳ sáng mai (07:30).
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <AppButton
              title="Nhắc huyết áp"
              variant="white"
              size="sm"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => onNavigate?.('medLog')}
            />
            <AppButton
              title="Đặt lịch tiêm"
              variant="secondary"
              size="sm"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => onNavigate?.('bookingSlot')}
            />
          </View>
        </LinearGradient>

        <SectionHeader
          title="Hồ Sơ Thành Viên (3 thành viên phụ)"
          subtitle="Đồng bộ thời gian thực"
          actionText="+ Thêm mới"
          onActionPress={onAddMember}
        />

        {[
          {
            name: 'Bé Nguyễn Bảo Nam',
            relation: 'Con trai • 4 tuổi',
            code: '#BN-992104',
            blood: 'O+',
            note: 'Sắp tiêm nhắc MMR • Tăng trưởng chuẩn WHO',
            badge: 'Nhi đồng',
            onPress: onSelectChild,
          },
          {
            name: 'Bà Trần Thị Lan',
            relation: 'Mẹ ruột • 62 tuổi',
            code: '#BN-441029',
            blood: 'A+',
            note: 'Đang theo dõi Huyết áp & Tim mạch tại BV ĐHYD',
            badge: 'Cao tuổi',
            onPress: onSelectChild,
          },
          {
            name: 'Nguyễn Thị Mai',
            relation: 'Vợ • 30 tuổi',
            code: '#BN-882915',
            blood: 'B+',
            note: 'Khám sức khỏe định kỳ loại I (Tốt)',
            badge: 'BHYT 80%',
            onPress: onSelectChild,
          },
        ].map((mem) => (
          <TouchableOpacity
            key={mem.code}
            activeOpacity={0.85}
            onPress={mem.onPress}
            accessibilityRole="button"
            accessibilityLabel={`Hồ sơ ${mem.name}, ${mem.relation}`}
            style={[styles.card, SHADOWS.sm]}
          >
            <View style={styles.rowBetween}>
              <Text style={[styles.docName, { flex: 1 }]} numberOfLines={1}>
                {mem.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Badge label={mem.badge} variant="blue" />
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.textMuted}
                  importantForAccessibility="no"
                />
              </View>
            </View>
            <Text style={styles.docSub}>
              {mem.relation} • {mem.code} • Nhóm máu {mem.blood}
            </Text>
            <View style={styles.memberNoteBox}>
              <Ionicons
                name="medical-outline"
                size={14}
                color={COLORS.secondary}
              />
              <Text style={styles.memberNoteText} numberOfLines={1}>
                {mem.note}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <AppButton
          title="+ Thêm hồ sơ người thân mới"
          variant="primary"
          size="lg"
          leftIcon="person-add-outline"
          onPress={onAddMember}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 15: [1:3822] CHI TIẾT BỆNH ÁN NGƯỜI THÂN - BÉ BẢO NAM
// ============================================================================
export const ChildEHRDetailScreen: React.FC<{ onBack?: () => void }> = ({
  onBack,
}) => {
  const [tab, setTab] = useState('exam');
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Bệnh Án Nhi Đồng - Bé Bảo Nam"
        subtitle="Con trai • 4 tuổi • Mã EHR: #BN-992104"
        badgeText="NHI ĐỒNG"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Master Profile Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
              <Text style={styles.docName} numberOfLines={1}>
                Nguyễn Bảo Nam
              </Text>
              <Text style={styles.docSub}>
                Nam (18/09/2020) • Nhóm máu O+
              </Text>
            </View>
            <Badge label="Chuẩn WHO" variant="teal" />
          </View>

          <View style={styles.vitals3Grid}>
            <View style={styles.vitalBox}>
              <Text style={styles.capLabel} numberOfLines={1}>
                Chiều cao
              </Text>
              <Text style={styles.vitalBig} numberOfLines={1}>
                104 cm
              </Text>
              <Text style={styles.vitalTag} numberOfLines={1}>
                Chuẩn WHO
              </Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.capLabel} numberOfLines={1}>
                Cân nặng
              </Text>
              <Text style={styles.vitalBig} numberOfLines={1}>
                16.5 kg
              </Text>
              <Text style={styles.vitalTag} numberOfLines={1}>
                +0.4kg/quý
              </Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.capLabel} numberOfLines={1}>
                BMI Thể trạng
              </Text>
              <Text style={styles.vitalBig} numberOfLines={1}>
                15.2
              </Text>
              <Text style={styles.vitalTag} numberOfLines={1}>
                Phát triển tốt
              </Text>
            </View>
          </View>
        </View>

        <SegmentedControl
          variant="chips"
          selectedKey={tab}
          onSelect={setTab}
          options={[
            { key: 'exam', label: 'Khám gần nhất' },
            { key: 'vaccine', label: 'Sổ tiêm chủng (18 mũi)' },
            { key: 'growth', label: 'Biểu đồ WHO' },
          ]}
          style={{ marginBottom: 14 }}
        />

        {/* Vaccine Immunization Tracker Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Lịch Tiêm Chủng Mở Rộng & Dịch Vụ"
            leftIcon="shield-checkmark-outline"
            badgeText="Sắp tới"
            badgeVariant="warning"
          />
          <View style={styles.memberNoteBox}>
            <Ionicons name="calendar" size={16} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.docName}>
                Mũi nhắc MMR II (Sởi - Quai bị - Rubella)
              </Text>
              <Text style={styles.docSub}>
                Dự kiến: 03/11/2024 • Trung tâm Tiêm chủng Nhi đồng SmartClinic
              </Text>
            </View>
          </View>
          <View style={[styles.memberNoteBox, { marginTop: 8 }]}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={COLORS.secondary}
            />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.docName}>Vắc-xin Cúm mùa Tứ giá (Influvac)</Text>
              <Text style={styles.docSub}>
                Đã tiêm: 12/08/2024 • Lô: #INF-2024-88A • Không phản ứng phụ
              </Text>
            </View>
          </View>
        </View>

        {/* Latest Pediatric Examination */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Lần khám Nhi khoa gần nhất"
            subtitle="10/09/2024 • BS. CKI. Lê Hoàng Yến"
          />
          <Text style={styles.docName}>
            Khám tổng quát định kỳ & Tư vấn dinh dưỡng 4 tuổi
          </Text>
          <Text style={styles.checkItemText}>
            Tim phổi bình thường, phản xạ vận động tốt. Khuyến nghị bổ sung
            Vitamin D3 400 IU/ngày và tăng cường rau xanh, cá hồi.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 16: [1:4230] THÊM MỚI / CHỈNH SỬA HỒ SƠ NGƯỜI THÂN
// ============================================================================
export const AddEditFamilyMemberScreen: React.FC<{ onBack?: () => void }> = ({
  onBack,
}) => {
  const [name, setName] = useState('NGUYỄN BẢO ANH');
  const [dob, setDob] = useState('18/06/2019');
  const [relation, setRelation] = useState('Con cái');
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);
  const [bhyt, setBhyt] = useState('TE1 79 234 99102');

  const RELATION_OPTIONS = [
    'Bố ruột',
    'Mẹ ruột',
    'Vợ / Chồng',
    'Con cái',
    'Ông / Bà',
    'Khác',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Thêm Hồ Sơ Người Thân"
        subtitle="Chủ tài khoản bảo trợ: Nguyễn Văn Vũ"
        onBack={onBack}
      />
      <ScrollView
        contentContainerStyle={styles.scrollPad}
        keyboardShouldPersistTaps="handled"
      >
        {/* AI Quick Scan Banner */}
        <LinearGradient
          colors={GRADIENTS.primaryTeal}
          style={[styles.heroCard, SHADOWS.sm]}
        >
          <View style={styles.rowBetween}>
            <Badge label="Công nghệ AI OCR" variant="glass" icon="scan" />
            <Badge label="Khớp cổng VssID" variant="teal" />
          </View>
          <Text style={[styles.whiteTitle, { marginTop: 8 }]}>
            Quét CCCD hoặc Thẻ BHYT
          </Text>
          <Text style={styles.whiteSub}>
            Tự động điền 8 mục hồ sơ chính xác 99.8% trong 3 giây.
          </Text>
          <AppButton
            title="Quét thẻ ngay"
            variant="white"
            size="sm"
            leftIcon="camera-outline"
            fullWidth={false}
            style={{ marginTop: 10, alignSelf: 'flex-start' }}
          />
        </LinearGradient>

        {/* Relationship 1-Row Dropdown Selector */}
        <SectionHeader title="Mối quan hệ với bạn *" />
        <View style={styles.dropdownWrap}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowRelationDropdown((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={`Mối quan hệ với bạn: ${relation}`}
            accessibilityState={{ expanded: showRelationDropdown }}
            style={[
              styles.dropdownTrigger,
              SHADOWS.sm,
              showRelationDropdown && styles.dropdownTriggerActive,
            ]}
          >
            <View style={styles.dropdownTriggerLeft}>
              <Ionicons
                name="people-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.dropdownValueText} numberOfLines={1}>
                {relation}
              </Text>
            </View>
            <Ionicons
              name={showRelationDropdown ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>

          {showRelationDropdown && (
            <View style={[styles.dropdownMenu, SHADOWS.sm]}>
              {RELATION_OPTIONS.map((rel, idx) => {
                const active = relation === rel;
                return (
                  <TouchableOpacity
                    key={rel}
                    activeOpacity={0.8}
                    accessibilityRole="menuitem"
                    accessibilityLabel={rel}
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      setRelation(rel);
                      setShowRelationDropdown(false);
                    }}
                    style={[
                      styles.dropdownOptionRow,
                      idx === RELATION_OPTIONS.length - 1 && {
                        borderBottomWidth: 0,
                      },
                      active && styles.dropdownOptionRowActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        active && styles.dropdownOptionTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {rel}
                    </Text>
                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader title="Thông tin hành chính & BHYT" />
          <AppInput
            label="Họ và tên đầy đủ (Chữ IN HOA có dấu) *"
            leftIcon="person-outline"
            value={name}
            onChangeText={setName}
          />
          <AppInput
            label="Ngày sinh *"
            leftIcon="calendar-outline"
            value={dob}
            onChangeText={setDob}
          />
          <AppInput
            label="Mã số BHYT / Định danh VssID"
            leftIcon="card-outline"
            value={bhyt}
            onChangeText={setBhyt}
          />
        </View>

        <AppButton
          title="Lưu hồ sơ người thân"
          variant="primary"
          size="lg"
          leftIcon="checkmark-circle-outline"
          onPress={onBack}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ============================================================================
// SCREEN 17: CHAT TRỰC TUYẾN VỚI BÁC SĨ (REAL-TIME DOCTOR-PATIENT CHAT)
// ============================================================================
interface DoctorChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
  attachmentTitle?: string;
  attachmentSubtitle?: string;
}

const INITIAL_DOCTOR_CHAT: DoctorChatMessage[] = [
  {
    id: 'dc-1',
    sender: 'doctor',
    text: 'Chào anh Vũ, bác sĩ đã xem hồ sơ khám và kết quả chụp MRI sọ não sáng nay của anh. Hiện tại triệu chứng đau nửa đầu của anh thế nào rồi?',
    time: '14:02',
  },
  {
    id: 'dc-2',
    sender: 'patient',
    text: 'Dạ chào bác sĩ Trang, em vẫn còn đau âm ỉ vùng thái dương phải, nhất là khi ngồi máy tính lâu và thiếu ngủ ạ.',
    time: '14:03',
  },
  {
    id: 'dc-3',
    sender: 'doctor',
    text: 'Kết quả MRI 1.5 Tesla cho thấy nhu mô não và hệ mạch máu hoàn toàn bình thường, không có tổn thương thực thể. Tình trạng của anh là Đau nửa đầu Migraine cơ năng (mã ICD-10: G43.0) kèm căng thẳng thần kinh.',
    time: '14:05',
    attachmentTitle: 'Kết quả MRI Sọ Não & Mạch Máu (#CLS-2024-9042)',
    attachmentSubtitle: 'Bình thường • Không dị dạng mạch máu não',
  },
  {
    id: 'dc-4',
    sender: 'doctor',
    text: 'Bác sĩ đã kê đơn thuốc điều trị cắt cơn và dự phòng uống buổi tối trong 14 ngày. Anh xem có thắc mắc gì về liều dùng không nhé?',
    time: '14:06',
  },
];

export const TeleconsultationScreen: React.FC<{
  onBack?: () => void;
  onFinishChat?: () => void;
  onOpenLabResults?: () => void;
}> = ({ onBack, onFinishChat, onOpenLabResults }) => {
  const doctor = DOCTORS[0];
  const [messages, setMessages] =
    useState<DoctorChatMessage[]>(INITIAL_DOCTOR_CHAT);
  const [inputText, setInputText] = useState('');
  const chatScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const handleSendMessage = (customText?: string) => {
    const content = (customText ?? inputText).trim();
    if (!content) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const patientMsg: DoctorChatMessage = {
      id: `pt-${Date.now()}`,
      sender: 'patient',
      text: content,
      time: timeStr,
    };

    let doctorReply =
      'Bác sĩ đã ghi nhận. Anh nhớ uống thuốc đúng cử, hạn chế nhìn màn hình sau 21:00 và tái khám sau 2 tuần nhé!';
    if (content.toLowerCase().includes('buồn ngủ')) {
      doctorReply =
        'Thuốc Flunarizine 5mg có thể gây buồn ngủ nhẹ để hỗ trợ giấc ngủ sâu, vì vậy bác sĩ chỉ định anh uống 1 viên sau ăn tối lúc 21:00 nhé.';
    } else if (content.toLowerCase().includes('tái khám')) {
      doctorReply =
        'Anh uống hết đơn 14 ngày rồi đặt lịch tái khám trên ứng dụng. Nếu cơn đau giảm trên 80% thì chỉ cần duy trì chế độ sinh hoạt điều độ.';
    }

    const docMsg: DoctorChatMessage = {
      id: `dr-${Date.now() + 1}`,
      sender: 'doctor',
      text: doctorReply,
      time: timeStr,
    };

    setMessages((prev) => [...prev, patientMsg, docMsg]);
    if (!customText) {
      setInputText('');
    }
    setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Chat Trực Tuyến Với Bác Sĩ"
        subtitle="TS. BS. Lê Thu Trang • Nội Thần Kinh"
        badgeText="TRỰC TUYẾN"
        onBack={onBack}
      />

      <ScrollView
        ref={chatScrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Doctor & Session Info Banner */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.docRow}>
            <Image source={{ uri: doctor.avatar }} style={styles.avatarMd} />
            <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={[styles.docName, { flex: 1 }]} numberOfLines={1}>
                  {doctor.name}
                </Text>
                <Badge label="Đang hoạt động" variant="teal" showDot />
              </View>
              <Text style={styles.docSub} numberOfLines={1}>
                Ca tư vấn #SC-241029-8892 • BN: Nguyễn Văn Vũ
              </Text>
              <Text style={styles.docHospital} numberOfLines={1}>
                {doctor.hospital}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <AppButton
              title="Kết quả CĐHA"
              variant="tonal"
              size="sm"
              leftIcon="document-text-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={onOpenLabResults}
            />
            <AppButton
              title="Đơn thuốc & Kết luận"
              variant="primary"
              size="sm"
              leftIcon="medkit-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={onFinishChat || onBack}
            />
          </View>
        </View>

        {/* Chat Messages Thread */}
        <View style={{ marginVertical: 4 }}>
          {messages.map((msg) => {
            const isPatient = msg.sender === 'patient';
            return (
              <View
                key={msg.id}
                style={[
                  styles.chatRow,
                  isPatient ? styles.chatRowRight : styles.chatRowLeft,
                ]}
              >
                {!isPatient && (
                  <Image
                    source={{ uri: doctor.avatar }}
                    style={styles.chatAvatar}
                  />
                )}
                <View
                  style={[
                    styles.chatBubble,
                    isPatient
                      ? styles.chatBubblePatient
                      : styles.chatBubbleDoctor,
                  ]}
                >
                  {!isPatient && (
                    <Text style={styles.chatSenderName}>{doctor.name}</Text>
                  )}
                  <Text
                    style={[
                      styles.chatMsgText,
                      isPatient && { color: '#FFFFFF' },
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {msg.attachmentTitle && (
                    <TouchableOpacity
                      style={styles.chatAttachmentCard}
                      onPress={onOpenLabResults}
                    >
                      <Ionicons
                        name="document-attach-outline"
                        size={20}
                        color={COLORS.primary}
                      />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.chatAttachmentTitle} numberOfLines={1}>
                          {msg.attachmentTitle}
                        </Text>
                        <Text style={styles.chatAttachmentSub} numberOfLines={1}>
                          {msg.attachmentSubtitle}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  )}

                  <Text
                    style={[
                      styles.chatTimeText,
                      isPatient && { color: 'rgba(255,255,255,0.8)' },
                    ]}
                  >
                    {msg.time} {isPatient ? '• Đã xem' : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Question Chips */}
        <Text style={[styles.capLabel, { marginBottom: 8, marginTop: 4 }]}>
          CÂU HỎI NHANH CHO BÁC SĨ
        </Text>
        <View style={styles.chipsWrap}>
          {[
            'Thuốc uống có gây buồn ngủ không BS?',
            'Khi nào em cần tái khám?',
            'Em cảm ơn bác sĩ nhiều ạ!',
          ].map((quickText) => (
            <TouchableOpacity
              key={quickText}
              style={styles.quickReplyChip}
              onPress={() => handleSendMessage(quickText)}
            >
              <Text style={styles.quickReplyText}>{quickText}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Real-time Message Input */}
      <ChatBottomInputBar
        value={inputText}
        onChangeText={setInputText}
        onSend={() => handleSendMessage()}
      />
    </KeyboardAvoidingView>
  );
};

// ============================================================================
// SCREEN 17B: TÓM TẮT KẾT QUẢ KHÁM & ĐƠN THUỐC SAU TƯ VẤN
// ============================================================================
export const PostConsultSummaryScreen: React.FC<{
  onBack?: () => void;
  onNavigate?: (routeKey: string) => void;
}> = ({ onBack, onNavigate }) => {
  const doctor = DOCTORS[0];

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Kết Quả Khám & Đơn Thuốc"
        subtitle="Hoàn tất tư vấn • Mã hồ sơ #SC-241029-8892"
        badgeText="ĐÃ HOÀN TẤT"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Clinical Diagnosis Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Badge label="CHẨN ĐOÁN XÁC ĐỊNH" variant="teal" showDot />
            <Text style={styles.capLabel}>29/10/2024 • 14:15</Text>
          </View>
          <Text style={[styles.docName, { marginTop: 8, fontSize: 16 }]}>
            G43.0 - Đau nửa đầu Migraine không có tiền triệu / Rối loạn giấc ngủ
          </Text>
          <Text style={[styles.docSub, { marginTop: 4 }]}>
            Bác sĩ điều trị: {doctor.name} ({doctor.specialty})
          </Text>

          <View style={styles.divider} />

          <Text style={styles.capLabel}>LỜI DẶN CỦA BÁC SĨ</Text>
          <Text style={styles.checkItemText}>
            • Uống thuốc đúng giờ theo đơn trong 14 ngày, không tự ý ngưng thuốc
            đột ngột.
          </Text>
          <Text style={styles.checkItemText}>
            • Giảm thời gian sử dụng máy tính/điện thoại sau 21:00, ngủ đủ 7-8
            giờ mỗi đêm.
          </Text>
          <Text style={styles.checkItemText}>
            • Tái khám sau 2 tuần hoặc nhắn tin trực tiếp cho bác sĩ nếu cơn đau
            tăng nặng.
          </Text>
        </View>

        {/* E-Prescription Card */}
        <SectionHeader
          title="Đơn Thuốc Điện Tử Đã Kê"
          badgeText="3 thuốc"
          badgeVariant="blue"
        />
        <ActivePrescriptionCard
          doctor={doctor}
          prescriptionCode="#DT-241029-01"
          date="29/10/2024"
          drugs={PRESCRIPTION_DRUGS}
          onViewOriginal={() => onNavigate?.('rxDetail')}
          onBuyMedicine={() => onNavigate?.('medicineCabinet')}
          onReminderPress={() => onNavigate?.('medLog')}
        />

        {/* Next Actions */}
        <AppButton
          title="Xem chi tiết đơn thuốc"
          variant="primary"
          size="lg"
          leftIcon="document-text-outline"
          onPress={() => onNavigate?.('rxDetail')}
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="Mở lịch nhắc uống thuốc"
          variant="secondary"
          size="lg"
          leftIcon="alarm-outline"
          onPress={() => onNavigate?.('medLog')}
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="Quay lại Chat với Bác sĩ"
          variant="outline"
          size="md"
          leftIcon="chatbubbles-outline"
          onPress={() => onNavigate?.('teleconsult')}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 18: [1:4768] KẾT QUẢ CẬN LÂM SÀNG & CĐHA
// ============================================================================
export const LabAndImagingResultsScreen: React.FC<{
  onBack?: () => void;
  onDownloadPDF?: () => void;
  onOpenTeleconsult?: () => void;
}> = ({ onBack, onDownloadPDF, onOpenTeleconsult }) => {
  const [tab, setTab] = useState('imaging');
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Kết Quả Cận Lâm Sàng & CĐHA"
        subtitle="Mã phiếu: #CLS-2024-9042 • Đã trả kết quả"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Meta Header Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge
            label="ĐÃ CÓ KẾT QUẢ CHÍNH THỨC"
            variant="teal"
            showDot
          />
          <Text style={[styles.docName, { marginTop: 8 }]}>
            Nguyễn Văn Vũ (32 tuổi • Nam • #BN-882910)
          </Text>
          <Text style={styles.docSub}>
            Bác sĩ chỉ định: TS. BS. Lê Thu Trang (Nội Thần Kinh)
          </Text>
          <Text style={styles.docSub}>
            Cơ sở thực hiện: BV ĐHYD TP.HCM — Khoa CĐHA & Xét Nghiệm
          </Text>
          <Text style={styles.docSub}>
            Thực hiện: 28/10/2024 08:45 • Trả kết quả: 10:15
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <AppButton
              title="Lưu Kết Quả PDF"
              variant="primary"
              size="sm"
              leftIcon="download-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={
                onDownloadPDF ||
                (() =>
                  Alert.alert(
                    'Lưu PDF Thành Công',
                    'Đã tải phiếu kết quả cận lâm sàng #CLS-2024-9042 về máy.'
                  ))
              }
            />
            <AppButton
              title="Gửi hỏi Bác sĩ"
              variant="tonal"
              size="sm"
              leftIcon="chatbubbles-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={onOpenTeleconsult}
            />
          </View>
        </View>

        <SegmentedControl
          variant="box"
          selectedKey={tab}
          onSelect={setTab}
          options={[
            { key: 'imaging', label: 'CĐHA (MRI/X-Quang)', count: 2 },
            { key: 'blood', label: 'Xét Nghiệm Máu', count: 14 },
          ]}
          style={{ marginBottom: 14 }}
        />

        {/* PACS / DICOM Deep Diagnostic Imaging */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Cộng Hưởng Từ Sọ Não (MRI 1.5 Tesla)"
            subtitle="Vùng khảo sát: Sọ não & Mạch máu nội sọ (MRA)"
            badgeText="PACS v4.2"
            badgeVariant="blue"
          />
          <Text style={styles.checkItemText}>
            • Hệ thống não thất bên, não thất III và IV không giãn, cân đối qua
            đường giữa.
          </Text>
          <Text style={styles.checkItemText}>
            • Chuỗi xung MRA TOF 3D: Đa giác Willis và các nhánh động mạch não
            trước, giữa, sau lưu thông tốt, không phình mạch.
          </Text>
        </View>

        {/* Detailed Lab Test Results */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Bảng 14 Chỉ Số Sinh Hóa & Huyết Học"
            badgeText="14/14 Chuẩn"
            badgeVariant="teal"
          />
          {[
            { name: 'Glucose máu lúc đói', val: '5.2 mmol/L', ref: '3.9 - 6.4' },
            { name: 'HbA1c', val: '5.4 %', ref: '4.0 - 6.0' },
            { name: 'Cholesterol toàn phần', val: '4.8 mmol/L', ref: '< 5.2' },
            { name: 'Men gan AST / ALT', val: '22 / 24 U/L', ref: '< 35' },
            { name: 'Creatinine huyết thanh', val: '78 µmol/L', ref: '62 - 106' },
          ].map((lab) => (
            <View key={lab.name} style={styles.labRow}>
              <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                <Text style={styles.docName} numberOfLines={1}>
                  {lab.name}
                </Text>
                <Text style={styles.docSub} numberOfLines={1}>
                  Tham chiếu: {lab.ref}
                </Text>
              </View>
              <Text style={styles.labVal}>{lab.val}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollPad: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  cardCenter: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.tintTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  capLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  ticketCode: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMd: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  docName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  docSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  docHospital: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  ticketGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  ticketBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  ticketVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 2,
  },
  qrMockBox: {
    padding: 14,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    marginVertical: 12,
  },
  quickGrid3: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  quickBtnCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  quickBtnLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  checkItemText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  heroCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
  },
  whiteTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  whiteSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  whiteBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#FFFFFF',
    marginTop: 8,
  },
  memberNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginTop: 10,
    gap: 8,
  },
  memberNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textPrimary,
  },
  vitals3Grid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  vitalBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    alignItems: 'center',
  },
  vitalBig: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginVertical: 2,
  },
  vitalTag: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  dropdownWrap: {
    marginBottom: 14,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownTriggerActive: {
    borderColor: COLORS.primary,
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  dropdownValueText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  dropdownOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownOptionRowActive: {
    backgroundColor: COLORS.surfaceContainerLow,
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dropdownOptionTextActive: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  chatRowLeft: {
    justifyContent: 'flex-start',
  },
  chatRowRight: {
    justifyContent: 'flex-end',
  },
  chatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  chatBubble: {
    maxWidth: '82%',
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...SHADOWS.sm,
  },
  chatBubbleDoctor: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chatBubblePatient: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  chatSenderName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  chatMsgText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORS.textPrimary,
  },
  chatAttachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DCE6FF',
  },
  chatAttachmentTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  chatAttachmentSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chatTimeText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },
  quickReplyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  labRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  labVal: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
