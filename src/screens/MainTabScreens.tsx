import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
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
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectDoctor,
  onBookDoctor,
  onAskAI,
  onOpenProfile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('cardio');

  return (
    <View style={styles.screen}>
      <HomeGreetingHeader
        userName="Vũ"
        avatarUrl={PATIENT_PROFILE.avatar}
        onChatPress={onAskAI}
        onAvatarPress={onOpenProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          value={search}
          onChangeText={setSearch}
          style={{ marginBottom: 16 }}
        />

        <AIHeroBanner
          onAskAIPress={onAskAI}
          style={{ marginBottom: 20 }}
        />

        <SectionHeader
          title="Chuyên khoa"
          subtitle="Chọn khoa để đặt khám theo nhu cầu"
          actionText="Xem tất cả"
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
        />
        {HOSPITALS.map((h) => (
          <HospitalCard key={h.id} hospital={h} />
        ))}
      </ScrollView>
    </View>
  );
};

export interface EHRScreenProps {
  onAskAI: () => void;
}

export const EHRScreen: React.FC<EHRScreenProps> = ({ onAskAI }) => {
  const [filterKey, setFilterKey] = useState('all');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Hồ sơ bệnh án điện tử"
        subtitle="SmartClinic EHR • Dữ liệu mã hóa cấp y tế"
        leftIconBox="folder-open-outline"
        rightActions={[
          { icon: 'document-text-outline' },
          { icon: 'share-social-outline' },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <PatientMasterIdentityCard style={{ marginBottom: 16 }} />

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

        <SectionHeader
          title="Đơn thuốc đang điều trị"
          leftIcon="medkit-outline"
          badgeText="Đang uống (Ngày 2/7)"
          badgeVariant="teal"
        />
        <ActivePrescriptionCard
          doctor={DOCTORS[0]}
          prescriptionCode="#DT-241029-01"
          date="29/10/2024"
          drugs={PRESCRIPTION_DRUGS}
        />

        <SectionHeader
          title="Xét nghiệm & Chẩn đoán hình ảnh"
          leftIcon="flask-outline"
          actionText="Xem tất cả (8)"
        />
        <LabImagingCard />

        <SectionHeader
          title="Lịch sử khám bệnh"
          leftIcon="calendar-outline"
          actionText="Gần nhất: 29/10/2024"
        />
        <MedicalHistoryTimeline />

        {/* Upload External Record OCR Card */}
        <View style={[styles.ocrCard, SHADOWS.sm]}>
          <View style={styles.ocrIconBox}>
            <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
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
          />
        </View>
      </ScrollView>
    </View>
  );
};

export interface AppointmentsScreenProps {
  onSelectDoctor: (doctor: DoctorItem) => void;
  onBookNew: () => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  onSelectDoctor,
  onBookNew,
}) => {
  const [statusTab, setStatusTab] = useState('upcoming');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Lịch Khám Của Tôi"
        subtitle="Hệ thống phòng khám SmartClinic"
        leftIconBox="calendar-outline"
        rightActions={[
          { icon: 'search-outline' },
          { icon: 'options-outline', showBadgeDot: true },
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

        <AIReminderCard style={{ marginBottom: 14 }} />

        {APPOINTMENTS.map((apt) => (
          <AppointmentCard
            key={apt.id}
            appointment={apt}
            onPrimaryPress={() => onSelectDoctor(apt.doctor)}
          />
        ))}

        {/* Need more consultation banner */}
        <View style={styles.moreConsultBanner}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.moreConsultTitle}>Cần tư vấn thêm bác sĩ?</Text>
            <Text style={styles.moreConsultSub}>
              Hơn 250+ chuyên gia đầu ngành sẵn sàng phục vụ
            </Text>
          </View>
          <AppButton
            title="+ Đặt lịch mới"
            variant="primary"
            size="md"
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
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onLogout,
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
          { icon: 'help-circle-outline' },
          { icon: 'settings-outline' },
        ]}
        showProfileIcon
      />

      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard style={{ marginBottom: 16 }} />

        <VssIDInsuranceCard style={{ marginBottom: 18 }} />

        <SectionHeader
          title="Tổng quan điều trị"
          actionText="Cập nhật 15 phút trước"
        />
        {/* 2x2 Summary Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, SHADOWS.sm]}>
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
          </View>

          <View style={[styles.statBox, SHADOWS.sm]}>
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
          </View>

          <View style={[styles.statBox, SHADOWS.sm]}>
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
          </View>

          <View style={[styles.statBox, SHADOWS.sm]}>
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
          </View>
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
            title="Bảo mật & Quản lý hồ sơ"
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
            icon="key-outline"
            title="Đổi mật khẩu & 2FA OTP"
            subtitle="Đã bật xác thực qua tin nhắn"
          />
          <SettingLinkRow
            icon="shield-checkmark-outline"
            title="Mã hóa bệnh án EHR"
            subtitle="Chuẩn mã hóa đầu cuối AES-256 Y Tế"
            badgeLabel="Cực an toàn"
          />
          <SettingLinkRow
            icon="people-outline"
            title="Hồ sơ người thân trong gia đình"
            subtitle="Đang quản lý 3 hồ sơ phụ (Mẹ, Vợ, Con)"
            badgeLabel="3"
          />
          <SettingLinkRow
            icon="document-attach-outline"
            title="Tải toàn bộ hồ sơ điện tử (EHR)"
            subtitle="Xuất file PDF trọn bộ có chữ ký số bác sĩ"
            isDownload
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
  ocrCard: {
    flexDirection: 'row',
    alignItems: 'center',
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

