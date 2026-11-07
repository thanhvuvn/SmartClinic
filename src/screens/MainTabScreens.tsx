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
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TOUCH, TYPOGRAPHY } from '../theme';
import {
  DOCTORS,
  SPECIALTIES,
  HOSPITALS,
  APPOINTMENTS,
  PRESCRIPTION_DRUGS,
  PATIENT_PROFILE,
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
  const { appointments } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedMapHospital, setSelectedMapHospital] = useState<HospitalItem | null>(null);
  const insets = useSafeAreaInsets();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 850);
  };

  // Filter upcoming appointments to show on Home
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'upcoming'
  ).slice(0, 2);

  const selectedSpecialtyObj = SPECIALTIES.find((s) => s.id === selectedSpecialty);

  const filteredDoctors = DOCTORS.filter((doc) => {
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

  const filteredHospitals = HOSPITALS.filter((h) => {
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
          onNotificationPress={() => onNavigate('medLog')}
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
        <AnimatedEntry delay={30}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm bác sĩ, chuyên khoa, bệnh viện..."
            style={{ marginBottom: SPACING.lg }}
          />
        </AnimatedEntry>

        {/* Upcoming appointments section placed immediately below SearchBar */}
        {upcomingAppointments.length > 0 && (
          <AnimatedEntry delay={70}>
            <SectionHeader
              title="Lịch hẹn sắp tới"
              subtitle="Cuộc hẹn đã xác nhận của bạn"
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
        <AnimatedEntry delay={120}>
          <AIHeroBanner
            onAskAIPress={onAskAI}
            style={{ marginBottom: SPACING.lg }}
          />
        </AnimatedEntry>

        {/* Quick Services — 2×2 grid */}
        <AnimatedEntry delay={170}>
          <SectionHeader
            title="Tiện ích Y tế thông minh"
            subtitle="Truy cập nhanh tư vấn bác sĩ, nhắc thuốc & hồ sơ gia đình"
          />
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
        <AnimatedEntry delay={220}>
          <SectionHeader
            title="Chuyên khoa"
            subtitle="Chọn khoa để lọc bác sĩ theo nhu cầu"
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
        <AnimatedEntry delay={270}>
          <SectionHeader
            title={
              selectedSpecialtyObj
                ? `Bác sĩ ${selectedSpecialtyObj.name}`
                : 'Bác sĩ nổi bật'
            }
            subtitle={
              selectedSpecialtyObj
                ? `Tìm thấy ${filteredDoctors.length} bác sĩ chuyên khoa`
                : 'Chuyên gia đầu ngành sẵn sàng tư vấn'
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
        <AnimatedEntry delay={320}>
          <PressableScale
            onPress={() => onBookDoctor(DOCTORS[0])}
            style={{ marginBottom: SPACING.lg }}
          >
            <SmartPromoBanner />
          </PressableScale>
        </AnimatedEntry>

        {/* Hospitals near you */}
        <AnimatedEntry delay={370}>
          <SectionHeader
            title="Bệnh viện gần bạn"
            badgeText="TP. Hồ Chí Minh"
            badgeVariant="teal"
            badgeIcon="navigate"
            actionText="Xem bản đồ"
            onActionPress={() => {
              setSelectedMapHospital(HOSPITALS[0]);
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
        <AnimatedEntry delay={40} direction="up">
          <PatientMasterIdentityCard
            onQrPress={() => onNavigate('bookingSuccess')}
            onBhytPress={() => onNavigate('familyProfiles')}
            style={{ marginBottom: 16 }}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={90} direction="up">
          <AIClinicalInsightCard
            onAskAIPress={onAskAI}
            style={{ marginBottom: 16 }}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={140} direction="up">
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
          <AnimatedEntry delay={190} direction="up">
            <SectionHeader
              title="Đơn thuốc đang điều trị"
              leftIcon="medkit-outline"
              badgeText="Ngày 2/7"
              badgeVariant="teal"
              actionText="Tủ thuốc"
              onActionPress={() => onNavigate('medicineCabinet')}
            />
            <ActivePrescriptionCard
              doctor={DOCTORS[0]}
              prescriptionCode="#DT-241029-01"
              date="29/10/2024"
              drugs={prescriptions}
              onViewOriginal={() => onNavigate('rxDetail')}
              onBuyMedicine={() => onNavigate('medicineCabinet')}
              onReminderPress={() => onNavigate('medLog')}
            />
          </AnimatedEntry>
        )}

        {(filterKey === 'all' || filterKey === 'lab') && (
          <AnimatedEntry delay={240} direction="up">
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
              onVerifySignature={() => onNavigate('teleconsult')}
            />
          </AnimatedEntry>
        )}

        {filterKey === 'all' && (
          <AnimatedEntry delay={290} direction="up">
            <SectionHeader
              title="Lịch sử khám bệnh"
              leftIcon="calendar-outline"
              actionText="Gần nhất: 29/10/2024"
              onActionPress={() => onNavigate('postConsultSummary')}
            />
            <MedicalHistoryTimeline
              onItemPress={() => onNavigate('postConsultSummary')}
            />
          </AnimatedEntry>
        )}

        {/* Upload External Record Card */}
        <AnimatedEntry delay={340} direction="up">
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

  const upcomingList = appointments.filter((a) => a.status === 'upcoming');
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
            <AnimatedEntry delay={40} direction="up">
              <AIReminderCard style={{ marginBottom: 14 }} />
            </AnimatedEntry>

            {upcomingList.length > 0 ? (
              upcomingList.map((apt, idx) => (
                <AnimatedEntry key={apt.id} delay={100 + idx * 70} direction="up">
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
                  title="Chat với Bác sĩ"
                  variant="tonal"
                  size="sm"
                  leftIcon="chatbubbles-outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => onNavigate('teleconsult')}
                />
              </View>
            </View>
          ))}

        {statusTab === 'cancelled' &&
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
          ))}

        {/* Need more consultation banner */}
        <View style={styles.moreConsultBanner}>
          <View style={{ flex: 1, minWidth: 150, paddingRight: 10 }}>
            <Text style={styles.moreConsultTitle}>Cần tư vấn thêm bác sĩ?</Text>
            <Text style={styles.moreConsultSub}>
              Hơn 250+ chuyên gia đầu ngành sẵn sàng phục vụ
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

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  onBookDoctor,
}) => {
  const [inputMsg, setInputMsg] = useState('');
  const [showSampleThread, setShowSampleThread] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [extraMessages, setExtraMessages] = useState<
    { id: string; sender: 'user' | 'ai'; text: string; time: string }[]
  >([]);
  const chatScrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const handleSend = (customText?: string) => {
    const content = (customText ?? inputMsg).trim();
    if (!content || isTyping) return;
    setExtraMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: content, time: '09:44' },
    ]);
    if (!customText) setInputMsg('');

    // TODO: Replace simulated typing timeout and sample response with real AI triage backend API
    setIsTyping(true);
    setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    setTimeout(() => {
      setIsTyping(false);
      setExtraMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Trợ lý AI đã ghi nhận thêm thông tin của bạn. Bạn nên hạn chế cà phê, uống đủ 2 lít nước/ngày và nghỉ mắt mỗi 45 phút làm việc máy tính. Nếu đau đầu kèm sốt cao hoặc tê yếu tay chân, cần đến cơ sở y tế ngay.',
          time: '09:44',
        },
      ]);
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 550);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="AI Health Assistant"
        subtitle="Trợ lý y tế thông minh AI"
        badgeText="AI 24/7"
        leftIconBox="sparkles"
        rightActions={[
          { icon: 'time-outline', label: 'Lịch sử trò chuyện' },
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
          message="Xin chào Vũ! Tôi là Trợ lý Y tế SmartClinic. Bạn đang gặp vấn đề sức khỏe hay có triệu chứng gì? Hãy mô tả chi tiết để tôi phân tích và gợi ý chuyên khoa phù hợp."
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

        {extraMessages.map((m) => (
          <AIChatBubble
            key={m.id}
            sender={m.sender}
            message={m.text}
            time={m.time}
          />
        ))}

        {isTyping && <AITypingIndicator />}

        <QuickPromptChips
          prompts={[
            { label: 'Tôi cần kiêng cử gì?', icon: 'restaurant-outline' },
            {
              label: 'Dấu hiệu cần cấp cứu',
              icon: 'medical-outline',
              danger: true,
            },
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
  const { appointments, familyMembers, resetAppData } = useAppContext();
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
        showProfileIcon
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard
          onEditPress={() => onNavigate('addFamilyMember')}
          onQrPress={() => onNavigate('bookingSuccess')}
          style={{ marginBottom: 16 }}
        />

        <VssIDInsuranceCard
          onDetailPress={() => onNavigate('familyProfiles')}
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
              <Badge label="94% chuẩn" variant="teal" />
            </View>
            <Text style={[styles.statBigNum, { color: COLORS.secondary }]}>1</Text>
            <Text style={styles.statBoxTitle} numberOfLines={1}>
              Toa thuốc đang uống
            </Text>
            <Text style={styles.statBoxSub} numberOfLines={1}>
              3 cữ/ngày • Còn 5 ngày
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
                Hệ thống chăm sóc tự động y tế thông minh
              </Text>
            </View>
          </View>

          <SettingToggleRow
            icon="medkit-outline"
            iconColor={COLORS.secondary}
            title="Nhắc lịch uống thuốc thông minh"
            description="Rung & âm báo riêng biệt trước 10 phút các cữ sáng (08:00), chiều (14:00), tối (21:00)."
            value={pillReminder}
            onValueChange={setPillReminder}
            footerNote="Chuông y tế độc quyền: MedAlert Melodic"
            footerActionLabel="Xem lịch thuốc"
            onFooterAction={() => onNavigate('medLog')}
          />

          <SettingToggleRow
            icon="calendar-outline"
            title="Thông báo lịch hẹn & Khám bệnh"
            description="Nhắc trước 24h & 2h kèm số thứ tự phòng khám thực tế và chỉ đường tự động check-in qua QR."
            value={aptAlert}
            onValueChange={setAptAlert}
          />

          <SettingToggleRow
            icon="document-text-outline"
            title="Kết quả xét nghiệm & Toa thuốc mới"
            description="Thông báo tức thì khi bác sĩ cập nhật kết quả MRI, xét nghiệm máu hoặc xuất đơn thuốc điện tử."
            value={labAlert}
            onValueChange={setLabAlert}
          />

          <SettingToggleRow
            icon="sparkles-outline"
            iconColor={COLORS.secondary}
            title="AI Health Assistant & Chăm sóc chủ động"
            description="Lời khuyên theo dõi đau đầu theo nhịp sinh học, cảnh báo thời tiết giao mùa và tương tác dược động học."
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

