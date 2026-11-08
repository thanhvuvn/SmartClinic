import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TOUCH, TYPOGRAPHY } from '../theme';
import {
  DoctorItem,
  DOCTORS,
  BOOKING_DAYS,
  TIME_SLOTS,
  TimeSlotItem,
  SPECIALTIES,
  HOSPITALS,
  APPOINTMENTS,
  PATIENT_PROFILE,
} from '../data/mockData';
import {
  AppHeader,
  DoctorProfileHeaderCard,
  SectionHeader,
  Badge,
  SegmentedControl,
  PatientReviewCard,
  AppButton,
  StickyBottomBar,
  StepIndicator,
  BookingDoctorSummaryCard,
  HorizontalDateSelector,
  TimeSlotGrid,
  AppInput,
  SearchBar,
  AIHeroBanner,
  SmartPromoBanner,
  SpecialtyGrid,
  FeaturedDoctorCard,
  HospitalCard,
  AppointmentCard,
  PatientMasterIdentityCard,
  VssIDInsuranceCard,
  HospitalMapModal,
  AnimatedEntry,
  PressableScale,
  PulsingDot,
} from '../components';
import { findHospitalForDoctor } from '../utils/mapNavigation';
import { shareDoctorProfile } from '../utils/shareUtils';

export interface DoctorDetailScreenProps {
  doctor: DoctorItem;
  onBack: () => void;
  onBookSlot: (doctor: DoctorItem) => void;
}

export const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({
  doctor,
  onBack,
  onBookSlot,
}) => {
  const [selectedDay, setSelectedDay] = useState('d2');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const doctorHospital = findHospitalForDoctor(doctor);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chi Tiết Bác Sĩ"
        onBack={onBack}
        rightActions={[
          {
            icon: 'share-social-outline',
            onPress: () => shareDoctorProfile(doctor),
          },
          {
            icon: bookmarked ? 'bookmark' : 'bookmark-outline',
            onPress: () => setBookmarked((prev) => !prev),
          },
        ]}
        showProfileIcon
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <DoctorProfileHeaderCard
          doctor={doctor}
          style={{ marginBottom: 14 }}
        />

        {/* Work Location Card */}
        <PressableScale
          activeScale={0.98}
          onPress={() => setMapModalVisible(true)}
          style={[styles.card, SHADOWS.sm]}
        >
          <View style={styles.locationRow}>
            <View style={styles.locationIconBox}>
              <Ionicons
                name="business-outline"
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.locationTitle}>{doctor.hospital}</Text>
              <Text style={styles.locationSub} numberOfLines={1}>
                {doctor.address}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: COLORS.primary,
                  marginTop: 3,
                }}
              >
                Chạm để xem cổng vào, bãi xe & mở chỉ đường Google Maps ➔
              </Text>
            </View>
            <TouchableOpacity
              style={styles.mapCircleBtn}
              onPress={() => setMapModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`Xem bản đồ ${doctor.hospital}`}
              hitSlop={TOUCH.hitSlopSm}
            >
              <Ionicons
                name="navigate"
                size={16}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </PressableScale>

        {/* About & Training Section */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Giới thiệu & Đào tạo"
            leftIcon="person-circle-outline"
          />
          <Text style={styles.bioText}>{doctor.bio}</Text>

          <Text style={styles.strengthHeader}>
            Chuyên môn điều trị thế mạnh
          </Text>
          <View style={styles.strengthList}>
            {doctor.strengths.map((st) => (
              <Badge
                key={st}
                label={st}
                variant="surface"
                showDot
                style={{ marginBottom: 6 }}
              />
            ))}
          </View>
        </View>

        {/* Weekly Schedule Section */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Lịch khám trong tuần"
            leftIcon="calendar-outline"
          />
          <HorizontalDateSelector
            days={BOOKING_DAYS}
            selectedDayId={selectedDay}
            onSelectDay={setSelectedDay}
            style={{ marginBottom: 12 }}
          />

          <View style={styles.shiftBox}>
            <View style={styles.shiftHeader}>
              <View style={styles.shiftHeaderLeft}>
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={COLORS.primary}
                />
                <Text style={styles.shiftHeaderTitle}>
                  Khung giờ Thứ 3 (29/10/2024)
                </Text>
              </View>
              <Text style={styles.shiftHeaderRight}>Ca sáng & Chiều</Text>
            </View>

            <View style={styles.shiftsGrid}>
              <View style={styles.shiftCardItem}>
                <View>
                  <Text style={styles.shiftPeriod}>Buổi sáng</Text>
                  <Text style={styles.shiftHours}>08:00 - 11:30</Text>
                </View>
                <View style={styles.greenDot} />
              </View>
              <View style={styles.shiftCardItem}>
                <View>
                  <Text style={styles.shiftPeriod}>Buổi chiều</Text>
                  <Text style={styles.shiftHours}>13:30 - 17:00</Text>
                </View>
                <View style={styles.greenDot} />
              </View>
            </View>
          </View>
        </View>

        {/* Patient Reviews Section */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Đánh giá của bệnh nhân"
            leftIcon="star"
            actionText={`${doctor.rating} / 5 (${doctor.reviewCount})`}
          />

          <SegmentedControl
            variant="chips"
            selectedKey={reviewFilter}
            onSelect={setReviewFilter}
            options={[
              { key: 'all', label: `Tất cả (${doctor.reviewCount})` },
              { key: 'photo', label: 'Có hình ảnh' },
              { key: '5star', label: '5 sao (168)' },
              { key: 'recent', label: 'Gần đây' },
            ]}
            style={{ marginBottom: 12 }}
          />

          <PatientReviewCard
            initials="HN"
            initialsBg={COLORS.primaryContainer}
            authorName="Nguyễn Hoàng Nam"
            metaText="3 ngày trước • Khám Đau đầu thái dương"
            comment="Bác sĩ Trang tư vấn rất kỹ lưỡng và ân cần, giải thích rõ nguyên nhân tôi bị đau đầu thái dương do stress công việc. Uống thuốc theo toa 2 ngày đã đỡ hẳn."
          />

          <PatientReviewCard
            initials="MT"
            initialsBg={COLORS.secondaryContainer}
            authorName="Trần Minh Tâm"
            metaText="1 tuần trước • Khám Tiền đình & MRI"
            comment="Bác sĩ giải thích cặn kẽ kết quả chụp MRI và hướng dẫn tập luyện giảm áp lực mắt, thái độ nhẹ nhàng chu đáo."
          />

          <AppButton
            title={`Xem tất cả ${doctor.reviewCount} đánh giá`}
            variant="tonal"
            size="sm"
            rightIcon="chevron-forward"
          />
        </View>

        {/* Clinic Guarantee Badge */}
        <View style={styles.guaranteeRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={COLORS.secondary}
          />
          <Text style={styles.guaranteeText}>
            SmartClinic bảo lãnh chất lượng chuyên môn & bảo mật bệnh án
          </Text>
        </View>
      </ScrollView>

      <StickyBottomBar
        topLabel="Phí tư vấn khám"
        priceValue={doctor.fee}
        buttonTitle="Đặt lịch khám"
        onButtonPress={() => onBookSlot(doctor)}
      />

      <HospitalMapModal
        visible={mapModalVisible}
        initialHospital={doctorHospital}
        onClose={() => setMapModalVisible(false)}
        onBookAtHospital={() => onBookSlot(doctor)}
      />
    </View>
  );
};

export interface BookingSlotScreenProps {
  doctor: DoctorItem;
  onBack: () => void;
  onConfirmBooking: (details?: {
    doctor: DoctorItem;
    day: any;
    slot: TimeSlotItem;
    consultMode: string;
  }) => void;
}

export const BookingSlotScreen: React.FC<BookingSlotScreenProps> = ({
  doctor,
  onBack,
  onConfirmBooking,
}) => {
  const [consultMode, setConsultMode] = useState('clinic');
  const [selectedDayId, setSelectedDayId] = useState('d2');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotItem>(TIME_SLOTS[3]);

  const currentDay =
    BOOKING_DAYS.find((d) => d.id === selectedDayId) || BOOKING_DAYS[1];

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chọn Thời Gian Khám"
        onBack={onBack}
        rightActions={[{ icon: 'information-circle-outline' }]}
        showProfileIcon
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator
          steps={['Chọn bác sĩ', 'Chọn lịch', 'Thanh toán']}
          currentStep={1}
        />

        <BookingDoctorSummaryCard
          doctor={doctor}
          style={{ marginVertical: 14 }}
        />

        <SegmentedControl
          variant="box"
          selectedKey={consultMode}
          onSelect={setConsultMode}
          options={[
            {
              key: 'clinic',
              label: 'Khám tại bệnh viện',
              icon: 'add-circle-outline',
            },
            {
              key: 'chat',
              label: 'Tư vấn Chat trực tuyến',
              icon: 'chatbubbles-outline',
            },
          ]}
          style={{ marginBottom: 18 }}
        />

        <SectionHeader
          title="Chọn ngày khám"
          badgeText="Tháng 10 - 11, 2024"
          badgeVariant="blue"
          badgeIcon="calendar-outline"
        />
        <HorizontalDateSelector
          days={BOOKING_DAYS}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
          style={{ marginBottom: 16 }}
        />

        <TimeSlotGrid
          slots={TIME_SLOTS}
          selectedSlotId={selectedSlot.id}
          onSelectSlot={setSelectedSlot}
          style={{ marginBottom: 16 }}
        />

        {/* Insurance & Essential Note Box */}
        <View style={styles.insuranceNoteBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={18}
            color={COLORS.primary}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.insuranceNoteTitle}>
              Bảo hiểm Y tế & Thủ tục
            </Text>
            <Text style={styles.insuranceNoteDesc}>
              Áp dụng BHYT đúng tuyến hoặc thông tuyến theo quy định. Vui lòng
              mang theo <Text style={{ fontWeight: '700' }}>CCCD gắn chip</Text>{' '}
              hoặc ứng dụng <Text style={{ fontWeight: '700' }}>VssID</Text> khi
              đến khám.
            </Text>
          </View>
        </View>
      </ScrollView>

      <StickyBottomBar
        topLabel={`${selectedSlot.time}, ${currentDay.dayLabel} (${currentDay.fullDate})`}
        topLabelIcon="time-outline"
        priceLabel="Tạm tính:"
        priceValue={doctor.fee}
        buttonTitle="Tiếp tục"
        onButtonPress={() =>
          onConfirmBooking({
            doctor,
            day: currentDay,
            slot: selectedSlot,
            consultMode,
          })
        }
      />
    </View>
  );
};

// ============================================================================
// SCREEN: XÁC NHẬN & THANH TOÁN ĐA PHƯƠNG THỨC (PAYMENT STEP)
// ============================================================================
export type PaymentMethodType = 'at_clinic_bhyt' | 'vietqr' | 'vnpay' | 'momo';

export interface BookingPaymentScreenProps {
  doctor: DoctorItem;
  day?: any;
  slot?: TimeSlotItem;
  consultMode?: string;
  patient?: {
    name: string;
    meta: string;
  };
  onBack: () => void;
  onPaymentSuccess: (method: PaymentMethodType) => void;
}

export const BookingPaymentScreen: React.FC<BookingPaymentScreenProps> = ({
  doctor,
  day,
  slot,
  consultMode = 'clinic',
  patient,
  onBack,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType>('at_clinic_bhyt');

  const currentDay = day || BOOKING_DAYS[1];
  const currentSlot = slot || TIME_SLOTS[3];
  const isAtClinic = selectedMethod === 'at_clinic_bhyt';

  const paymentOptions = [
    {
      id: 'at_clinic_bhyt' as PaymentMethodType,
      title: 'Thanh toán tại viện bằng BHYT',
      sub: 'Xuất trình CCCD / VssID tại quầy để giảm trừ 80% - 100%',
      badge: 'Khuyên dùng có BHYT',
      badgeVariant: 'teal' as const,
      icon: 'business-outline' as const,
    },
    {
      id: 'vietqr' as PaymentMethodType,
      title: 'Chuyển khoản VietQR 24/7',
      sub: 'Quét mã QR bằng mọi app ngân hàng (Tự động xác nhận 3s)',
      badge: 'Miễn phí giao dịch',
      badgeVariant: 'blue' as const,
      icon: 'qr-code-outline' as const,
    },
    {
      id: 'vnpay' as PaymentMethodType,
      title: 'Cổng thanh toán VNPAY',
      sub: 'Thẻ ATM nội địa, Internet Banking, Visa / Mastercard',
      badge: 'Bảo mật PCI-DSS',
      badgeVariant: 'surface' as const,
      icon: 'card-outline' as const,
    },
    {
      id: 'momo' as PaymentMethodType,
      title: 'Ví điện tử MoMo',
      sub: 'Thanh toán một chạm qua ví điện tử MoMo tiện lợi',
      badge: 'Tích điểm Smart',
      badgeVariant: 'warning' as const,
      icon: 'wallet-outline' as const,
    },
  ];

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Xác Nhận & Thanh Toán"
        subtitle="Bước cuối: Hoàn tất đặt lịch khám"
        onBack={onBack}
        showProfileIcon
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator
          steps={['Chọn bác sĩ', 'Chọn lịch', 'Thanh toán']}
          currentStep={2}
        />

        {/* 1. Appointment Summary Overview Card */}
        <AnimatedEntry delay={40} direction="up">
          <View style={[styles.card, SHADOWS.sm, { marginVertical: 14 }]}>
            <View style={styles.paymentHeaderRow}>
              <View style={styles.paymentDocIconBox}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.paymentDocName} numberOfLines={1}>
                  {doctor.name}
                </Text>
                <Text style={styles.paymentDocSub} numberOfLines={1}>
                  {doctor.degree} • {doctor.hospital}
                </Text>
              </View>
              <Badge
                label={consultMode === 'chat' ? 'Tư vấn Chat' : 'Khám tại viện'}
                variant={consultMode === 'chat' ? 'blue' : 'teal'}
              />
            </View>

            <View style={styles.paymentDivider} />

            <View style={styles.paymentInfoGrid}>
              <View style={styles.paymentInfoCol}>
                <Text style={styles.paymentInfoCap}>THỜI GIAN KHÁM</Text>
                <Text style={styles.paymentInfoVal}>{currentSlot.time}</Text>
                <Text style={styles.paymentInfoSub}>
                  {currentDay.dayLabel}, {currentDay.fullDate}
                </Text>
              </View>
              <View style={styles.paymentInfoCol}>
                <Text style={styles.paymentInfoCap}>BỆNH NHÂN</Text>
                <Text style={styles.paymentInfoVal} numberOfLines={1}>
                  {patient?.name || PATIENT_PROFILE.name}
                </Text>
                <Text style={styles.paymentInfoSub} numberOfLines={1}>
                  {patient?.meta ||
                    `BHYT: ${PATIENT_PROFILE.bhytCode.split(' ')[0]} • ${PATIENT_PROFILE.gender} (${PATIENT_PROFILE.age}T)`}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedEntry>

        {/* 2. Fee Calculation Breakdown */}
        <AnimatedEntry delay={90} direction="up">
          <View style={[styles.card, SHADOWS.sm, { marginBottom: 16 }]}>
            <SectionHeader
              title="Chi tiết viện phí"
              leftIcon="receipt-outline"
            />

            <View style={styles.feeLineRow}>
              <Text style={styles.feeLineLabel}>Phí khám chuyên khoa:</Text>
              <Text style={styles.feeLineVal}>{doctor.fee}</Text>
            </View>

            <View style={styles.feeLineRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.feeLineLabel}>Giảm trừ BHYT:</Text>
                <Badge label="Đối soát tại quầy" variant="teal" />
              </View>
              <Text style={[styles.feeLineVal, { color: COLORS.secondary }]}>
                {isAtClinic ? 'Trừ 80% - 100%' : 'Chờ hoàn tiền'}
              </Text>
            </View>

            <View style={styles.feeLineRow}>
              <Text style={styles.feeLineLabel}>Tiện ích đặt lịch số & AI Triage:</Text>
              <Text style={[styles.feeLineVal, { color: COLORS.secondary }]}>
                Miễn phí (0 đ)
              </Text>
            </View>

            <View style={styles.paymentDivider} />

            <View style={styles.feeTotalRow}>
              <Text style={styles.feeTotalLabel}>Tổng số tiền cần trả:</Text>
              <Text style={styles.feeTotalVal}>
                {isAtClinic ? '0 đ (Trả tại viện)' : doctor.fee}
              </Text>
            </View>
          </View>
        </AnimatedEntry>

        {/* 3. Multi-Option Payment Selector */}
        <AnimatedEntry delay={140} direction="up">
          <SectionHeader title="Chọn phương thức thanh toán" />

          <View style={{ gap: 10, marginBottom: 16 }} accessibilityRole="radiogroup">
            {paymentOptions.map((opt) => {
              const isSelected = selectedMethod === opt.id;
              return (
                <PressableScale
                  key={opt.id}
                  activeScale={0.97}
                  onPress={() => setSelectedMethod(opt.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={`${opt.title}. ${opt.sub}`}
                  accessibilityState={{ selected: isSelected, checked: isSelected }}
                >
                  <View
                    style={[
                      styles.paymentMethodCard,
                      isSelected && styles.paymentMethodCardActive,
                      SHADOWS.sm,
                    ]}
                  >
                    <View style={styles.paymentMethodLeft}>
                      <View
                        style={[
                          styles.methodRadioCircle,
                          isSelected && styles.methodRadioCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.methodRadioDot} />}
                      </View>
                      <View
                        style={[
                          styles.methodIconBox,
                          isSelected && styles.methodIconBoxActive,
                        ]}
                      >
                        <Ionicons
                          name={opt.icon}
                          size={20}
                          color={isSelected ? COLORS.primary : COLORS.textSecondary}
                        />
                      </View>
                      <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text
                            style={[
                              styles.methodTitle,
                              isSelected && styles.methodTitleActive,
                            ]}
                            numberOfLines={1}
                          >
                            {opt.title}
                          </Text>
                        </View>
                        <Text style={styles.methodSub} numberOfLines={2}>
                          {opt.sub}
                        </Text>
                      </View>
                    </View>
                    <Badge label={opt.badge} variant={opt.badgeVariant} />
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </AnimatedEntry>

        {/* 4. Dynamic Interactive Instructions Box */}
        <AnimatedEntry delay={190} direction="up">
          {isAtClinic ? (
            <View style={[styles.clinicInstructionBox, SHADOWS.sm]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.secondary} />
                <Text style={styles.clinicInstructionTitle}>
                  Chính sách BHYT & Hướng dẫn tại viện
                </Text>
              </View>
              <Text style={styles.clinicInstructionText}>
                • Bạn <Text style={{ fontWeight: '700' }}>không cần thanh toán trước</Text> qua ứng dụng.{'\n'}
                • Giữ chỗ và nhận số thứ tự (STT) miễn phí ngay sau bước này.{'\n'}
                • Khi đến bệnh viện, chỉ cần quét mã QR tại Kiosk tiếp đón và xuất trình <Text style={{ fontWeight: '700' }}>CCCD gắn chip</Text> hoặc ứng dụng <Text style={{ fontWeight: '700' }}>VssID</Text> để trừ tiền trực tiếp.
              </Text>
            </View>
          ) : selectedMethod === 'vietqr' ? (
            <View style={[styles.onlineTransferBox, SHADOWS.sm]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ionicons name="flash-outline" size={20} color={COLORS.primary} />
                <Text style={styles.clinicInstructionTitle}>
                  Thông tin chuyển khoản VietQR 24/7
                </Text>
              </View>
              <View style={styles.qrRow}>
                <View style={styles.qrMockThumbnail}>
                  <Ionicons name="qr-code" size={54} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.qrBankName}>Vietcombank • CN Tân Bình</Text>
                  <Text style={styles.qrAccountNum}>STK: 988241029</Text>
                  <Text style={styles.qrOwnerName}>BV SMARTCLINIC Y TẾ SỐ</Text>
                  <Text style={styles.qrMemo}>Nội dung: SC241029 8892</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.onlineTransferBox, SHADOWS.sm]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                <Text style={styles.clinicInstructionTitle}>
                  Bảo mật giao dịch y tế chuẩn PCI-DSS
                </Text>
              </View>
              <Text style={[styles.clinicInstructionText, { marginTop: 6 }]}>
                Hệ thống kết nối trực tiếp với cổng thanh toán bảo mật. Hóa đơn điện tử VAT chuẩn Bộ Tài chính sẽ được gửi ngay vào hồ sơ sau khi hoàn tất.
              </Text>
            </View>
          )}
        </AnimatedEntry>
      </ScrollView>

      {/* 5. Sticky Bottom Action Bar */}
      <StickyBottomBar
        topLabel={isAtClinic ? 'Thanh toán tại viện với BHYT' : `Cổng thanh toán: ${selectedMethod.toUpperCase()}`}
        topLabelIcon={isAtClinic ? 'business-outline' : 'card-outline'}
        priceLabel="Cần thanh toán:"
        priceValue={isAtClinic ? '0 đ' : doctor.fee}
        buttonTitle={isAtClinic ? 'Xác nhận đặt lịch' : 'Thanh toán ngay'}
        onButtonPress={() => onPaymentSuccess(selectedMethod)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollPad: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  card: {
    ...LAYOUT.card,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  locationSub: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mapCircleBtn: {
    width: TOUCH.min,
    height: TOUCH.min,
    borderRadius: TOUCH.min / 2,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioText: {
    fontSize: TYPOGRAPHY.bodySm,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  strengthHeader: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  strengthList: {
    flexDirection: 'column',
  },
  shiftBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  shiftHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    minWidth: 0,
  },
  shiftHeaderTitle: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  shiftHeaderRight: {
    fontSize: TYPOGRAPHY.micro,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  shiftsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  shiftCardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  shiftPeriod: {
    fontSize: TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
  },
  shiftHours: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  guaranteeText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  insuranceNoteBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  insuranceNoteTitle: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  insuranceNoteDesc: {
    fontSize: TYPOGRAPHY.caption,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.textSecondary,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDocIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentDocName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  paymentDocSub: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginVertical: SPACING.md,
  },
  paymentInfoGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  paymentInfoCol: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  paymentInfoCap: {
    fontSize: TYPOGRAPHY.micro,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  paymentInfoVal: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  paymentInfoSub: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  feeLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  feeLineLabel: {
    fontSize: TYPOGRAPHY.bodySm,
    color: COLORS.textSecondary,
  },
  feeLineVal: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  feeTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  feeTotalLabel: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  feeTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderSubtle,
  },
  paymentMethodCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDFA',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodRadioCircleActive: {
    borderColor: COLORS.primary,
  },
  methodRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  methodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  methodIconBoxActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  methodTitle: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  methodTitleActive: {
    color: COLORS.primary,
  },
  methodSub: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clinicInstructionBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: SPACING.lg,
  },
  clinicInstructionTitle: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  clinicInstructionText: {
    fontSize: TYPOGRAPHY.caption,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  onlineTransferBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    marginBottom: SPACING.lg,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  qrMockThumbnail: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBankName: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.primary,
  },
  qrAccountNum: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  qrOwnerName: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  qrMemo: {
    fontSize: TYPOGRAPHY.micro,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 3,
  },
});

