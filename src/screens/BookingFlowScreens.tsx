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
} from '../components';

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

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chi Tiết Bác Sĩ"
        onBack={onBack}
        rightActions={[
          { icon: 'share-social-outline' },
          { icon: 'bookmark-outline' },
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
        <View style={[styles.card, SHADOWS.sm]}>
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
            </View>
            <TouchableOpacity
              style={styles.mapCircleBtn}
              accessibilityRole="button"
              accessibilityLabel={`Xem bản đồ ${doctor.hospital}`}
              hitSlop={TOUCH.hitSlopSm}
            >
              <Ionicons
                name="navigate-outline"
                size={16}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

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
            actionText="Cập nhật thời gian thực"
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
    </View>
  );
};

export interface BookingSlotScreenProps {
  doctor: DoctorItem;
  onBack: () => void;
  onConfirmBooking: () => void;
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
          steps={['Chọn bác sĩ', 'Chọn lịch', 'Xác nhận']}
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
        onButtonPress={onConfirmBooking}
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
});

