import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from '../theme';
import {
  DOCTORS,
  PATIENT_PROFILE,
  PRESCRIPTION_DRUGS,
  SPECIALTIES,
} from '../data/mockData';
import {
  AppHeader,
  AppButton,
  AppInput,
  Badge,
  SectionHeader,
  SegmentedControl,
  SettingToggleRow,
} from '../components';

// ==========================================
// 1. ADMIN PORTAL (QUẢN TRỊ VIÊN HỆ THỐNG)
// ==========================================
export interface AdminDashboardScreenProps {
  onLogout: () => void;
  onNavigate?: (routeKey: string) => void;
}

type AdminTab = 'overview' | 'doctors' | 'appointments' | 'settings';

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [docFilter, setDocFilter] = useState('all');
  const [searchDoc, setSearchDoc] = useState('');
  const [autoSyncVssID, setAutoSyncVssID] = useState(true);
  const [autoGdtTax, setAutoGdtTax] = useState(true);

  const renderOverview = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      {/* Admin Identity Hero Banner */}
      <LinearGradient
        colors={['#0F172A', '#004B73', '#006A61']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroBanner, SHADOWS.md]}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroUserRow}>
            <View style={styles.adminAvatarCircle}>
              <Ionicons name="shield-checkmark" size={24} color="#86F2E4" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.heroName}>Admin Hệ Thống</Text>
                <Badge label="SUPER ADMIN" variant="teal" />
              </View>
              <Text style={styles.heroEmail}>admin@smartclinic.vn • Toàn quyền</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroMetricsStrip}>
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricVal}>99.98%</Text>
            <Text style={styles.heroMetricLabel}>Uptime Server</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricVal}>HL7/FHIR</Text>
            <Text style={styles.heroMetricLabel}>Chuẩn dữ liệu</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricVal}>Realtime</Text>
            <Text style={styles.heroMetricLabel}>Đồng bộ lịch khám</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 4 KPI Stat Cards */}
      <SectionHeader
        title="Số liệu vận hành hôm nay"
        subtitle="Cập nhật thời gian thực (29/10/2024)"
      />
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, SHADOWS.sm]}>
          <View style={styles.kpiTop}>
            <View style={styles.kpiIconBlue}>
              <Ionicons name="calendar" size={18} color={COLORS.primary} />
            </View>
            <Badge label="+18%" variant="teal" />
          </View>
          <Text style={styles.kpiValue}>142</Text>
          <Text style={styles.kpiTitle}>Lịch khám hôm nay</Text>
          <Text style={styles.kpiSub}>118 tại viện • 24 Chat</Text>
        </View>

        <View style={[styles.kpiCard, SHADOWS.sm]}>
          <View style={styles.kpiTop}>
            <View style={styles.kpiIconTeal}>
              <Ionicons name="cash-outline" size={18} color={COLORS.secondary} />
            </View>
            <Badge label="Đạt chỉ tiêu" variant="teal" />
          </View>
          <Text style={[styles.kpiValue, { color: COLORS.secondary }]}>
            48.5M đ
          </Text>
          <Text style={styles.kpiTitle}>Doanh thu viện phí</Text>
          <Text style={styles.kpiSub}>96 lượt thanh toán</Text>
        </View>

        <View style={[styles.kpiCard, SHADOWS.sm]}>
          <View style={styles.kpiTop}>
            <View style={styles.kpiIconBlue}>
              <Ionicons name="medkit-outline" size={18} color={COLORS.primary} />
            </View>
            <Badge label="90% trực" variant="blue" />
          </View>
          <Text style={styles.kpiValue}>38 / 42</Text>
          <Text style={styles.kpiTitle}>Bác sĩ đang trực</Text>
          <Text style={styles.kpiSub}>8 chuyên khoa hoạt động</Text>
        </View>

        <View style={[styles.kpiCard, SHADOWS.sm]}>
          <View style={styles.kpiTop}>
            <View style={styles.kpiIconTeal}>
              <Ionicons name="people-outline" size={18} color={COLORS.secondary} />
            </View>
            <Badge label="+64 mới" variant="teal" />
          </View>
          <Text style={styles.kpiValue}>12,480</Text>
          <Text style={styles.kpiTitle}>Hồ sơ bệnh nhân EHR</Text>
          <Text style={styles.kpiSub}>100% đồng bộ VssID</Text>
        </View>
      </View>

      {/* Specialty Load Distribution */}
      <View style={[styles.card, SHADOWS.sm]}>
        <SectionHeader
          title="Tỷ lệ đặt khám theo chuyên khoa"
          leftIcon="bar-chart-outline"
        />
        {[
          { name: 'Nội Thần Kinh (TS. BS. Lê Thu Trang)', count: 42, pct: 85, color: COLORS.primary },
          { name: 'Tim Mạch Can Thiệp (BS. CKII. Nguyễn Văn Minh)', count: 36, pct: 72, color: COLORS.secondary },
          { name: 'Nhãn Khoa / Mắt (ThS. BS. Nguyễn Minh Đức)', count: 28, pct: 56, color: '#0284C7' },
          { name: 'Ngoại Thần Kinh (PGS. BS. Trần Anh Tuấn)', count: 21, pct: 44, color: '#0D9488' },
        ].map((item) => (
          <View key={item.name} style={styles.barRow}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barName}>{item.name}</Text>
              <Text style={styles.barCount}>{item.count} ca ({item.pct}%)</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${item.pct}%`, backgroundColor: item.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderDoctorsManagement = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <AppInput
        leftIcon="search-outline"
        placeholder="Tìm bác sĩ theo tên, mã CCHN, chuyên khoa..."
        value={searchDoc}
        onChangeText={setSearchDoc}
      />

      <SegmentedControl
        variant="chips"
        selectedKey={docFilter}
        onSelect={setDocFilter}
        options={[
          { key: 'all', label: `Tất cả (${DOCTORS.length})` },
          { key: 'active', label: 'Đang trực (4)' },
          { key: 'pending', label: 'Chờ duyệt CCHN (1)' },
        ]}
        style={{ marginBottom: 14 }}
      />

      <AppButton
        title="+ Thêm bác sĩ mới vào hệ thống"
        variant="primary"
        size="md"
        onPress={() =>
          Alert.alert(
            'Thêm Bác sĩ mới',
            'Mở biểu mẫu cấp tài khoản Bác sĩ & xác thực chứng chỉ hành nghề Y khoa Bộ Y Tế.'
          )
        }
        style={{ marginBottom: 14 }}
      />

      {DOCTORS.map((doc) => (
        <View key={doc.id} style={[styles.card, SHADOWS.sm]}>
          <View style={styles.docManageRow}>
            <Image source={{ uri: doc.avatar }} style={styles.docAvatar} />
            <View style={styles.docManageInfoCol}>
              <View style={styles.docNameBadgeRow}>
                <Text
                  style={[styles.docName, { flexShrink: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {doc.name}
                </Text>
                <Badge
                  label="Đã xác thực"
                  variant="teal"
                  icon="checkmark-circle"
                />
              </View>
              <Text style={styles.docSub}>{doc.degree}</Text>
              <Text style={styles.docHospitalLine}>🏥 {doc.hospital}</Text>
              <Text style={styles.docMeta}>
                Phí khám: {doc.fee} • ★ {doc.rating} ({doc.reviewCount} lượt)
              </Text>
            </View>
          </View>

          <View style={styles.docActionRow}>
            <AppButton
              title="Phân lịch trực"
              variant="tonal"
              size="sm"
              leftIcon="calendar-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() =>
                Alert.alert('Lịch trực', `Đã mở bảng phân ca trực cho ${doc.name}`)
              }
            />
            <AppButton
              title="Cấu hình phí & BHYT"
              variant="outline"
              size="sm"
              leftIcon="create-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() =>
                Alert.alert('Cấu hình', `Chỉnh sửa thông tin ${doc.name}`)
              }
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderAppointmentsManagement = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Điều phối lịch hẹn toàn viện"
        subtitle="Danh sách bệnh nhân đăng ký khám ngày 29/10/2024"
      />
      {[
        {
          code: '#SC-241029-8892',
          patient: 'Nguyễn Văn Vũ (32T • Nam)',
          doctor: 'TS. BS. Lê Thu Trang',
          time: '09:30 - Phòng 302',
          status: 'Đã check-in QR',
          variant: 'teal' as const,
        },
        {
          code: '#SC-241029-8904',
          patient: 'Trần Thị Bích (45T • Nữ)',
          doctor: 'TS. BS. Lê Thu Trang',
          time: '10:00 - Phòng 302',
          status: 'Đang chờ khám',
          variant: 'blue' as const,
        },
        {
          code: '#SC-241029-8911',
          patient: 'Lê Hoàng Khôi (58T • Nam)',
          doctor: 'BS. CKII. Nguyễn Văn Minh',
          time: '10:30 - Phòng Tim Mạch 104',
          status: 'BHYT Đúng tuyến',
          variant: 'teal' as const,
        },
        {
          code: '#SC-241104-5120',
          patient: 'Nguyễn Văn Vũ (32T • Nam)',
          doctor: 'ThS. BS. Nguyễn Minh Đức',
          time: '14:00 (04/11) - Chat trực tuyến',
          status: 'Tư vấn từ xa',
          variant: 'blue' as const,
        },
      ].map((item) => (
        <View key={item.code} style={[styles.card, SHADOWS.sm]}>
          <View style={styles.aptRowTop}>
            <Text style={styles.aptCode}>{item.code}</Text>
            <Badge label={item.status} variant={item.variant} showDot />
          </View>
          <Text style={styles.aptPatient}>Bệnh nhân: {item.patient}</Text>
          <Text style={styles.aptDoc}>Bác sĩ phụ trách: {item.doctor}</Text>
          <Text style={styles.aptTime}>Khung giờ: {item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderAdminSettings = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, SHADOWS.sm]}>
        <SectionHeader
          title="Cấu hình hệ thống & BHYT"
          leftIcon="server-outline"
        />
        <SettingToggleRow
          icon="shield-checkmark-outline"
          title="Đồng bộ mã thẻ BHYT VssID tự động"
          description="Tự động kiểm tra thẻ BHYT và mức hưởng 80-100% khi bệnh nhân đặt lịch."
          value={autoSyncVssID}
          onValueChange={setAutoSyncVssID}
        />
        <SettingToggleRow
          icon="notifications-outline"
          iconColor={COLORS.secondary}
          title="Tự động gửi thông báo nhắc lịch khám"
          description="Gửi thông báo nhắc nhở trước 24h và 2h cho bệnh nhân và bác sĩ trực."
          value={autoGdtTax}
          onValueChange={setAutoGdtTax}
        />
      </View>

      <AppButton
        title="Đăng xuất khỏi Admin Portal"
        variant="danger"
        size="lg"
        leftIcon="log-out-outline"
        onPress={onLogout}
      />
    </ScrollView>
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        title="SmartClinic Admin"
        subtitle="Quản trị hệ thống • admin@smartclinic.vn"
        badgeText="ADMIN"
        leftIconBox="shield-checkmark-outline"
        rightActions={[
          { icon: 'log-out-outline', onPress: onLogout },
        ]}
      />

      <View style={{ flex: 1 }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'doctors' && renderDoctorsManagement()}
        {activeTab === 'appointments' && renderAppointmentsManagement()}
        {activeTab === 'settings' && renderAdminSettings()}
      </View>

      {/* Admin Bottom Navigation */}
      <View style={[styles.roleTabBar, SHADOWS.md]}>
        {[
          { key: 'overview', label: 'Tổng quan', icon: 'stats-chart' },
          { key: 'doctors', label: 'QL Bác sĩ', icon: 'medkit' },
          { key: 'appointments', label: 'Điều phối lịch', icon: 'calendar' },
          { key: 'settings', label: 'Cấu hình', icon: 'settings' },
        ].map((t) => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.roleTabItem}
              onPress={() => setActiveTab(t.key as AdminTab)}
            >
              <Ionicons
                name={t.icon as any}
                size={20}
                color={active ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTabLabel,
                  active && styles.roleTabLabelActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ==========================================
// 2. DOCTOR PORTAL (GIAO DIỆN BÁC SĨ ĐIỀU TRỊ)
// ==========================================
export interface DoctorDashboardScreenProps {
  onLogout: () => void;
  onNavigate?: (routeKey: string) => void;
}

type DoctorTab = 'schedule' | 'patients' | 'prescribe' | 'profile';

export const DoctorDashboardScreen: React.FC<DoctorDashboardScreenProps> = ({
  onLogout,
  onNavigate,
}) => {
  const doctor = DOCTORS[0]; // TS. BS. Lê Thu Trang
  const [activeTab, setActiveTab] = useState<DoctorTab>('schedule');
  const [diagnosisNote, setDiagnosisNote] = useState(
    'Đau đầu căng thẳng (Tension headache) / Rối loạn vận mạch não nhẹ'
  );
  const [queueStatuses, setQueueStatuses] = useState<Record<string, string>>({
    '1': 'Đã check-in QR • Đang chờ',
    '2': 'Chờ tới lượt',
    '3': 'Chat trực tuyến (14:00)',
  });

  const renderSchedule = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      {/* Doctor Identity Card */}
      <LinearGradient
        colors={GRADIENTS.heroCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroBanner, SHADOWS.md]}
      >
        <View style={styles.heroUserRow}>
          <Image source={{ uri: doctor.avatar }} style={styles.docHeroAvatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Badge label="ĐANG TRỰC CA SÁNG • P.302" variant="teal" showDot />
            <Text style={[styles.heroName, { marginTop: 4 }]}>{doctor.name}</Text>
            <Text style={styles.heroEmail}>
              {doctor.degree} • {doctor.hospital}
            </Text>
          </View>
        </View>

        <View style={styles.heroMetricsStrip}>
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricVal}>18 ca</Text>
            <Text style={styles.heroMetricLabel}>Tổng lịch hôm nay</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricVal}>12 ca</Text>
            <Text style={styles.heroMetricLabel}>Đã hoàn tất</Text>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricVal}>06 ca</Text>
            <Text style={styles.heroMetricLabel}>Đang chờ khám</Text>
          </View>
        </View>
      </LinearGradient>

      <SectionHeader
        title="Hàng đợi bệnh nhân hôm nay"
        subtitle="Thứ 3, 29/10/2024 • Phòng 302 Tòa nhà A"
      />

      {[
        {
          id: '1',
          stt: 'STT #14',
          name: 'Nguyễn Văn Vũ',
          meta: '32 tuổi • Nam • Mã BN: #BN-882910',
          time: '09:30 - 10:00',
          symptom: 'Đau đầu vùng thái dương 2 ngày, chóng mặt khi nhìn màn hình máy tính.',
          allergy: 'Cảnh báo: Dị ứng Penicillin',
        },
        {
          id: '2',
          stt: 'STT #15',
          name: 'Trần Thị Bích',
          meta: '45 tuổi • Nữ • Mã BN: #BN-904112',
          time: '10:00 - 10:30',
          symptom: 'Tái khám rối loạn tiền đình & kiểm tra kết quả chụp MRI sọ não.',
        },
        {
          id: '3',
          stt: 'CHAT #04',
          name: 'Lê Minh Khang',
          meta: '29 tuổi • Nam • Tư vấn Chat trực tuyến',
          time: '14:00 - 14:30',
          symptom: 'Mất ngủ kéo dài, căng cơ cổ vai gáy.',
        },
      ].map((pt) => (
        <View key={pt.id} style={[styles.card, SHADOWS.sm]}>
          <View style={styles.aptRowTop}>
            <Badge label={`${pt.stt} • ${pt.time}`} variant="blue" />
            <Badge label={queueStatuses[pt.id]} variant="teal" showDot />
          </View>

          <Text style={styles.docName}>{pt.name}</Text>
          <Text style={styles.docSub}>{pt.meta}</Text>

          <View style={styles.symptomBox}>
            <Text style={styles.symptomLabel}>Triệu chứng / Lý do khám (AI Triage):</Text>
            <Text style={styles.symptomText}>{pt.symptom}</Text>
          </View>

          {pt.allergy && (
            <Badge
              label={pt.allergy}
              variant="danger"
              icon="warning-outline"
              style={{ marginBottom: 10 }}
            />
          )}

          <View style={styles.docActionRow}>
            <AppButton
              title={pt.id === '3' ? 'Mở phòng Chat' : 'Gọi vào khám'}
              variant="primary"
              size="sm"
              leftIcon={pt.id === '3' ? 'chatbubbles-outline' : 'megaphone-outline'}
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => {
                if (pt.id === '3' && onNavigate) {
                  onNavigate('teleconsult');
                  return;
                }
                setQueueStatuses((prev) => ({
                  ...prev,
                  [pt.id]: 'Đang khám tại P.302',
                }));
                Alert.alert('Gọi bệnh nhân', `Đã phát loa gọi ${pt.stt} - ${pt.name} vào Phòng 302.`);
              }}
            />
            <AppButton
              title="Kê đơn thuốc"
              variant="secondary"
              size="sm"
              leftIcon="create-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => setActiveTab('prescribe')}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderPatientsEHR = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Hồ sơ bệnh án điện tử (EHR)"
        subtitle="Bệnh nhân đang khám: Nguyễn Văn Vũ (#BN-882910)"
      />
      <View style={[styles.card, SHADOWS.sm]}>
        <Text style={styles.docName}>
          {PATIENT_PROFILE.name} ({PATIENT_PROFILE.age} tuổi • {PATIENT_PROFILE.gender})
        </Text>
        <Text style={styles.docSub}>
          Mã BHYT: {PATIENT_PROFILE.bhytCode} • Nhóm máu: {PATIENT_PROFILE.bloodType}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {PATIENT_PROFILE.vitals.map((v) => (
            <View key={v.label} style={styles.vitalMiniBox}>
              <Text style={styles.vitalMiniLabel}>{v.label}</Text>
              <Text style={styles.vitalMiniVal}>{v.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, SHADOWS.sm]}>
        <SectionHeader
          title="Kết quả Cận lâm sàng & CĐHA"
          leftIcon="scan-outline"
          badgeText="Đã duyệt"
          badgeVariant="teal"
          actionText="Xem chi tiết"
          onActionPress={() => onNavigate?.('labImagingResults')}
        />
        <Text style={styles.docName}>Chụp MRI Sọ não (Không cản từ)</Text>
        <Text style={[styles.docSub, { marginTop: 4 }]}>
          Nhu mô não không thấy tổn thương khu trú, hệ thống não thất cân đối, không có dấu hiệu nhồi máu não hay xuất huyết.
        </Text>
        <AppButton
          title="Mở bảng kết quả CĐHA & Xét nghiệm (14 chỉ số)"
          variant="tonal"
          size="sm"
          leftIcon="flask-outline"
          onPress={() => onNavigate?.('labImagingResults')}
          style={{ marginTop: 10 }}
        />
      </View>
    </ScrollView>
  );

  const renderPrescribe = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader
        title="Kê đơn thuốc điện tử"
        subtitle="Bệnh nhân: Nguyễn Văn Vũ (#BN-882910) • Mã toa: #DT-241029-01"
      />

      <View style={[styles.card, SHADOWS.sm]}>
        <AppInput
          label="Chẩn đoán lâm sàng (ICD-10: G44.2)"
          leftIcon="medkit-outline"
          value={diagnosisNote}
          onChangeText={setDiagnosisNote}
        />

        <Text style={styles.rxSectionLabel}>Danh mục thuốc chỉ định:</Text>
        {PRESCRIPTION_DRUGS.map((d) => (
          <View key={d.id} style={styles.rxItemRow}>
            <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
              <Text style={styles.docName}>{d.name}</Text>
              <Text style={styles.docSub}>
                {d.dosageTag} • {d.instructionTag}
              </Text>
            </View>
            <Badge label={d.quantity} variant="blue" />
          </View>
        ))}

        <AppButton
          title="Lưu chẩn đoán & Phát hành đơn thuốc"
          variant="gradient"
          size="lg"
          leftIcon="checkmark-circle-outline"
          style={{ marginTop: 14 }}
          onPress={() => {
            if (onNavigate) {
              onNavigate('postConsultSummary');
            } else {
              Alert.alert(
                'Đã phát hành đơn thuốc!',
                'Đơn thuốc #DT-241029-01 đã được lưu và đồng bộ sang ứng dụng của bệnh nhân Nguyễn Văn Vũ.'
              );
            }
          }}
        />
      </View>
    </ScrollView>
  );

  const renderDoctorProfile = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, SHADOWS.sm]}>
        <Text style={styles.docName}>{doctor.name}</Text>
        <Text style={styles.docSub}>Email: bs.trang@smartclinic.vn</Text>
        <Text style={styles.docSub}>Chuyên khoa: {doctor.subSpecialty}</Text>
        <Text style={styles.docSub}>Đơn vị: {doctor.hospital}</Text>
      </View>

      <AppButton
        title="Đăng xuất tài khoản Bác sĩ"
        variant="danger"
        size="lg"
        leftIcon="log-out-outline"
        onPress={onLogout}
      />
    </ScrollView>
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Cổng Bác Sĩ Điều Trị"
        subtitle={`${doctor.name} • bs.trang@smartclinic.vn`}
        badgeText="BÁC SĨ"
        leftIconBox="medkit-outline"
        rightActions={[{ icon: 'log-out-outline', onPress: onLogout }]}
      />

      <View style={{ flex: 1 }}>
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'patients' && renderPatientsEHR()}
        {activeTab === 'prescribe' && renderPrescribe()}
        {activeTab === 'profile' && renderDoctorProfile()}
      </View>

      {/* Doctor Bottom Bar */}
      <View style={[styles.roleTabBar, SHADOWS.md]}>
        {[
          { key: 'schedule', label: 'Ca trực', icon: 'calendar' },
          { key: 'patients', label: 'Bệnh án EHR', icon: 'folder-open' },
          { key: 'prescribe', label: 'Kê đơn thuốc', icon: 'document-text' },
          { key: 'profile', label: 'Hồ sơ BS', icon: 'person' },
        ].map((t) => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={styles.roleTabItem}
              onPress={() => setActiveTab(t.key as DoctorTab)}
            >
              <Ionicons
                name={t.icon as any}
                size={20}
                color={active ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTabLabel,
                  active && styles.roleTabLabelActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  heroBanner: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 18,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  adminAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docHeroAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroEmail: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  heroMetricsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  heroMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroMetricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#86F2E4',
  },
  heroMetricLabel: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 18,
  },
  kpiCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiIconBlue: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiIconTeal: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.tintTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
  },
  kpiTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  barRow: {
    marginBottom: 12,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  barName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  barCount: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  barTrack: {
    height: 7,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  auditTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  auditSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  docManageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  docManageInfoCol: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  docNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  docAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  docName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  docSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  docHospitalLine: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 17,
  },
  docMeta: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  docActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  aptRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  aptCode: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  aptPatient: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  aptDoc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aptTime: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 4,
  },
  symptomBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginVertical: 10,
  },
  symptomLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  symptomText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 17,
  },
  vitalMiniBox: {
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.sm,
    padding: 8,
    alignItems: 'center',
  },
  vitalMiniLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  vitalMiniVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  rxSectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  rxItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 8,
  },
  roleTabBar: {
    height: 62,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  roleTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTabLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  roleTabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

