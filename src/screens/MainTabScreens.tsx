import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  Modal,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TOUCH, TYPOGRAPHY } from '../theme';
import {
  DOCTORS,
  SPECIALTIES,
  PATIENT_PROFILE,
  formatRelativeDate,
  AppointmentItem,
  DoctorItem,
  HospitalItem,
} from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import {
  HomeGreetingHeader,
  SearchBar,
  AIHeroBanner,
  SectionHeader,
  SpecialtyGrid,
  SmartPromoBanner,
  FeaturedDoctorCard,
  HospitalCard,
  HospitalMapModal,
  AppHeader,
  PatientMasterIdentityCard,
  AIClinicalInsightCard,
  SegmentedControl,
  ActivePrescriptionCard,
  LabImagingCard,
  MedicalHistoryTimeline,
  AppButton,
  AIReminderCard,
  AppointmentCard,
  AIMedicalTriageBanner,
  AIChatBubble,
  AITypingIndicator,
  AIClinicalResponseCard,
  QuickPromptChips,
  ChatBottomInputBar,
  ProfileHeaderCard,
  VssIDInsuranceCard,
  SettingToggleRow,
  SettingLinkRow,
  Badge,
  ToastBanner,
  EmptyState,
  AnimatedEntry,
  PressableScale,
  DoctorCardSkeleton,
  AppointmentCardSkeleton,
  QuickServicesSkeleton,
  HospitalCardSkeleton,
} from '../components';

const getAppointmentSortTimestamp = (apt: AppointmentItem): number => {
  const combined = `${apt.timeRange} ${apt.dateLabel}`;
  const timeMatch = combined.match(/(\d{1,2}):(\d{2})/);
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
  const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;

  const fullDateMatch = combined.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (fullDateMatch) {
    const day = parseInt(fullDateMatch[1], 10);
    const month = parseInt(fullDateMatch[2], 10) - 1;
    const year = parseInt(fullDateMatch[3], 10);
    return new Date(year, month, day, hours, minutes).getTime();
  }

  const codeMatch = apt.code.match(/#(?:SC|KB)-(\d{2})(\d{2})(\d{2})-/);
  if (codeMatch) {
    const year = 2000 + parseInt(codeMatch[1], 10);
    const month = parseInt(codeMatch[2], 10) - 1;
    const day = parseInt(codeMatch[3], 10);
    return new Date(year, month, day, hours, minutes).getTime();
  }

  const shortDateMatch = combined.match(/(\d{2})\/(\d{2})(?!\/)/);
  if (shortDateMatch) {
    const day = parseInt(shortDateMatch[1], 10);
    const month = parseInt(shortDateMatch[2], 10) - 1;
    return new Date(2024, month, day, hours, minutes).getTime();
  }

  return hours * 60 + minutes;
};

const sortUpcomingAppointments = (list: AppointmentItem[]): AppointmentItem[] =>
  [...list].sort(
    (a, b) => getAppointmentSortTimestamp(a) - getAppointmentSortTimestamp(b)
  );

export interface HomeScreenProps {
  onSelectDoctor: (doctor: DoctorItem) => void;
  onBookDoctor: (doctor: DoctorItem) => void;
  onAskAI: () => void;
  onOpenProfile: () => void;
  onNavigate: (routeKey: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectDoctor,
  onBookDoctor,
  onAskAI,
  onOpenProfile,
  onNavigate,
}) => {
  const { appointments, doctors, hospitals } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedMapHospital, setSelectedMapHospital] = useState<HospitalItem | null>(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 850);
  };

  // Filter and sort upcoming appointments (nearest first) to show on Home
  const upcomingAppointments = sortUpcomingAppointments(
    appointments.filter((a) => a.status === 'upcoming')
  ).slice(0, 2);

  const selectedSpecialtyObj = SPECIALTIES.find((s) => s.id === selectedSpecialty);

  const filteredDoctors = doctors.filter((doc) => {
    if (!doc.verified) return false;
    const matchesSearch =
      !search.trim() ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(search.toLowerCase()) ||
      doc.subSpecialty.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      !selectedSpecialty ||
      (selectedSpecialtyObj &&
        (doc.specialty.toLowerCase().includes(selectedSpecialtyObj.name.toLowerCase()) ||
          doc.subSpecialty.toLowerCase().includes(selectedSpecialtyObj.name.toLowerCase())));

    return matchesSearch && matchesSpecialty;
  });

  const filteredHospitals = hospitals.filter((h) => {
    if (!search.trim()) return true;
    return (
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase()) ||
      h.tag.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Quick Services data — 4 items for 2×2 grid
  const quickServices = [
    {
      icon: 'alarm-outline' as const,
      title: 'Nhật ký thuốc',
      sub: 'Nhắc cữ uống',
      route: 'medLog',
      color: COLORS.secondary,
      bg: COLORS.tintTeal,
    },
    {
      icon: 'people-outline' as const,
      title: 'Hồ sơ Gia đình',
      sub: 'Mẹ, Vợ & Bé',
      route: 'familyProfiles',
      color: COLORS.secondary,
      bg: COLORS.tintTeal,
    },
    {
      icon: 'medkit-outline' as const,
      title: 'Tủ thuốc nhà',
      sub: 'Theo dõi số lượng',
      route: 'medicineCabinet',
      color: COLORS.primary,
      bg: COLORS.primaryContainer,
    },
    {
      icon: 'flask-outline' as const,
      title: 'Kết quả CĐHA',
      sub: 'MRI & Xét nghiệm',
      route: 'labImagingResults',
      color: COLORS.primary,
      bg: COLORS.primaryContainer,
    },
  ];

  return (
    <View style={styles.screen}>
      {/* SafeArea padding for top header */}
      <View style={{ paddingTop: insets.top }}>
        <HomeGreetingHeader
          userName="Vũ"
          avatarUrl={PATIENT_PROFILE.avatar}
          onChatPress={onAskAI}
          onNotificationPress={() => setNotificationsVisible(true)}
          onAvatarPress={onOpenProfile}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary, COLORS.secondary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* SearchBar with interactive search & clear */}
        <AnimatedEntry delay={10}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm bác sĩ, chuyên khoa, bệnh viện..."
            style={{ marginBottom: SPACING.lg }}
          />
        </AnimatedEntry>

        {/* Upcoming appointments section placed immediately below SearchBar */}
        {upcomingAppointments.length > 0 && (
          <AnimatedEntry delay={20}>
            <SectionHeader
              title="Lịch hẹn sắp tới"
              leftIcon="calendar-outline"
              actionText="Xem tất cả"
              onActionPress={() => onNavigate('appointments')}
            />
            {refreshing ? (
              <AppointmentCardSkeleton />
            ) : (
              upcomingAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onPrimaryPress={() => onSelectDoctor(apt.doctor)}
                />
              ))
            )}
          </AnimatedEntry>
        )}

        {/* Compact AI Hero Banner */}
        <AnimatedEntry delay={30}>
          <AIHeroBanner
            onAskAIPress={onAskAI}
            style={{ marginBottom: SPACING.lg }}
          />
        </AnimatedEntry>

        {/* Quick Services — 2×2 grid */}
        <AnimatedEntry delay={40}>
          <SectionHeader title="Tiện ích Y tế" />
          {refreshing ? (
            <QuickServicesSkeleton />
          ) : (
            <View style={styles.quickServiceGrid}>
              {quickServices.map((srv) => (
                <PressableScale
                  key={srv.route}
                  onPress={() => onNavigate(srv.route)}
                  accessibilityRole="button"
                  accessibilityLabel={`${srv.title}, ${srv.sub}`}
                  style={[styles.quickServiceCard, SHADOWS.sm]}
                >
                  <View style={[styles.quickServiceIcon, { backgroundColor: srv.bg }]}>
                    <Ionicons name={srv.icon} size={20} color={srv.color} />
                  </View>
                  <Text style={styles.quickServiceTitle} numberOfLines={1}>
                    {srv.title}
                  </Text>
                  <Text style={styles.quickServiceSub} numberOfLines={1}>
                    {srv.sub}
                  </Text>
                </PressableScale>
              ))}
            </View>
          )}
        </AnimatedEntry>

        {/* Specialty Grid with interactive filtering */}
        <AnimatedEntry delay={50}>
          <SectionHeader
            title="Chuyên khoa"
            actionText={selectedSpecialty ? 'Bỏ lọc' : undefined}
            onActionPress={() => setSelectedSpecialty(null)}
          />
          <SpecialtyGrid
            items={SPECIALTIES}
            selectedId={selectedSpecialty ?? undefined}
            onSelect={(item) =>
              setSelectedSpecialty((prev) => (prev === item.id ? null : item.id))
            }
            style={{ marginBottom: SPACING.lg }}
          />
        </AnimatedEntry>

        {/* Featured Doctors filtered by search & specialty */}
        <AnimatedEntry delay={60}>
          <SectionHeader
            title={
              selectedSpecialtyObj
                ? `Bác sĩ ${selectedSpecialtyObj.name}`
                : 'Bác sĩ nổi bật'
            }
            subtitle={
              selectedSpecialtyObj
                ? `Tìm thấy ${filteredDoctors.length} bác sĩ chuyên khoa`
                : undefined
            }
            actionText={selectedSpecialty ? 'Xem tất cả' : undefined}
            onActionPress={() => setSelectedSpecialty(null)}
          />
          {refreshing ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: SPACING.sm,
                marginBottom: SPACING.lg,
              }}
            >
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </ScrollView>
          ) : filteredDoctors.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: SPACING.sm,
                marginBottom: SPACING.lg,
              }}
            >
              {filteredDoctors.map((doc) => (
                <FeaturedDoctorCard
                  key={doc.id}
                  doctor={doc}
                  onPress={onSelectDoctor}
                  onBookPress={onBookDoctor}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyDoctorFilter}>
              <Text style={styles.emptyDoctorText}>
                Không tìm thấy bác sĩ phù hợp với tiêu chí tìm kiếm.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedSpecialty(null);
                  setSearch('');
                }}
                accessibilityRole="button"
                accessibilityLabel="Xóa bộ lọc tìm kiếm"
                style={styles.clearFilterBtn}
              >
                <Text style={styles.clearFilterText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
            </View>
          )}
        </AnimatedEntry>

        {/* Promo Banner placed below Doctors for organic reading flow */}
        <AnimatedEntry delay={60}>
          <PressableScale
            onPress={() => onBookDoctor(DOCTORS[0])}
            style={{ marginBottom: SPACING.lg }}
          >
            <SmartPromoBanner />
          </PressableScale>
        </AnimatedEntry>

        {/* Hospitals near you */}
        <AnimatedEntry delay={60}>
          <SectionHeader
            title="Bệnh viện gần bạn"
            badgeText="TP. Hồ Chí Minh"
            badgeVariant="teal"
            badgeIcon="navigate"
            actionText="Xem bản đồ"
            onActionPress={() => {
              setSelectedMapHospital(hospitals[0]);
              setMapModalVisible(true);
            }}
          />
          {refreshing ? (
            <>
              <HospitalCardSkeleton />
              <HospitalCardSkeleton />
            </>
          ) : (
            filteredHospitals.map((h) => (
              <HospitalCard
                key={h.id}
                hospital={h}
                onMapPress={(hosp) => {
                  setSelectedMapHospital(hosp);
                  setMapModalVisible(true);
                }}
              />
            ))
          )}
        </AnimatedEntry>
      </ScrollView>

      <HospitalMapModal
        visible={mapModalVisible}
        initialHospital={selectedMapHospital}
        onClose={() => setMapModalVisible(false)}
        onBookAtHospital={(hosp) => {
          const matchedDoc =
            DOCTORS.find((d) =>
              d.hospital.toLowerCase().includes(hosp.name.toLowerCase()) ||
              hosp.name.toLowerCase().includes(d.hospital.toLowerCase())
            ) || DOCTORS[0];
          onBookDoctor(matchedDoc);
        }}
      />

      <Modal
        visible={notificationsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setNotificationsVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Đóng thông báo"
          />
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: RADIUS.xl,
              borderTopRightRadius: RADIUS.xl,
              padding: SPACING.lg,
              paddingBottom: Math.max(insets.bottom, SPACING.lg),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: SPACING.md,
              }}
            >
              <Text
                style={{
                  fontSize: TYPOGRAPHY.size.lg,
                  fontWeight: '800',
                  color: COLORS.textPrimary,
                }}
              >
                Thông báo y tế
              </Text>
              <TouchableOpacity
                onPress={() => setNotificationsVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Đóng danh sách thông báo"
                style={{
                  minWidth: TOUCH.min,
                  minHeight: TOUCH.min,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {[
              {
                id: 'notif-apt',
                icon: 'calendar-outline' as const,
                color: COLORS.primary,
                bg: COLORS.primaryContainer,
                title: 'Nhắc lịch khám sắp tới (09:30)',
                desc: 'Khám Nội Thần Kinh với TS. BS. Lê Thu Trang tại BV ĐHYD TP.HCM.',
                route: 'appointments',
              },
              {
                id: 'notif-med',
                icon: 'alarm-outline' as const,
                color: COLORS.secondary,
                bg: COLORS.tintTeal,
                title: 'Nhắc uống thuốc theo đơn',
                desc: 'Paracetamol 500mg & Magnesi-B6 • Ghi nhận cữ uống trong ngày.',
                route: 'medLog',
              },
              {
                id: 'notif-lab',
                icon: 'flask-outline' as const,
                color: COLORS.primary,
                bg: COLORS.surfaceContainerLow,
                title: 'Đã có kết quả MRI & Xét nghiệm',
                desc: 'Kết quả chụp cộng hưởng từ (MRI) sọ não và sinh hóa máu đã cập nhật.',
                route: 'labImagingResults',
              },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.desc}`}
                onPress={() => {
                  setNotificationsVisible(false);
                  onNavigate(item.route);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: SPACING.md,
                  borderRadius: RADIUS.md,
                  backgroundColor: COLORS.background,
                  marginBottom: SPACING.sm,
                  borderWidth: 1,
                  borderColor: COLORS.borderSubtle,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: item.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING.md,
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1, marginRight: SPACING.xs }}>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.body,
                      fontWeight: '700',
                      color: COLORS.textPrimary,
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: TYPOGRAPHY.caption,
                      color: COLORS.textSecondary,
                      lineHeight: 17,
                    }}
                  >
                    {item.desc}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export interface EHRScreenProps {
  onAskAI: () => void;
  onNavigate: (routeKey: string) => void;
}

export const EHRScreen: React.FC<EHRScreenProps> = ({
  onAskAI,
  onNavigate,
}) => {
  const { prescriptions } = useAppContext();
  const [filterKey, setFilterKey] = useState('all');
  const [toastInfo, setToastInfo] = useState<{ title: string; msg: string } | null>(
    null
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Hồ sơ bệnh án điện tử"
        subtitle="SmartClinic EHR • Hồ sơ sức khỏe cá nhân"
        leftIconBox="folder-open-outline"
        rightActions={[
          {
            icon: 'people-outline',
            onPress: () => onNavigate('familyProfiles'),
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={10} direction="up">
          <PatientMasterIdentityCard
            onQrPress={() => onNavigate('bookingSuccess')}
            onBhytPress={() =>
              Alert.alert(
                'Thông tin thẻ BHYT (80%)',
                `Mã thẻ: ${PATIENT_PROFILE.bhytCode}\nNơi ĐKKCB ban đầu: ${PATIENT_PROFILE.bhytHospital}\nHạn sử dụng: ${PATIENT_PROFILE.bhytExpiry}`
              )
            }
            style={{ marginBottom: 16 }}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={20} direction="up">
          <AIClinicalInsightCard
            onAskAIPress={onAskAI}
            style={{ marginBottom: 16 }}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={30} direction="up">
          <SegmentedControl
            variant="chips"
            selectedKey={filterKey}
            onSelect={setFilterKey}
            options={[
              { key: 'all', label: 'Tất cả', icon: 'grid-outline' },
              {
                key: 'rx',
                label: `Đơn thuốc điện tử (${prescriptions.length})`,
                icon: 'document-text-outline',
              },
              { key: 'lab', label: 'Xét nghiệm & CĐHA', icon: 'flask-outline' },
            ]}
            style={{ marginBottom: 16 }}
          />
        </AnimatedEntry>

        {(filterKey === 'all' || filterKey === 'rx') && (
          <AnimatedEntry delay={40} direction="up">
            <SectionHeader
              title="Đơn thuốc đang điều trị"
              leftIcon="medkit-outline"
              badgeText={prescriptions.length > 0 ? 'Ngày 2/7' : undefined}
              badgeVariant="teal"
              actionText="Tủ thuốc"
              onActionPress={() => onNavigate('medicineCabinet')}
            />
            {prescriptions.length > 0 ? (
              <ActivePrescriptionCard
                doctor={DOCTORS[0]}
                prescriptionCode="#DT-241029-01"
                date={formatRelativeDate(-2)}
                drugs={prescriptions}
                onViewOriginal={() => onNavigate('rxDetail')}
                onBuyMedicine={() => onNavigate('medicineCabinet')}
                onReminderPress={() => onNavigate('medLog')}
              />
            ) : (
              <EmptyState
                icon="document-text-outline"
                title="Chưa có đơn thuốc điện tử"
                description="Đơn thuốc bác sĩ kê sau mỗi lần khám sẽ tự động lưu trữ tại đây."
              />
            )}
          </AnimatedEntry>
        )}

        {(filterKey === 'all' || filterKey === 'lab') && (
          <AnimatedEntry delay={50} direction="up">
            <SectionHeader
              title="Xét nghiệm & Chẩn đoán hình ảnh"
              leftIcon="flask-outline"
              actionText="Xem tất cả (8)"
              onActionPress={() => onNavigate('labImagingResults')}
            />
            <LabImagingCard
              onViewDicom={() => onNavigate('labImagingResults')}
              onDownloadPdf={() =>
                setToastInfo({
                  title: 'Đã lưu PDF Kết Quả',
                  msg: 'Kết quả chụp MRI & xét nghiệm máu đã được tải về máy.',
                })
              }
            />
          </AnimatedEntry>
        )}

        {filterKey === 'all' && (
          <AnimatedEntry delay={60} direction="up">
            <SectionHeader
              title="Lịch sử khám bệnh"
              leftIcon="calendar-outline"
              actionText={`Gần nhất: ${formatRelativeDate(-2)}`}
              onActionPress={() => onNavigate('postConsultSummary')}
            />
            <MedicalHistoryTimeline
              onItemPress={() => onNavigate('postConsultSummary')}
            />
          </AnimatedEntry>
        )}

        {/* Upload External Record Card */}
        <AnimatedEntry delay={60} direction="up">
          <View style={[styles.ocrCard, SHADOWS.sm]}>
            <View style={styles.ocrIconBox}>
              <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, minWidth: 140, marginHorizontal: 10 }}>
              <Text style={styles.ocrTitle} numberOfLines={1}>
                Tải lên hồ sơ / Toa thuốc cũ
              </Text>
              <Text style={styles.ocrSub} numberOfLines={1}>
                Lưu trữ hình ảnh kết quả xét nghiệm và đơn thuốc cá nhân
              </Text>
            </View>
            <AppButton
              title="Tải lên"
              variant="primary"
              size="sm"
              leftIcon="camera-outline"
              fullWidth={false}
              onPress={() =>
                setToastInfo({
                  title: 'Tải lên hồ sơ',
                  msg: 'Đã mở trình chọn ảnh toa thuốc & kết quả xét nghiệm.',
                })
              }
            />
          </View>
        </AnimatedEntry>
      </ScrollView>
      <ToastBanner
        visible={!!toastInfo}
        title={toastInfo?.title || ''}
        message={toastInfo?.msg}
        onDismiss={() => setToastInfo(null)}
      />
    </View>
  );
};

export interface AppointmentsScreenProps {
  onSelectDoctor: (doctor: DoctorItem) => void;
  onBookNew: () => void;
  onNavigate: (routeKey: string) => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  onSelectDoctor,
  onBookNew,
  onNavigate,
}) => {
  const { appointments, cancelAppointment } = useAppContext();
  const [statusTab, setStatusTab] = useState('upcoming');
  const [cancelToast, setCancelToast] = useState<string | null>(null);

  const upcomingList = sortUpcomingAppointments(
    appointments.filter((a) => a.status === 'upcoming')
  );
  const completedList = appointments.filter((a) => a.status === 'completed');
  const cancelledList = appointments.filter((a) => a.status === 'cancelled');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Lịch Khám Của Tôi"
        subtitle="Hệ thống phòng khám SmartClinic"
        leftIconBox="calendar-outline"
        rightActions={[
          {
            icon: 'qr-code-outline',
            showBadgeDot: true,
            onPress: () => onNavigate('bookingSuccess'),
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedControl
          variant="box"
          selectedKey={statusTab}
          onSelect={setStatusTab}
          options={[
            { key: 'upcoming', label: 'Sắp tới', count: upcomingList.length },
            { key: 'completed', label: 'Đã khám', count: completedList.length },
            { key: 'cancelled', label: 'Đã hủy', count: cancelledList.length },
          ]}
          style={{ marginBottom: 14 }}
        />

        {statusTab === 'upcoming' && (
          <>
            <AnimatedEntry delay={20} direction="up">
              <AIReminderCard style={{ marginBottom: 14 }} />
            </AnimatedEntry>

            {upcomingList.length > 0 ? (
              upcomingList.map((apt, idx) => (
                <AnimatedEntry key={apt.id} delay={Math.min(60, 20 + idx * 20)} direction="up">
                  <AppointmentCard
                    appointment={apt}
                    onPrimaryPress={(item) => {
                      if (item.mode === 'video') {
                        onNavigate('teleconsult');
                      } else {
                        onNavigate('bookingSuccess');
                      }
                    }}
                    onSecondaryPress={(item) => {
                      Alert.alert(
                        'Xác nhận hủy lịch hẹn?',
                        `Bạn có chắc chắn muốn hủy lịch hẹn ${item.code} với ${item.doctor.name} (${item.timeRange}) không?`,
                        [
                          { text: 'Đóng', style: 'cancel' },
                          {
                            text: 'Xác nhận hủy',
                            style: 'destructive',
                            onPress: () => {
                              cancelAppointment(item.id);
                              setCancelToast(
                                `Đã hủy lịch hẹn ${item.code} với ${item.doctor.name}.`
                              );
                            },
                          },
                        ]
                      );
                    }}
                  />
                </AnimatedEntry>
              ))
            ) : (
              <EmptyState
                icon="calendar-outline"
                title="Chưa Có Lịch Khám Sắp Tới"
                description="Bạn chưa có cuộc hẹn khám bệnh nào sắp diễn ra. Hãy đặt lịch hẹn để được phục vụ chu đáo."
                actionTitle="Đặt Lịch Khám Ngay"
                onActionPress={onBookNew}
              />
            )}
          </>
        )}

        {statusTab === 'completed' &&
          (completedList.length > 0 ? (
            completedList.map((apt) => (
              <View key={apt.id} style={[styles.sectionCard, SHADOWS.sm]}>
                <View style={styles.statBoxTop}>
                  <Badge label={`Hoàn thành • ${apt.code}`} variant="teal" showDot />
                  <Badge label={apt.statusBadge} variant="blue" />
                </View>
                <Text style={styles.sectionCardTitle}>
                  Khám Chuyên khoa {apt.doctor.specialty} — {apt.doctor.name}
                </Text>
                <Text style={styles.sectionCardSub}>
                  Chẩn đoán: Đau nửa đầu Migraine (G43.0) • Thời gian: {apt.timeRange}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <AppButton
                    title="Kết quả & Đơn thuốc"
                    variant="primary"
                    size="sm"
                    leftIcon="document-text-outline"
                    fullWidth={false}
                    style={{ flex: 1 }}
                    onPress={() => onNavigate('postConsultSummary')}
                  />
                  <AppButton
                    title="Đặt lịch tái khám"
                    variant="tonal"
                    size="sm"
                    leftIcon="calendar-outline"
                    fullWidth={false}
                    style={{ flex: 1 }}
                    onPress={() => onSelectDoctor(apt.doctor)}
                  />
                </View>
              </View>
            ))
          ) : (
            <EmptyState
              icon="checkmark-done-circle-outline"
              title="Chưa Có Lịch Sử Đã Khám"
              description="Các cuộc hẹn sau khi hoàn tất tư vấn sẽ được lưu trữ tại đây."
              actionTitle="Đặt Lịch Khám Ngay"
              onActionPress={onBookNew}
            />
          ))}

        {statusTab === 'cancelled' &&
          (cancelledList.length > 0 ? (
            cancelledList.map((apt) => (
              <View key={apt.id} style={[styles.sectionCard, SHADOWS.sm]}>
                <Badge label={`Đã hủy • ${apt.code}`} variant="danger" />
                <Text style={[styles.sectionCardTitle, { marginTop: 8 }]}>
                  Khám {apt.doctor.specialty} — {apt.doctor.name}
                </Text>
                <Text style={styles.sectionCardSub}>
                  Khung giờ: {apt.timeRange} • {apt.doctor.hospital}
                </Text>
                <AppButton
                  title="Đặt lại lịch khám này"
                  variant="outline"
                  size="sm"
                  leftIcon="refresh-outline"
                  onPress={() => onSelectDoctor(apt.doctor)}
                  style={{ marginTop: 12 }}
                />
              </View>
            ))
          ) : (
            <EmptyState
              icon="close-circle-outline"
              title="Không Có Lịch Hẹn Đã Hủy"
              description="Bạn chưa có lịch hẹn khám bệnh nào bị hủy."
            />
          ))}

        {/* Need more consultation banner */}
        <View style={styles.moreConsultBanner}>
          <View style={{ flex: 1, minWidth: 150, paddingRight: 10 }}>
            <Text style={styles.moreConsultTitle}>Đặt lịch hẹn khám mới</Text>
            <Text style={styles.moreConsultSub}>
              Chọn chuyên khoa và khung giờ phù hợp với bạn
            </Text>
          </View>
          <AppButton
            title="+ Đặt lịch mới"
            variant="primary"
            size="sm"
            fullWidth={false}
            onPress={onBookNew}
          />
        </View>
      </ScrollView>
      <ToastBanner
        visible={!!cancelToast}
        title="Đã hủy lịch khám"
        message={cancelToast || ''}
        onDismiss={() => setCancelToast(null)}
      />
    </View>
  );
};

export interface AIAssistantScreenProps {
  onBookDoctor: (doctor: DoctorItem) => void;
}

interface AIChatThreadItem {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  time: string;
  clinicalCard?: {
    analysisText: string;
    specialtyName: string;
    specialtyDesc: string;
    specialtyIcon: keyof typeof Ionicons.glyphMap;
    urgencyLevel: 'emergency' | 'soon' | 'routine';
    doctors: DoctorItem[];
  };
}

const analyzeMedicalSymptom = (
  rawText: string
): Omit<AIChatThreadItem, 'id' | 'sender' | 'time'> => {
  const q = rawText.toLowerCase();

  // 1. Dấu hiệu cấp cứu (Red Flags)
  if (
    q.includes('cấp cứu') ||
    q.includes('khó thở') ||
    q.includes('đau ngực dữ dội') ||
    q.includes('tê yếu') ||
    q.includes('méo miệng') ||
    q.includes('nói đớ') ||
    q.includes('co giật') ||
    q.includes('ngất')
  ) {
    return {
      clinicalCard: {
        urgencyLevel: 'emergency',
        analysisText:
          'CẢNH BÁO ĐỎ: Các dấu hiệu như đau ngực dữ dội, khó thở, tê yếu nửa người, méo miệng, nói đớ hoặc sốt cao co giật là tình trạng cấp cứu nội/ngoại khoa tối khẩn. Vui lòng gọi 115 hoặc nhờ người thân đưa đến Khoa Cấp cứu gần nhất ngay lập tức.',
        specialtyName: 'Cấp Cứu & Thần Kinh - Tim Mạch',
        specialtyDesc: 'Can thiệp đột quỵ & tim mạch khẩn cấp 24/7',
        specialtyIcon: 'medkit',
        doctors: [DOCTORS[1], DOCTORS[0]],
      },
    };
  }

  // 2. Hỏi về thuốc giảm đau & cảnh báo dị ứng hồ sơ EHR
  if (q.includes('thuốc') || q.includes('giảm đau') || q.includes('liều')) {
    return {
      text: `Lưu ý an toàn dược lâm sàng: Hồ sơ bệnh án của bạn có ghi nhận tiền sử DỊ ỨNG NHÓM NSAIDs (Ibuprofen). Bạn tuyệt đối không tự ý mua các thuốc giảm đau kháng viêm nhóm NSAIDs. Nếu cần giảm đau tạm thời, hãy tham khảo ý kiến bác sĩ chuyên khoa trước khi dùng Paracetamol đúng liều lượng theo cân nặng.`,
    };
  }

  // 3. Hỏi về chế độ ăn uống / kiêng cử
  if (q.includes('kiêng') || q.includes('ăn uống') || q.includes('sinh hoạt')) {
    return {
      text: 'Hướng dẫn chăm sóc & sinh hoạt tại nhà:\n• Hạn chế cà phê, trà đặc, rượu bia và thức ăn chế biến sẵn chứa nhiều muối/bột ngọt.\n• Uống đủ 1.8 – 2 lít nước ấm mỗi ngày.\n• Áp dụng quy tắc 20-20-20 khi nhìn màn hình máy tính và ngủ trước 23:00.',
    };
  }

  // 4. Triệu chứng Tim mạch & Huyết áp
  if (
    q.includes('tim') ||
    q.includes('tức ngực') ||
    q.includes('hồi hộp') ||
    q.includes('đánh trống ngực') ||
    q.includes('huyết áp') ||
    q.includes('mạch nhanh')
  ) {
    return {
      clinicalCard: {
        urgencyLevel: 'soon',
        analysisText:
          'Triệu chứng tức ngực, hồi hộp đánh trống ngực hoặc dao động huyết áp cần được kiểm tra điện tâm đồ (ECG) và siêu âm tim Doppler để loại trừ rối loạn nhịp hoặc thiếu máu cơ tim cục bộ.',
        specialtyName: 'Tim Mạch',
        specialtyDesc: 'Tăng huyết áp, mạch vành & rối loạn nhịp tim',
        specialtyIcon: 'heart',
        doctors: [DOCTORS[1]],
      },
    };
  }

  // 5. Triệu chứng Mắt / Nhãn khoa
  if (
    q.includes('mắt') ||
    q.includes('nhìn mờ') ||
    q.includes('mỏi mắt') ||
    q.includes('khô mắt') ||
    q.includes('nhức mắt') ||
    q.includes('thị lực')
  ) {
    return {
      clinicalCard: {
        urgencyLevel: 'routine',
        analysisText:
          'Tình trạng mỏi mắt, khô rát hoặc nhìn mờ khi làm việc máy tính kéo dài thường liên quan đến Hội chứng thị giác màn hình (CVS) hoặc thay đổi độ khúc xạ. Bạn nên khám chuyên khoa Mắt để đo khúc xạ và soi đáy mắt.',
        specialtyName: 'Mắt (Nhãn Khoa)',
        specialtyDesc: 'Khúc xạ, khô mắt kỹ thuật số & võng mạc',
        specialtyIcon: 'eye',
        doctors: [DOCTORS[2]],
      },
    };
  }

  // 6. Triệu chứng Cột sống & Ngoại thần kinh
  if (
    q.includes('đau lưng') ||
    q.includes('cột sống') ||
    q.includes('thoát vị') ||
    q.includes('cổ vai gáy') ||
    q.includes('thần kinh tọa') ||
    q.includes('tê chân') ||
    q.includes('tê tay')
  ) {
    return {
      clinicalCard: {
        urgencyLevel: 'soon',
        analysisText:
          'Đau vùng cổ vai gáy hoặc đau thắt lưng lan xuống tay/chân là dấu hiệu gợi ý chèn ép rễ thần kinh hoặc thoát vị đĩa đệm cột sống. Bạn nên khám chuyên khoa Ngoại Thần kinh để đánh giá vận động và chụp cộng hưởng từ (MRI) khi cần.',
        specialtyName: 'Ngoại Thần Kinh & Cột Sống',
        specialtyDesc: 'Thoát vị đĩa đệm, đau thần kinh tọa & cột sống',
        specialtyIcon: 'fitness',
        doctors: [DOCTORS[3], DOCTORS[0]],
      },
    };
  }

  // 7. Mặc định / Triệu chứng Nội thần kinh (Đau đầu, chóng mặt, mất ngủ)
  return {
    clinicalCard: {
      urgencyLevel: 'soon',
      analysisText:
        'Dựa trên mô tả triệu chứng của bạn, hệ thống định hướng sàng lọc ban đầu thuộc nhóm bệnh lý Nội Thần kinh (đau đầu vận mạch Migraine, rối loạn tiền đình hoặc căng thẳng thần kinh). Bạn nên đặt lịch khám để bác sĩ chuyên khoa thăm khám trực tiếp.',
      specialtyName: 'Nội Thần Kinh',
      specialtyDesc: 'Đau đầu, chóng mặt, rối loạn tiền đình & mất ngủ',
      specialtyIcon: 'pulse',
      doctors: [DOCTORS[0], DOCTORS[3]],
    },
  };
};

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBookDoctor,
}) => {
  const { patientProfile } = useAppContext();
  const displayName = patientProfile.name || PATIENT_PROFILE.name;
  const [inputMsg, setInputMsg] = useState('');
  const [showSampleThread, setShowSampleThread] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [extraMessages, setExtraMessages] = useState<AIChatThreadItem[]>([]);
  const chatScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const getCurrentTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
  };

  const handleSend = (customText?: string) => {
    const content = (customText ?? inputMsg).trim();
    if (!content || isTyping) return;
    const timeStr = getCurrentTimeStr();

    setExtraMessages((prev) => [
      ...prev,
      { id: `usr-${prev.length + 1}`, sender: 'user', text: content, time: timeStr },
    ]);
    if (!customText) setInputMsg('');

    // TODO: Replace simulated typing timeout and local symptom triage with real AI triage backend API
    setIsTyping(true);
    setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    const analysisResult = analyzeMedicalSymptom(content);

    setTimeout(() => {
      setIsTyping(false);
      setExtraMessages((prev) => [
        ...prev,
        {
          id: `ai-${prev.length + 1}`,
          sender: 'ai',
          time: getCurrentTimeStr(),
          ...analysisResult,
        },
      ]);
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Trợ lý Sức khỏe AI"
        subtitle="Hỗ trợ sàng lọc triệu chứng & gợi ý chuyên khoa"
        badgeText="AI 24/7"
        leftIconBox="sparkles"
        rightActions={[
          {
            icon: 'refresh-outline',
            label: 'Làm mới cuộc trò chuyện',
            onPress: () => {
              setShowSampleThread(false);
              setIsTyping(false);
              setExtraMessages([]);
            },
          },
        ]}
      />

      <ScrollView
        ref={chatScrollRef}
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AIMedicalTriageBanner />

        <AIChatBubble
          sender="ai"
          message={`Xin chào ${displayName}! Tôi là Trợ lý Y tế SmartClinic. Bạn đang gặp triệu chứng gì (đau đầu, tức ngực, mỏi mắt, đau lưng...)? Hãy mô tả hoặc chọn gợi ý bên dưới để tôi định hướng chuyên khoa và bác sĩ phù hợp.`}
          time="09:41"
        />

        {showSampleThread && (
          <>
            <AIChatBubble
              sender="user"
              message="Tôi bị đau đầu vùng thái dương và cảm giác chóng mặt buồn nôn nhẹ trong 2 ngày nay, làm việc máy tính nhiều thì đau tăng lên."
              time="09:42"
            />

            <AIClinicalResponseCard
              doctors={[DOCTORS[0], DOCTORS[3]]}
              onBookDoctor={onBookDoctor}
            />
          </>
        )}

        {extraMessages.map((m) =>
          m.clinicalCard ? (
            <AIClinicalResponseCard
              key={m.id}
              analysisText={m.clinicalCard.analysisText}
              specialtyName={m.clinicalCard.specialtyName}
              specialtyDesc={m.clinicalCard.specialtyDesc}
              specialtyIcon={m.clinicalCard.specialtyIcon}
              urgencyLevel={m.clinicalCard.urgencyLevel}
              doctors={m.clinicalCard.doctors}
              onBookDoctor={onBookDoctor}
              onEmergencyCall={() => Linking.openURL('tel:115')}
            />
          ) : (
            <AIChatBubble
              key={m.id}
              sender={m.sender}
              message={m.text || ''}
              time={m.time}
            />
          )
        )}

        {isTyping && <AITypingIndicator />}

        <QuickPromptChips
          prompts={[
            {
              label: 'Dấu hiệu cần cấp cứu',
              icon: 'medical-outline',
              danger: true,
            },
            { label: 'Tức ngực, hồi hộp tim đập nhanh', icon: 'heart-outline' },
            { label: 'Mỏi mắt, nhìn mờ khi dùng máy tính', icon: 'eye-outline' },
            { label: 'Đau lưng lan xuống chân', icon: 'fitness-outline' },
            { label: 'Tôi cần kiêng cử gì?', icon: 'restaurant-outline' },
            { label: 'Thuốc giảm đau tạm thời', icon: 'medkit-outline' },
          ]}
          onSelectPrompt={(txt) => handleSend(txt)}
        />
      </ScrollView>

      <ChatBottomInputBar
        value={inputMsg}
        onChangeText={setInputMsg}
        onSend={() => handleSend()}
      />
    </KeyboardAvoidingView>
  );
};

export interface ProfileSettingsScreenProps {
  onLogout: () => void;
  onNavigate: (routeKey: string) => void;
  onSwitchTab: (tabKey: 'home' | 'records' | 'appointments' | 'ai' | 'profile') => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onLogout,
  onNavigate,
  onSwitchTab,
}) => {
  const { appointments, familyMembers, takenMap, resetAppData } = useAppContext();
  const [pillReminder, setPillReminder] = useState(true);
  const [aptAlert, setAptAlert] = useState(true);
  const [labAlert, setLabAlert] = useState(true);
  const [aiCare, setAiCare] = useState(true);
  const [dndMode, setDndMode] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [resetToast, setResetToast] = useState(false);

  const upcomingCount = appointments.filter(
    (a) => a.status === 'upcoming'
  ).length;
  const totalDoses = Object.keys(takenMap).length || 3;
  const takenCount = Object.values(takenMap).filter(Boolean).length;
  const adherencePct = Math.round((takenCount / totalDoses) * 100);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Cá Nhân"
        rightActions={[
          {
            icon: 'people-outline',
            onPress: () => onNavigate('familyProfiles'),
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard
          onEditPress={() =>
            Alert.alert(
              'Hồ sơ cá nhân đã xác thực',
              `Hồ sơ ${PATIENT_PROFILE.name} (${PATIENT_PROFILE.patientCode}) đã đồng bộ định danh eKYC. Để quản lý hồ sơ người thân, vui lòng chọn mục Hồ sơ Gia đình.`
            )
          }
          onQrPress={() => onNavigate('bookingSuccess')}
          style={{ marginBottom: 16 }}
        />

        <VssIDInsuranceCard
          onDetailPress={() =>
            Alert.alert(
              'Chi tiết thẻ BHYT điện tử',
              `Mã thẻ: ${PATIENT_PROFILE.bhytCode}\nMức hưởng: 80% chi phí KCB BHYT\nNơi ĐKKCB ban đầu: ${PATIENT_PROFILE.bhytHospital}\nHạn thẻ: ${PATIENT_PROFILE.bhytExpiry}`
            )
          }
          style={{ marginBottom: 18 }}
        />

        <SectionHeader
          title="Tổng quan điều trị"
          actionText="Cập nhật 15 phút trước"
          onActionPress={() => onSwitchTab('records')}
        />
        {/* 2x2 Summary Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onSwitchTab('appointments')}
            style={[styles.statBox, SHADOWS.sm]}
          >
            <View style={styles.statBoxTop}>
              <View style={styles.statIconWrap}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              </View>
              <Badge label="Gần nhất" variant="blue" />
            </View>
            <Text style={[styles.statBigNum, { color: COLORS.primary }]}>
              {upcomingCount}
            </Text>
            <Text style={styles.statBoxTitle} numberOfLines={1}>
              Lịch hẹn sắp tới
            </Text>
            <Text style={styles.statBoxSub} numberOfLines={1}>
              10:30 Thứ Năm (Nội thần kinh)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onNavigate('medLog')}
            style={[styles.statBox, SHADOWS.sm]}
          >
            <View style={styles.statBoxTop}>
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: COLORS.tintTeal },
                ]}
              >
                <Ionicons name="medkit-outline" size={16} color={COLORS.secondary} />
              </View>
              <Badge label={`${takenCount}/${totalDoses} cữ (${adherencePct}%)`} variant="teal" />
            </View>
            <Text style={[styles.statBigNum, { color: COLORS.secondary }]}>1</Text>
            <Text style={styles.statBoxTitle} numberOfLines={1}>
              Toa thuốc đang uống
            </Text>
            <Text style={styles.statBoxSub} numberOfLines={1}>
              {totalDoses} cữ/ngày • Còn 5 ngày
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onNavigate('labImagingResults')}
            style={[styles.statBox, SHADOWS.sm]}
          >
            <View style={styles.statBoxTop}>
              <View style={styles.statIconWrap}>
                <Ionicons name="folder-outline" size={16} color={COLORS.primary} />
              </View>
              <Ionicons
                name="chevron-forward"
                size={15}
                color={COLORS.textMuted}
              />
            </View>
            <Text style={styles.statBigNum}>12</Text>
            <Text style={styles.statBoxTitle} numberOfLines={1}>
              Hồ sơ bệnh án
            </Text>
            <Text style={styles.statBoxSub} numberOfLines={1}>
              MRI, X-Quang & Huyết học
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onNavigate('doctorDetail')}
            style={[styles.statBox, SHADOWS.sm]}
          >
            <View style={styles.statBoxTop}>
              <View style={styles.statIconWrap}>
                <Ionicons name="people-outline" size={16} color={COLORS.primary} />
              </View>
              <Ionicons
                name="chevron-forward"
                size={15}
                color={COLORS.textMuted}
              />
            </View>
            <Text style={styles.statBigNum}>3</Text>
            <Text style={styles.statBoxTitle} numberOfLines={1}>
              Bác sĩ phụ trách
            </Text>
            <Text style={styles.statBoxSub} numberOfLines={1}>
              Chuyên khoa & Tư vấn AI
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification Settings Card */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <View style={styles.sectionCardHeader}>
            <View style={styles.notifyIconBox}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionCardTitle}>
                Cài đặt thông báo & Nhắc nhở
              </Text>
              <Text style={styles.sectionCardSub}>
                Tuỳ chỉnh thông báo lịch khám và nhắc uống thuốc
              </Text>
            </View>
          </View>

          <SettingToggleRow
            icon="medkit-outline"
            iconColor={COLORS.secondary}
            title="Nhắc lịch uống thuốc"
            description="Báo nhắc trước 10 phút các cữ sáng (08:00), chiều (14:00), tối (21:00)."
            value={pillReminder}
            onValueChange={setPillReminder}
            footerNote="Âm báo mặc định của thiết bị"
            footerActionLabel="Xem lịch thuốc"
            onFooterAction={() => onNavigate('medLog')}
          />

          <SettingToggleRow
            icon="calendar-outline"
            title="Thông báo lịch hẹn & Khám bệnh"
            description="Nhắc trước 24 giờ và 2 giờ kèm thông tin phòng khám, số thứ tự."
            value={aptAlert}
            onValueChange={setAptAlert}
          />

          <SettingToggleRow
            icon="document-text-outline"
            title="Kết quả xét nghiệm & Toa thuốc mới"
            description="Thông báo khi bác sĩ cập nhật kết quả chẩn đoán hình ảnh, xét nghiệm hoặc đơn thuốc."
            value={labAlert}
            onValueChange={setLabAlert}
          />

          <SettingToggleRow
            icon="notifications-outline"
            iconColor={COLORS.secondary}
            title="Nhắc tái khám & Theo dõi điều trị"
            description="Nhắc lịch tái khám định kỳ và lưu ý dùng thuốc theo hướng dẫn của bác sĩ điều trị."
            value={aiCare}
            onValueChange={setAiCare}
          />

          <SettingToggleRow
            icon="moon-outline"
            title="Chế độ không làm phiền ban đêm"
            description="Trừ trường hợp chuông nhắc thuốc cấp tính • Khung giờ yên tĩnh: 22:30 — 06:30"
            value={dndMode}
            onValueChange={setDndMode}
          />
        </View>

        {/* Privacy & Account Settings */}
        <View style={[styles.sectionCard, SHADOWS.sm]}>
          <SectionHeader
            title="Gia đình, Tủ thuốc & Bảo mật"
            leftIcon="lock-closed-outline"
          />
          <SettingLinkRow
            icon="finger-print-outline"
            title="Đăng nhập sinh trắc học"
            subtitle="FaceID / Vân tay bảo mật"
            rightToggleValue={biometric}
            onRightToggleChange={setBiometric}
          />
          <SettingLinkRow
            icon="people-outline"
            title="Hồ sơ người thân trong gia đình"
            subtitle={`Đang quản lý ${familyMembers.length} hồ sơ phụ (Đồng bộ VssID)`}
            badgeLabel={`${familyMembers.length} thành viên`}
            onPress={() => onNavigate('familyProfiles')}
          />
          <SettingLinkRow
            icon="medkit-outline"
            title="Tủ thuốc gia đình & Nhắc uống thuốc"
            subtitle="Theo dõi số lượng thuốc còn lại tại nhà"
            badgeLabel="Sắp hết 1"
            onPress={() => onNavigate('medicineCabinet')}
          />
          <SettingLinkRow
            icon="document-attach-outline"
            title="Tải tóm tắt hồ sơ khám bệnh (PDF)"
            subtitle="Xuất file PDF kết quả khám & đơn thuốc gần nhất"
            isDownload
            onPress={() => onNavigate('postConsultSummary')}
          />
          <SettingLinkRow
            icon="refresh-circle-outline"
            title="Khôi phục dữ liệu mẫu ban đầu"
            subtitle="Xóa bộ nhớ AsyncStorage & đưa lịch hẹn, đơn thuốc về mặc định"
            badgeLabel="Local Storage"
            onPress={() =>
              Alert.alert(
                'Khôi phục dữ liệu mặc định?',
                'Toàn bộ lịch hẹn mới đặt, người thân vừa thêm và thuốc bác sĩ vừa kê trong bộ nhớ máy sẽ được đặt lại về ban đầu.',
                [
                  { text: 'Hủy', style: 'cancel' },
                  {
                    text: 'Khôi phục',
                    style: 'destructive',
                    onPress: async () => {
                      await resetAppData();
                      setResetToast(true);
                    },
                  },
                ]
              )
            }
          />
        </View>

        {/* Emergency 115 & Clinic Support Hotline Banner */}
        {/* TODO: Remove "(Dữ liệu mẫu)" label before production release */}
        <View style={styles.hotlineBanner}>
          <View style={styles.hotlineIcon}>
            <Ionicons name="medical" size={20} color={COLORS.error} />
          </View>
          <View style={{ flex: 1, minWidth: 0, marginHorizontal: 10 }}>
            <Text style={styles.hotlineLabel} numberOfLines={1}>
              Cấp Cứu Y Tế 115 & Tổng Đài Hỗ Trợ (Dữ liệu mẫu)
            </Text>
            <Text style={styles.hotlineNumber} numberOfLines={1}>
              Cấp cứu: 115 • Hỗ trợ: 1900 6868
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <AppButton
            title="Gọi Cấp cứu 115"
            variant="danger"
            size="md"
            leftIcon="call-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={() => Linking.openURL('tel:115')}
          />
          <AppButton
            title="Hỗ trợ 1900 6868"
            variant="tonal"
            size="md"
            leftIcon="headset-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={() => Linking.openURL('tel:19006868')}
          />
        </View>

        <AppButton
          title="Đăng xuất tài khoản"
          variant="dangerOutline"
          size="md"
          leftIcon="log-out-outline"
          onPress={onLogout}
          style={{ marginTop: 12 }}
        />

        <Text style={styles.versionFooter}>
          SmartClinic Mobile App • v2.4.0 (Build 2024.10){'\n'}
          Tiêu chuẩn an toàn dữ liệu y tế HL7/FHIR & Bộ Y Tế Việt Nam
        </Text>
      </ScrollView>

      <ToastBanner
        visible={resetToast}
        title="Đã khôi phục dữ liệu mặc định"
        message="Bộ nhớ lưu trữ trên thiết bị (AsyncStorage) đã được làm mới."
        onDismiss={() => setResetToast(false)}
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
    padding: SPACING.md,
    paddingBottom: 28,
  },
  quickServiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickServiceCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  quickServiceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  quickServiceTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  quickServiceSub: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  emptyDoctorFilter: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  emptyDoctorText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  clearFilterBtn: {
    minHeight: TOUCH.min,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFilterText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ocrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  ocrIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ocrTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ocrSub: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  moreConsultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: 6,
  },
  moreConsultTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  moreConsultSub: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 18,
  },
  statBox: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  statBoxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.xxs,
    marginBottom: SPACING.xs,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBigNum: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statBoxTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statBoxSub: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    ...LAYOUT.card,
    marginBottom: SPACING.md,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  notifyIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionCardTitle: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionCardSub: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  hotlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorSurface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.errorContainer,
  },
  hotlineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotlineLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hotlineNumber: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.error,
    marginTop: 2,
  },
  versionFooter: {
    fontSize: TYPOGRAPHY.size.xxs,
    lineHeight: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 18,
  },
});

