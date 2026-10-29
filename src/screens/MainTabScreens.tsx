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
  DOCTORS,
  SPECIALTIES,
  HOSPITALS,
  APPOINTMENTS,
  PRESCRIPTION_DRUGS,
  PATIENT_PROFILE,
  DoctorItem,
} from '../data/mockData';
import {
  HomeGreetingHeader,
  SearchBar,
  AIHeroBanner,
  SectionHeader,
  SpecialtyGrid,
  SmartPromoBanner,
  FeaturedDoctorCard,
  HospitalCard,
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
  AIClinicalResponseCard,
  QuickPromptChips,
  ChatBottomInputBar,
  ProfileHeaderCard,
  VssIDInsuranceCard,
  SettingToggleRow,
  SettingLinkRow,
  Badge,
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
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('cardio');

  return (
    <View style={styles.screen}>
      <HomeGreetingHeader
        userName="Vũ"
        avatarUrl={PATIENT_PROFILE.avatar}
        onChatPress={onAskAI}
        onNotificationPress={() => onNavigate('firstDoseAlert')}
        onAvatarPress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onFilterPress={() => onNavigate('directory')}
          style={{ marginBottom: 16 }}
        />

        <AIHeroBanner
          onAskAIPress={onAskAI}
          style={{ marginBottom: 18 }}
        />

        {/* Quick Smart Healthcare Services Strip */}
        <SectionHeader
          title="Tiện ích Y tế thông minh"
          subtitle="Truy cập nhanh các phân hệ khám từ xa, dược phẩm & BHYT"
          actionText="Tất cả (43)"
          onActionPress={() => onNavigate('directory')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 6, marginBottom: 18 }}
        >
          {[
            {
              icon: 'videocam-outline',
              title: 'Khám Video',
              sub: 'Telehealth 24/7',
              route: 'teleconsult',
              color: COLORS.primary,
              bg: COLORS.primaryContainer,
            },
            {
              icon: 'alarm-outline',
              title: 'Nhật ký thuốc',
              sub: 'Nhắc cữ uống',
              route: 'medLog',
              color: COLORS.secondary,
              bg: COLORS.tintTeal,
            },
            {
              icon: 'bicycle-outline',
              title: 'Giao thuốc tận nhà',
              sub: 'Cold Chain 2H',
              route: 'homeDelivery',
              color: COLORS.primary,
              bg: COLORS.primaryContainer,
            },
            {
              icon: 'people-outline',
              title: 'Hồ sơ Gia đình',
              sub: 'Mẹ, Vợ & Bé',
              route: 'familyProfiles',
              color: COLORS.secondary,
              bg: COLORS.tintTeal,
            },
            {
              icon: 'flask-outline',
              title: 'Kết quả CĐHA',
              sub: 'MRI & Xét nghiệm',
              route: 'labImagingResults',
              color: COLORS.primary,
              bg: COLORS.primaryContainer,
            },
            {
              icon: 'receipt-outline',
              title: 'Hóa đơn VAT',
              sub: 'Chứng thư PKI',
              route: 'vatInvoice',
              color: COLORS.secondary,
              bg: COLORS.tintTeal,
            },
          ].map((srv) => (
            <TouchableOpacity
              key={srv.route}
              activeOpacity={0.85}
              onPress={() => onNavigate(srv.route)}
              style={[styles.quickServiceCard, SHADOWS.sm]}
            >
              <View style={[styles.quickServiceIcon, { backgroundColor: srv.bg }]}>
                <Ionicons name={srv.icon as any} size={20} color={srv.color} />
              </View>
              <Text style={styles.quickServiceTitle}>{srv.title}</Text>
              <Text style={styles.quickServiceSub}>{srv.sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader
          title="Chuyên khoa"
          subtitle="Chọn khoa để đặt khám theo nhu cầu"
          actionText="Xem tất cả"
          onActionPress={() => onSelectDoctor(DOCTORS[0])}
        />
        <SpecialtyGrid
          items={SPECIALTIES}
          selectedId={selectedSpecialty}
          onSelect={(item) => setSelectedSpecialty(item.id)}
          style={{ marginBottom: 18 }}
        />

        <SmartPromoBanner
          onPress={() => onBookDoctor(DOCTORS[0])}
          style={{ marginBottom: 20 }}
        />

        <SectionHeader
          title="Bác sĩ nổi bật"
          subtitle="Chuyên gia đầu ngành sẵn sàng tư vấn"
          actionText="Xem thêm"
          onActionPress={() => onSelectDoctor(DOCTORS[0])}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8, marginBottom: 16 }}
        >
          {DOCTORS.map((doc) => (
            <FeaturedDoctorCard
              key={doc.id}
              doctor={doc}
              onPress={onSelectDoctor}
              onBookPress={onBookDoctor}
            />
          ))}
        </ScrollView>

        <SectionHeader
          title="Bệnh viện gần bạn"
          badgeText="TP. Hồ Chí Minh"
          badgeVariant="teal"
          badgeIcon="navigate"
          actionText="Xem bản đồ"
          onActionPress={() =>
            Alert.alert(
              'Bản đồ cơ sở y tế',
              'Đang hiển thị 3 bệnh viện liên kết BHYT gần vị trí của bạn tại TP. Hồ Chí Minh.'
            )
          }
        />
        {HOSPITALS.map((h) => (
          <HospitalCard
            key={h.id}
            hospital={h}
            onMapPress={(hosp) =>
              Alert.alert(
                hosp.name,
                `Khoảng cách: ${hosp.distance}\nTrạng thái: ${hosp.tag}`,
                [
                  { text: 'Đóng', style: 'cancel' },
                  {
                    text: 'Đặt khám tại đây',
                    onPress: () => onBookDoctor(DOCTORS[0]),
                  },
                ]
              )
            }
          />
        ))}
      </ScrollView>
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
  const [filterKey, setFilterKey] = useState('all');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Hồ sơ bệnh án điện tử"
        subtitle="SmartClinic EHR • Dữ liệu mã hóa cấp y tế"
        leftIconBox="folder-open-outline"
        rightActions={[
          {
            icon: 'document-text-outline',
            onPress: () => onNavigate('fullTaxDossier'),
          },
          {
            icon: 'share-social-outline',
            onPress: () => onNavigate('printShareHistory'),
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <PatientMasterIdentityCard
          onQrPress={() => onNavigate('bookingSuccess')}
          onBhytPress={() => onNavigate('refillBHYT')}
          style={{ marginBottom: 16 }}
        />

        <AIClinicalInsightCard
          onAskAIPress={onAskAI}
          style={{ marginBottom: 16 }}
        />

        <SegmentedControl
          variant="chips"
          selectedKey={filterKey}
          onSelect={setFilterKey}
          options={[
            { key: 'all', label: 'Tất cả', icon: 'grid-outline' },
            {
              key: 'rx',
              label: 'Đơn thuốc điện tử (4)',
              icon: 'document-text-outline',
            },
            { key: 'lab', label: 'Xét nghiệm & CĐHA', icon: 'flask-outline' },
          ]}
          style={{ marginBottom: 16 }}
        />

        {(filterKey === 'all' || filterKey === 'rx') && (
          <>
            <SectionHeader
              title="Đơn thuốc đang điều trị"
              leftIcon="medkit-outline"
              badgeText="Đang uống (Ngày 2/7)"
              badgeVariant="teal"
              actionText="Tủ thuốc gia đình"
              onActionPress={() => onNavigate('medicineCabinet')}
            />
            <ActivePrescriptionCard
              doctor={DOCTORS[0]}
              prescriptionCode="#DT-241029-01"
              date="29/10/2024"
              drugs={PRESCRIPTION_DRUGS}
              onViewOriginal={() => onNavigate('rxDetail')}
              onBuyMedicine={() => onNavigate('homeDelivery')}
              onReminderPress={() => onNavigate('medLog')}
            />
          </>
        )}

        {(filterKey === 'all' || filterKey === 'lab') && (
          <>
            <SectionHeader
              title="Xét nghiệm & Chẩn đoán hình ảnh"
              leftIcon="flask-outline"
              actionText="Xem tất cả (8)"
              onActionPress={() => onNavigate('labImagingResults')}
            />
            <LabImagingCard
              onViewDicom={() => onNavigate('labImagingResults')}
              onDownloadPdf={() => onNavigate('downloadA4Preview')}
              onVerifySignature={() => onNavigate('digitalCertXML')}
            />
          </>
        )}

        {filterKey === 'all' && (
          <>
            <SectionHeader
              title="Lịch sử khám bệnh"
              leftIcon="calendar-outline"
              actionText="Gần nhất: 29/10/2024"
              onActionPress={() => onNavigate('postConsultSummary')}
            />
            <MedicalHistoryTimeline
              onItemPress={() => onNavigate('postConsultSummary')}
            />
          </>
        )}

        {/* Upload External Record OCR Card */}
        <View style={[styles.ocrCard, SHADOWS.sm]}>
          <View style={styles.ocrIconBox}>
            <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, minWidth: 140, marginHorizontal: 10 }}>
            <Text style={styles.ocrTitle}>Tải lên hồ sơ / Toa thuốc ngoài</Text>
            <Text style={styles.ocrSub}>
              AI OCR tự động nhận diện dữ liệu chuẩn EHR
            </Text>
          </View>
          <AppButton
            title="Tải lên"
            variant="primary"
            size="sm"
            leftIcon="camera-outline"
            fullWidth={false}
            onPress={() => onNavigate('fullTaxDossier')}
          />
        </View>
      </ScrollView>
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
  const [statusTab, setStatusTab] = useState('upcoming');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Lịch Khám Của Tôi"
        subtitle="Hệ thống phòng khám SmartClinic"
        leftIconBox="calendar-outline"
        rightActions={[
          {
            icon: 'search-outline',
            onPress: () => onNavigate('directory'),
          },
          {
            icon: 'options-outline',
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
            { key: 'upcoming', label: 'Sắp tới', count: 2 },
            { key: 'completed', label: 'Đã khám', count: 5 },
            { key: 'cancelled', label: 'Đã hủy', count: 1 },
          ]}
          style={{ marginBottom: 14 }}
        />

        {statusTab === 'upcoming' && (
          <>
            <AIReminderCard style={{ marginBottom: 14 }} />

            {APPOINTMENTS.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onPrimaryPress={(item) => {
                  if (item.mode === 'video') {
                    onNavigate('teleconsult');
                  } else {
                    onNavigate('bookingSuccess');
                  }
                }}
                onSecondaryPress={(item) => {
                  if (item.mode === 'clinic') {
                    Alert.alert(
                      'Chỉ đường đến phòng khám',
                      `${item.doctor.hospital}\n${item.room}`,
                      [
                        { text: 'Đóng', style: 'cancel' },
                        {
                          text: 'Xem chi tiết Bác sĩ',
                          onPress: () => onSelectDoctor(item.doctor),
                        },
                      ]
                    );
                  } else {
                    Alert.alert(
                      'Đổi / Hủy lịch hẹn',
                      `Bạn muốn đổi lịch tư vấn Video với ${item.doctor.name}?`,
                      [
                        { text: 'Giữ lịch', style: 'cancel' },
                        {
                          text: 'Chọn khung giờ khác',
                          onPress: () => onBookNew(),
                        },
                      ]
                    );
                  }
                }}
              />
            ))}
          </>
        )}

        {statusTab === 'completed' && (
          <View style={[styles.sectionCard, SHADOWS.sm]}>
            <View style={styles.statBoxTop}>
              <Badge label="Hoàn thành • 28/10/2024" variant="teal" showDot />
              <Badge label="Đã ký số PKI" variant="blue" />
            </View>
            <Text style={styles.sectionCardTitle}>
              Khám Chuyên khoa Nội Thần Kinh — TS. BS. Lê Thu Trang
            </Text>
            <Text style={styles.sectionCardSub}>
              Chẩn đoán: Đau nửa đầu Migraine (G43.0) • Mã ca: #KB-2024-9982
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <AppButton
                title="Tóm tắt & Toa ký số"
                variant="primary"
                size="sm"
                leftIcon="document-text-outline"
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => onNavigate('postConsultSummary')}
              />
              <AppButton
                title="Hóa đơn VAT"
                variant="tonal"
                size="sm"
                leftIcon="receipt-outline"
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => onNavigate('vatInvoice')}
              />
            </View>
          </View>
        )}

        {statusTab === 'cancelled' && (
          <View style={[styles.sectionCard, SHADOWS.sm]}>
            <Badge label="Đã hủy theo yêu cầu • 10/10/2024" variant="danger" />
            <Text style={[styles.sectionCardTitle, { marginTop: 8 }]}>
              Khám Da Liễu Thẩm Mỹ — BS. CKI. Đặng Thảo Vy
            </Text>
            <Text style={styles.sectionCardSub}>
              Lý do: Bận công tác đột xuất • Đã hoàn 100% phí đặt cọc
            </Text>
            <AppButton
              title="Đặt lại lịch khám này"
              variant="outline"
              size="sm"
              leftIcon="refresh-outline"
              onPress={onBookNew}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

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
  const [extraMessages, setExtraMessages] = useState<
    { id: string; sender: 'user' | 'ai'; text: string; time: string }[]
  >([]);

  const handleSend = (customText?: string) => {
    const content = (customText ?? inputMsg).trim();
    if (!content) return;
    setExtraMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: content, time: '09:44' },
      {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Trợ lý AI đã ghi nhận thêm thông tin của bạn. Bạn nên hạn chế cà phê, uống đủ 2 lít nước/ngày và nghỉ mắt mỗi 45 phút làm việc máy tính. Nếu đau đầu kèm sốt cao hoặc tê yếu tay chân, cần đến cơ sở y tế ngay.',
        time: '09:44',
      },
    ]);
    if (!customText) setInputMsg('');
  };

  return (
    <View style={styles.screen}>
      <AppHeader
        title="AI Health Assistant"
        subtitle="● Trợ lý y tế thông minh AI"
        badgeText="AI 24/7"
        leftIconBox="sparkles"
        rightActions={[
          { icon: 'time-outline' },
          { icon: 'refresh-outline', onPress: () => setExtraMessages([]) },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <AIMedicalTriageBanner />

        <AIChatBubble
          sender="ai"
          message="Xin chào Vũ! Tôi là Trợ lý Y tế SmartClinic. Bạn đang gặp vấn đề sức khỏe hay có triệu chứng gì? Hãy mô tả chi tiết để tôi phân tích và gợi ý chuyên khoa phù hợp."
          time="09:41"
        />

        <AIChatBubble
          sender="user"
          message="Tôi bị đau đầu vùng thái dương và cảm giác chóng mặt buồn nôn nhẹ trong 2 ngày nay, làm việc máy tính nhiều thì đau tăng lên."
          time="09:42"
        />

        <AIClinicalResponseCard
          doctors={[DOCTORS[0], DOCTORS[3]]}
          onBookDoctor={onBookDoctor}
        />

        {extraMessages.map((m) => (
          <AIChatBubble
            key={m.id}
            sender={m.sender}
            message={m.text}
            time={m.time}
          />
        ))}

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
    </View>
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
  const [pillReminder, setPillReminder] = useState(true);
  const [aptAlert, setAptAlert] = useState(true);
  const [labAlert, setLabAlert] = useState(true);
  const [aiCare, setAiCare] = useState(true);
  const [dndMode, setDndMode] = useState(true);
  const [biometric, setBiometric] = useState(true);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Cá Nhân"
        rightActions={[
          {
            icon: 'help-circle-outline',
            onPress: () => onNavigate('directory'),
          },
          {
            icon: 'settings-outline',
            onPress: () => onNavigate('showcase'),
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
          onDetailPress={() => onNavigate('refillBHYT')}
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
            <Text style={[styles.statBigNum, { color: COLORS.primary }]}>2</Text>
            <Text style={styles.statBoxTitle}>Lịch hẹn sắp tới</Text>
            <Text style={styles.statBoxSub}>
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
            <Text style={styles.statBoxTitle}>Toa thuốc đang uống</Text>
            <Text style={styles.statBoxSub}>3 cữ/ngày • Còn 5 ngày</Text>
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
            <Text style={styles.statBoxTitle}>Hồ sơ bệnh án</Text>
            <Text style={styles.statBoxSub}>MRI, X-Quang & Huyết học</Text>
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
            <Text style={styles.statBoxTitle}>Bác sĩ phụ trách</Text>
            <Text style={styles.statBoxSub}>Chuyên khoa & Tư vấn AI</Text>
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
            footerActionLabel="Tùy biến giờ"
            onFooterAction={() => onNavigate('firstDoseAlert')}
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
            description="Thông báo tức thì khi bác sĩ ký số kết quả MRI, xét nghiệm máu hoặc xuất toa dược lâm sàng điện tử."
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
            title="Bảo mật, Gia đình & Chứng từ Y tế"
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
            subtitle="Đang quản lý 3 hồ sơ phụ (Mẹ, Vợ, Con)"
            badgeLabel="3 thành viên"
            onPress={() => onNavigate('familyProfiles')}
          />
          <SettingLinkRow
            icon="medkit-outline"
            title="Tủ thuốc gia đình & Nhắc nạp thuốc"
            subtitle="Theo dõi tồn kho thuốc tại nhà & đặt giao nhanh"
            badgeLabel="Cần nạp 1"
            onPress={() => onNavigate('medicineCabinet')}
          />
          <SettingLinkRow
            icon="receipt-outline"
            title="Hóa đơn điện tử VAT & Đối soát Thuế GDT"
            subtitle="Tra cứu hóa đơn GTGT và quyền lợi BHYT"
            badgeLabel="Hợp lệ"
            onPress={() => onNavigate('vatInvoice')}
          />
          <SettingLinkRow
            icon="shield-checkmark-outline"
            title="Mã hóa bệnh án EHR & Thẩm định NEAC"
            subtitle="Chuẩn chữ ký số PKI Quốc gia & AES-256"
            badgeLabel="PKI Verified"
            onPress={() => onNavigate('neacPublicLookup')}
          />
          <SettingLinkRow
            icon="print-outline"
            title="Lịch sử In ấn AirPrint & Email Kế toán"
            subtitle="Quản lý lệnh in không dây và gửi chứng từ thuế"
            onPress={() => onNavigate('printShareHistory')}
          />
          <SettingLinkRow
            icon="document-attach-outline"
            title="Tải toàn bộ hồ sơ điện tử (EHR)"
            subtitle="Xuất file PDF trọn bộ có chữ ký số bác sĩ"
            isDownload
            onPress={() => onNavigate('fullTaxDossier')}
          />
        </View>

        {/* Emergency Hotline Banner */}
        <View style={styles.hotlineBanner}>
          <View style={styles.hotlineIcon}>
            <Ionicons name="headset-outline" size={20} color={COLORS.error} />
          </View>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <Text style={styles.hotlineLabel}>
              Hotline Cấp Cứu & Trợ Giúp 24/7
            </Text>
            <Text style={styles.hotlineNumber}>1900 6868</Text>
          </View>
          <AppButton
            title="Gọi ngay"
            variant="danger"
            size="sm"
            leftIcon="call-outline"
            fullWidth={false}
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
  quickServiceCard: {
    width: 118,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  quickServiceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickServiceTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  quickServiceSub: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ocrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
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
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ocrSub: {
    fontSize: 11,
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
    padding: 16,
    marginTop: 6,
  },
  moreConsultTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  moreConsultSub: {
    fontSize: 11.5,
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
    borderColor: '#EEF2FF',
  },
  statBoxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
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
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statBoxTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statBoxSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEF2FF',
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
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sectionCardSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  hotlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
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
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hotlineNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.error,
    marginTop: 2,
  },
  versionFooter: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 18,
  },
});

