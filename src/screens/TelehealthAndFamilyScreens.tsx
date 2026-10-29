import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from '../theme';
import { DOCTORS, PATIENT_PROFILE } from '../data/mockData';
import {
  AppHeader,
  AppButton,
  AppInput,
  Badge,
  SectionHeader,
  SegmentedControl,
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
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Badge label="Khám chuyên khoa" variant="blue" />
              <Text style={[styles.docName, { marginTop: 4 }]}>{doctor.name}</Text>
              <Text style={styles.docSub}>{doctor.degree}</Text>
              <Text style={styles.docHospital}>{doctor.hospital}</Text>
            </View>
          </View>

          <View style={styles.ticketGrid}>
            <View style={styles.ticketBox}>
              <Text style={styles.capLabel}>THỜI GIAN KHÁM</Text>
              <Text style={styles.ticketVal}>09:30 - 10:00</Text>
              <Text style={styles.docSub}>Thứ 3, 29/10/2024</Text>
            </View>
            <View style={styles.ticketBox}>
              <Text style={styles.capLabel}>PHÒNG KHÁM & STT</Text>
              <Text style={[styles.ticketVal, { color: COLORS.secondary }]}>
                STT #14 • P.302
              </Text>
              <Text style={styles.docSub}>Tầng 3, Tòa nhà A</Text>
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
              action: () => onNavigate?.('downloadA4Preview'),
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
            <Badge label="Đã đồng bộ VssID & BHYT gia đình" variant="teal" />
          </View>
          <View style={[styles.docRow, { marginTop: 10 }]}>
            <Image
              source={{ uri: PATIENT_PROFILE.avatar }}
              style={styles.avatarMd}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.docName}>Nguyễn Văn Vũ (Bản thân)</Text>
              <Text style={styles.docSub}>
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
              title="Nhắc đo huyết áp"
              variant="white"
              size="sm"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => onNavigate?.('medLog')}
            />
            <AppButton
              title="Đặt hẹn tiêm nhắc"
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
            style={[styles.card, SHADOWS.sm]}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.docName}>{mem.name}</Text>
              <Badge label={mem.badge} variant="blue" />
            </View>
            <Text style={styles.docSub}>
              {mem.relation} • Mã EHR: {mem.code} • Nhóm máu {mem.blood}
            </Text>
            <View style={styles.memberNoteBox}>
              <Ionicons
                name="medical-outline"
                size={14}
                color={COLORS.secondary}
              />
              <Text style={styles.memberNoteText}>{mem.note}</Text>
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
            <View>
              <Text style={styles.docName}>Nguyễn Bảo Nam</Text>
              <Text style={styles.docSub}>
                Nam (18/09/2020) • Nhóm máu O+ • Chủ hộ: Nguyễn Văn Vũ
              </Text>
            </View>
            <Badge label="Chuẩn WHO" variant="teal" />
          </View>

          <View style={styles.vitals3Grid}>
            <View style={styles.vitalBox}>
              <Text style={styles.capLabel}>Chiều cao</Text>
              <Text style={styles.vitalBig}>104 cm</Text>
              <Text style={styles.vitalTag}>Chuẩn WHO</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.capLabel}>Cân nặng</Text>
              <Text style={styles.vitalBig}>16.5 kg</Text>
              <Text style={styles.vitalTag}>+0.4kg/quý</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.capLabel}>BMI Thể trạng</Text>
              <Text style={styles.vitalBig}>15.2</Text>
              <Text style={styles.vitalTag}>Phát triển tốt</Text>
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
            badgeText="Sắp tới (5 ngày)"
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
  const [bhyt, setBhyt] = useState('TE1 79 234 99102');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Thêm Hồ Sơ Người Thân"
        subtitle="Chủ tài khoản bảo trợ: Nguyễn Văn Vũ"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
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

        {/* Relationship Selector */}
        <SectionHeader title="Mối quan hệ với bạn *" />
        <View style={styles.chipsWrap}>
          {['Bố ruột', 'Mẹ ruột', 'Vợ / Chồng', 'Con cái', 'Ông / Bà', 'Khác'].map(
            (rel) => {
              const active = relation === rel;
              return (
                <TouchableOpacity
                  key={rel}
                  onPress={() => setRelation(rel)}
                  style={[styles.relChip, active && styles.relChipActive]}
                >
                  <Text
                    style={[
                      styles.relChipText,
                      active && styles.relChipTextActive,
                    ]}
                  >
                    {rel}
                  </Text>
                </TouchableOpacity>
              );
            }
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
          title="Lưu & Đồng bộ Hồ sơ Người thân"
          variant="primary"
          size="lg"
          leftIcon="checkmark-circle-outline"
          onPress={onBack}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 17: [1:4593] TƯ VẤN TRỰC TUYẾN - TS. BS. LÊ THU TRANG
// ============================================================================
export const TeleconsultationScreen: React.FC<{
  onBack?: () => void;
  onOpenLabResults?: () => void;
}> = ({ onBack, onOpenLabResults }) => {
  const doctor = DOCTORS[0];
  const [mriMode, setMriMode] = useState('flair');
  const [muted, setMuted] = useState(false);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tư Vấn Video Trực Tuyến"
        subtitle="Bệnh viện ĐHYD TP.HCM • Phòng Telehealth 04"
        badgeText="FHD 1080p"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Doctor Video Feed Frame */}
        <View style={[styles.videoFrame, SHADOWS.md]}>
          <Image source={{ uri: doctor.avatar }} style={styles.videoBgImage} />
          <View style={styles.videoOverlayTop}>
            <Badge
              label="BS. Thu Trang đang nói"
              variant="teal"
              showDot
            />
            <Badge label="14:22" variant="danger" showDot />
          </View>
          <View style={styles.pipBox}>
            <Image
              source={{ uri: PATIENT_PROFILE.avatar }}
              style={styles.pipImg}
            />
            <Text style={styles.pipLabel}>Bạn (Vũ)</Text>
          </View>
          <View style={styles.videoCaptionBar}>
            <Text style={styles.videoCaptionText}>
              “BS. Thu Trang: Nhu mô não trán đỉnh đều đặn, không có tổn thương
              khu trú.”
            </Text>
          </View>
        </View>

        {/* Interactive PACS Screen Sharing Module: Brain MRI T2-FLAIR */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="scan-circle" size={20} color={COLORS.primary} />
              <Text style={styles.docName}>
                Xem MRI Đồng Thời (Axial T2-FLAIR)
              </Text>
            </View>
            <Badge label="3.0 Tesla" variant="blue" />
          </View>
          <Text style={styles.docSub}>
            Lát cắt: 18 / 36 • TR: 9000 TE: 120 • BN: Nguyễn Văn Vũ (#BN-882910)
          </Text>

          <SegmentedControl
            variant="chips"
            selectedKey={mriMode}
            onSelect={setMriMode}
            options={[
              { key: 't1', label: 'Chuỗi T1-WI' },
              { key: 'flair', label: 'T2-FLAIR (Đang xem)' },
              { key: 'mra', label: 'MRA Mạch Máu' },
            ]}
            style={{ marginVertical: 10 }}
          />

          <View style={styles.memberNoteBox}>
            <Ionicons
              name="checkmark-done-circle"
              size={16}
              color={COLORS.secondary}
            />
            <Text style={styles.memberNoteText}>
              Kết luận cận lâm sàng: Không phát hiện tổn thương nhu mô não,
              không có ổ nhồi máu hay dị dạng mạch máu. Đau đầu phù hợp hội
              chứng Migraine cơ năng.
            </Text>
          </View>
        </View>

        {/* Real-time AI Medical Scribe */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.docName}>SmartScribe AI • Ghi nhận trực tiếp</Text>
            <Badge label="Đang lắng nghe" variant="teal" showDot />
          </View>
          <Text style={styles.checkItemText}>
            • <Text style={{ fontWeight: '700' }}>Chẩn đoán sơ bộ:</Text> G43.0
            - Đau nửa đầu Migraine không có tiền triệu / Rối loạn giấc ngủ do
            căng thẳng.
          </Text>
          <Text style={styles.checkItemText}>
            • <Text style={{ fontWeight: '700' }}>Kế hoạch điều trị:</Text> Kê
            đơn cắt cơn + thuốc dự phòng Flunarizine 5mg uống tối.
          </Text>
          <Text style={styles.checkItemText}>
            • <Text style={{ fontWeight: '700' }}>Dặn dò:</Text> Giảm thời gian
            nhìn màn hình sau 21:00, duy trì giấc ngủ 7-8 tiếng, tái khám sau 4
            tuần.
          </Text>
        </View>

        {/* Call Controls */}
        <View style={styles.callDock}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => setMuted(!muted)}
          >
            <Ionicons
              name={muted ? 'mic-off' : 'mic'}
              size={20}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="videocam" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={onOpenLabResults || onBack}
          >
            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.callBtn, { backgroundColor: COLORS.error }]}
            onPress={onBack}
          >
            <Ionicons name="call" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <AppButton
          title="Kết thúc cuộc gọi & Xem Tóm tắt Sau Khám + Đơn Ký Số →"
          variant="primary"
          size="lg"
          leftIcon="document-text-outline"
          onPress={onBack}
          style={{ marginTop: 12 }}
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
        subtitle="Mã phiếu: #CLS-2024-9042 • Đã ký số bảo mật"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Meta Header Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge
            label="ĐÃ CÓ KẾT QUẢ CHÍNH THỨC • KÝ SỐ BẢO MẬT"
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
              title="Tải PDF Ký Số"
              variant="primary"
              size="sm"
              leftIcon="download-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={onDownloadPDF}
            />
            <AppButton
              title="Xem DICOM Gốc"
              variant="tonal"
              size="sm"
              leftIcon="scan-outline"
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
              <View style={{ flex: 1 }}>
                <Text style={styles.docName}>{lab.name}</Text>
                <Text style={styles.docSub}>Tham chiếu: {lab.ref}</Text>
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
  relChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  relChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  relChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  relChipTextActive: {
    color: '#FFFFFF',
  },
  videoFrame: {
    height: 230,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    marginBottom: 14,
    position: 'relative',
    justifyContent: 'space-between',
  },
  videoBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  videoOverlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  pipBox: {
    position: 'absolute',
    right: 12,
    top: 48,
    width: 76,
    height: 98,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#1E293B',
  },
  pipImg: {
    width: '100%',
    height: '100%',
  },
  pipLabel: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoCaptionBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    padding: 10,
  },
  videoCaptionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  callDock: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 10,
  },
  callBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
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
