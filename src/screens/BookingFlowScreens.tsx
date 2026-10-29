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
import { COLORS, RADIUS, SHADOWS } from '../theme';
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
            <TouchableOpacity style={styles.mapCircleBtn}>
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
              key: 'video',
              label: 'Tư vấn Video trực tuyến',
              icon: 'videocam-outline',
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

export interface ComponentShowcaseScreenProps {
  onClose: () => void;
}

export const ComponentShowcaseScreen: React.FC<ComponentShowcaseScreenProps> = ({
  onClose,
}) => {
  const [searchDemo, setSearchDemo] = useState('');
  const [inputDemo, setInputDemo] = useState('vu.nguyen@smartclinic.vn');
  const [segDemo, setSegDemo] = useState('tab1');
  const [slotDemo, setSlotDemo] = useState<TimeSlotItem>(TIME_SLOTS[3]);
  const [dayDemo, setDayDemo] = useState('d2');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Figma UI Kit & Components"
        subtitle="Tổng hợp các Component tái sử dụng (SmartClinic)"
        onBack={onClose}
        badgeText="Design System"
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Buttons */}
        <SectionHeader
          title="1. Buttons (AppButton)"
          subtitle="Biến thể Gradient, Primary, Secondary, Tonal, Google, Danger"
        />
        <View style={[styles.card, { gap: 10 }]}>
          <AppButton
            title="Primary Gradient CTA (Đăng nhập)"
            variant="gradient"
            rightIcon="arrow-forward"
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <AppButton
              title="Primary Solid"
              variant="primary"
              leftIcon="calendar-outline"
              fullWidth={false}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Secondary Teal"
              variant="secondary"
              leftIcon="bicycle-outline"
              fullWidth={false}
              style={{ flex: 1 }}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <AppButton
              title="Tonal Action"
              variant="tonal"
              leftIcon="map-outline"
              fullWidth={false}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Danger Outline"
              variant="dangerOutline"
              leftIcon="log-out-outline"
              fullWidth={false}
              style={{ flex: 1 }}
            />
          </View>
          <AppButton title="Đăng nhập bằng Google" variant="google" />
        </View>

        {/* 2. Badges & Status Chips */}
        <SectionHeader
          title="2. Badges & Status Chips (Badge)"
          subtitle="Nhãn trạng thái y tế, BHYT, eKYC, cảnh báo dị ứng"
        />
        <View style={[styles.card, { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }]}>
          <Badge label="Bác sĩ xác thực" variant="teal" icon="checkmark-circle" />
          <Badge label="BHYT 100%" variant="teal" />
          <Badge label="Hôm nay • 09:30" variant="teal" showDot />
          <Badge label="Đã xác nhận" variant="blue" />
          <Badge label="Tư vấn Video" variant="blue" icon="videocam-outline" />
          <Badge label="Cảnh báo: Dị ứng Penicillin" variant="danger" icon="warning-outline" />
          <Badge label="Phù hợp 96%" variant="teal" />
        </View>

        {/* 3. Inputs & SearchBar */}
        <SectionHeader
          title="3. Inputs & SearchBar (AppInput, SearchBar)"
          subtitle="Ô nhập liệu có icon, ẩn/hiện mật khẩu và thanh tìm kiếm thông minh"
        />
        <View style={styles.card}>
          <SearchBar
            value={searchDemo}
            onChangeText={setSearchDemo}
            style={{ marginBottom: 14 }}
          />
          <AppInput
            label="Email hoặc số điện thoại"
            leftIcon="at-outline"
            value={inputDemo}
            onChangeText={setInputDemo}
          />
          <AppInput
            label="Mật khẩu bảo mật"
            leftIcon="lock-closed-outline"
            value="12345678"
            isPassword
          />
        </View>

        {/* 4. Segmented Controls & Stepper */}
        <SectionHeader
          title="4. Segmented Control & Stepper"
          subtitle="Thanh chuyển tab có bộ đếm & tiến trình đặt khám 3 bước"
        />
        <View style={[styles.card, { gap: 12 }]}>
          <SegmentedControl
            variant="box"
            selectedKey={segDemo}
            onSelect={setSegDemo}
            options={[
              { key: 'tab1', label: 'Sắp tới', count: 2 },
              { key: 'tab2', label: 'Đã khám', count: 5 },
              { key: 'tab3', label: 'Đã hủy', count: 1 },
            ]}
          />
          <StepIndicator
            steps={['Chọn bác sĩ', 'Chọn lịch', 'Xác nhận']}
            currentStep={1}
          />
        </View>

        {/* 5. AI Hero & Smart Promo Cards */}
        <SectionHeader
          title="5. AI Hero Banner & Promo Card"
          subtitle="Thẻ trợ lý AI chẩn đoán sơ bộ & thẻ thông tuyến BHYT"
        />
        <AIHeroBanner style={{ marginBottom: 12 }} />
        <SmartPromoBanner style={{ marginBottom: 16 }} />

        {/* 6. Specialty Grid */}
        <SectionHeader
          title="6. Specialty 8-Icon Grid (SpecialtyGrid)"
          subtitle="Lưới 8 chuyên khoa y tế"
        />
        <SpecialtyGrid items={SPECIALTIES} style={{ marginBottom: 16 }} />

        {/* 7. Doctor & Hospital Cards */}
        <SectionHeader
          title="7. Doctor & Hospital Cards"
          subtitle="Thẻ bác sĩ chi tiết 4 chỉ số, thẻ bác sĩ ngang & bệnh viện gần bạn"
        />
        <DoctorProfileHeaderCard
          doctor={DOCTORS[0]}
          style={{ marginBottom: 12 }}
        />
        <HospitalCard hospital={HOSPITALS[0]} style={{ marginBottom: 16 }} />

        {/* 8. Date & Time Slot Picker */}
        <SectionHeader
          title="8. Date & Time Slot Picker"
          subtitle="Lịch chọn ngày ngang & lưới chọn khung giờ sáng/chiều"
        />
        <HorizontalDateSelector
          days={BOOKING_DAYS}
          selectedDayId={dayDemo}
          onSelectDay={setDayDemo}
          style={{ marginBottom: 12 }}
        />
        <TimeSlotGrid
          slots={TIME_SLOTS}
          selectedSlotId={slotDemo.id}
          onSelectSlot={setSlotDemo}
          style={{ marginBottom: 16 }}
        />

        {/* 9. Appointment & EHR & VssID Cards */}
        <SectionHeader
          title="9. Appointment, EHR Vitals & VssID Cards"
          subtitle="Phiếu hẹn khám QR, sinh hiệu bệnh nhân & thẻ BHYT điện tử"
        />
        <AppointmentCard appointment={APPOINTMENTS[0]} />
        <PatientMasterIdentityCard style={{ marginBottom: 12 }} />
        <VssIDInsuranceCard style={{ marginBottom: 16 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollPad: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  locationSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mapCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioText: {
    fontSize: 12.5,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  strengthHeader: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  strengthList: {
    flexDirection: 'column',
  },
  shiftBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  shiftHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    minWidth: 0,
  },
  shiftHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  shiftHeaderRight: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  shiftsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  shiftCardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  shiftPeriod: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  shiftHours: {
    fontSize: 13,
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
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  guaranteeText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    flex: 1,
  },
  insuranceNoteBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  insuranceNoteTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  insuranceNoteDesc: {
    fontSize: 11.5,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
});

