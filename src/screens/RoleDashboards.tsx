import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../theme';
import {
  DOCTORS,
  PATIENT_PROFILE,
  SPECIALTIES,
  formatRelativeDate,
  getRelativeDayMeta,
} from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import {
  AppHeader,
  AppButton,
  AppInput,
  Badge,
  SectionHeader,
  SegmentedControl,
  SettingToggleRow,
  ToastBanner,
  AnimatedEntry,
  PulsingDot,
  WeeklyLoadChart,
  SegmentBreakdownBar,
  SpecialtyDistributionChart,
  getAppointmentDateKey,
  formatVnd,
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
  const {
    appointments,
    cancelAppointment,
    doctors,
    addDoctor,
    approveDoctor,
    hospitals,
    addHospital,
    familyMembers,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [docFilter, setDocFilter] = useState('all');
  const [searchDoc, setSearchDoc] = useState('');
  const [autoSyncVssID, setAutoSyncVssID] = useState(true);
  const [autoGdtTax, setAutoGdtTax] = useState(true);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  // Biểu mẫu thêm bác sĩ
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDegree, setNewDocDegree] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState(SPECIALTIES[0].name);
  const [newDocHospitalId, setNewDocHospitalId] = useState(
    hospitals[0]?.id || 'hosp-0'
  );
  const [customHospName, setCustomHospName] = useState('');
  const [customHospAddress, setCustomHospAddress] = useState('');
  const [newDocFee, setNewDocFee] = useState('300000');
  const [newDocExp, setNewDocExp] = useState('5');
  const [newDocLicense, setNewDocLicense] = useState('');
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});

  // Biểu mẫu thêm bệnh viện liên kết độc lập
  const [showAddHosp, setShowAddHosp] = useState(false);
  const [hospName, setHospName] = useState('');
  const [hospAddress, setHospAddress] = useState('');
  const [hospPhone, setHospPhone] = useState('');
  const [hospGate, setHospGate] = useState('');
  const [hospErrors, setHospErrors] = useState<Record<string, string>>({});

  // Số liệu tính từ dữ liệu thật trong AppContext
  const upcomingCount = appointments.filter((a) => a.status === 'upcoming').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;
  const todayKey = getRelativeDayMeta(0).fullDate;
  const todayCount = appointments.filter(
    (a) => a.status !== 'cancelled' && getAppointmentDateKey(a) === todayKey
  ).length;
  const paidOnline = appointments.filter(
    (a) => a.status !== 'cancelled' && a.statusBadge.includes('Đã thanh toán')
  );
  const bhytHolds = appointments.filter(
    (a) => a.status !== 'cancelled' && a.statusBadge.includes('BHYT')
  );
  const otherPayments =
    appointments.filter((a) => a.status !== 'cancelled').length -
    paidOnline.length -
    bhytHolds.length;
  const onlineRevenue = paidOnline.reduce((s, a) => s + a.doctor.feeNumeric, 0);
  const verifiedDocs = doctors.filter((d) => d.verified).length;
  const pendingDocs = doctors.length - verifiedDocs;
  const activeSpecialties = new Set(
    doctors.filter((d) => d.verified).map((d) => d.specialty)
  ).size;

  const filteredAdminDoctors = doctors.filter((d) => {
    if (docFilter === 'active' && !d.verified) return false;
    if (docFilter === 'pending' && d.verified) return false;
    const q = searchDoc.trim().toLowerCase();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.bio.toLowerCase().includes(q)
    );
  });

  const resetDocForm = () => {
    setNewDocName('');
    setNewDocDegree('');
    setNewDocSpecialty(SPECIALTIES[0].name);
    setNewDocHospitalId(hospitals[0]?.id || 'hosp-0');
    setCustomHospName('');
    setCustomHospAddress('');
    setNewDocFee('300000');
    setNewDocExp('5');
    setNewDocLicense('');
    setDocErrors({});
  };

  const handleSubmitDoctor = () => {
    const errors: Record<string, string> = {};
    const fee = Number(newDocFee.replace(/[^0-9]/g, ''));
    const exp = Number(newDocExp.replace(/[^0-9]/g, ''));
    if (newDocName.trim().length < 5) {
      errors.name = 'Nhập đầy đủ học hàm và họ tên (VD: BS. Nguyễn Văn A)';
    }
    if (newDocLicense.trim().length < 4) {
      errors.license = 'Nhập mã chứng chỉ hành nghề (CCHN) do Sở Y tế cấp';
    }
    if (newDocHospitalId === 'custom' && customHospName.trim().length < 4) {
      errors.customHosp = 'Nhập tên bệnh viện / cơ sở y tế công tác';
    }
    if (!newDocFee.trim() || Number.isNaN(fee) || fee < 50000) {
      errors.fee = 'Phí khám tối thiểu 50.000 đ';
    }
    if (!newDocExp.trim() || Number.isNaN(exp) || exp > 60) {
      errors.exp = 'Số năm kinh nghiệm từ 0 đến 60';
    }
    setDocErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const hospital =
      newDocHospitalId === 'custom'
        ? addHospital({
            name: customHospName,
            address: customHospAddress || 'TP. Hồ Chí Minh',
          })
        : hospitals.find((h) => h.id === newDocHospitalId) || hospitals[0];
    const created = addDoctor({
      name: newDocName,
      degree: newDocDegree,
      specialty: newDocSpecialty,
      hospital: hospital.name,
      address: hospital.address,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      feeNumeric: fee,
      experienceYears: exp,
      licenseCode: newDocLicense,
    });
    resetDocForm();
    setShowAddDoc(false);
    setDocFilter('pending');
    setAdminToast(`Đã thêm ${created.name}. Hồ sơ đang chờ duyệt CCHN.`);
  };

  const handleSubmitHospital = () => {
    const errors: Record<string, string> = {};
    if (hospName.trim().length < 4) {
      errors.name = 'Vui lòng nhập tên bệnh viện hoặc phòng khám';
    }
    if (hospAddress.trim().length < 6) {
      errors.address = 'Vui lòng nhập địa chỉ cơ sở y tế';
    }
    setHospErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const created = addHospital({
      name: hospName,
      address: hospAddress,
      phone: hospPhone,
      gateInfo: hospGate,
    });
    setHospName('');
    setHospAddress('');
    setHospPhone('');
    setHospGate('');
    setHospErrors({});
    setShowAddHosp(false);
    setAdminToast(
      `Đã thêm cơ sở "${created.name}". Đã đồng bộ ra Trang chủ & Bản đồ!`
    );
  };

  const renderOverview = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      {/* Admin Identity Hero Banner */}
      <AnimatedEntry delay={40} direction="up">
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
              <Text style={styles.heroMetricVal}>Hoạt động</Text>
              <Text style={styles.heroMetricLabel}>Trạng thái hệ thống</Text>
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
      </AnimatedEntry>

      {/* 4 KPI Stat Cards (Calculated from real AppContext state) */}
      <AnimatedEntry delay={40} direction="up">
        <SectionHeader
          title="Số liệu vận hành thực tế"
          subtitle={`Cập nhật ngày ${formatRelativeDate(0)}`}
        />
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, SHADOWS.sm]}>
            <View style={styles.kpiTop}>
              <View style={styles.kpiIconBlue}>
                <Ionicons name="calendar" size={18} color={COLORS.primary} />
              </View>
              <Badge label={`Hôm nay: ${todayCount}`} variant="teal" />
            </View>
            <Text style={styles.kpiValue} numberOfLines={1}>
              {appointments.length}
            </Text>
            <Text style={styles.kpiTitle} numberOfLines={1}>
              Tổng lịch hẹn hệ thống
            </Text>
            <Text style={styles.kpiSub} numberOfLines={1}>
              {upcomingCount} sắp tới • {completedCount} hoàn tất
            </Text>
          </View>

          <View style={[styles.kpiCard, SHADOWS.sm]}>
            <View style={styles.kpiTop}>
              <View style={styles.kpiIconTeal}>
                <Ionicons name="cash-outline" size={18} color={COLORS.secondary} />
              </View>
              <Badge label={`${paidOnline.length} đơn online`} variant="teal" />
            </View>
            <Text style={[styles.kpiValue, { color: COLORS.secondary }]} numberOfLines={1}>
              {formatVnd(onlineRevenue)}
            </Text>
            <Text style={styles.kpiTitle} numberOfLines={1}>
              Thu viện phí trực tuyến
            </Text>
            <Text style={styles.kpiSub} numberOfLines={1}>
              {bhytHolds.length} phiếu giữ chỗ BHYT
            </Text>
          </View>

          <View style={[styles.kpiCard, SHADOWS.sm]}>
            <View style={styles.kpiTop}>
              <View style={styles.kpiIconBlue}>
                <Ionicons name="medkit-outline" size={18} color={COLORS.primary} />
              </View>
              <Badge
                label={pendingDocs > 0 ? `${pendingDocs} chờ duyệt` : '100% duyệt'}
                variant={pendingDocs > 0 ? 'warning' : 'blue'}
              />
            </View>
            <Text style={styles.kpiValue} numberOfLines={1}>
              {verifiedDocs} / {doctors.length}
            </Text>
            <Text style={styles.kpiTitle} numberOfLines={1}>
              Bác sĩ đã xác thực CCHN
            </Text>
            <Text style={styles.kpiSub} numberOfLines={1}>
              {activeSpecialties} chuyên khoa hoạt động
            </Text>
          </View>

          <View style={[styles.kpiCard, SHADOWS.sm]}>
            <View style={styles.kpiTop}>
              <View style={styles.kpiIconTeal}>
                <Ionicons name="people-outline" size={18} color={COLORS.secondary} />
              </View>
              <Badge label="Đồng bộ VssID" variant="teal" />
            </View>
            <Text style={styles.kpiValue} numberOfLines={1}>
              {1 + familyMembers.length}
            </Text>
            <Text style={styles.kpiTitle} numberOfLines={1}>
              Hồ sơ bệnh nhân EHR
            </Text>
            <Text style={styles.kpiSub} numberOfLines={1}>
              1 chủ hộ + {familyMembers.length} thành viên
            </Text>
          </View>
        </View>
      </AnimatedEntry>

      {/* Chart 1: Weekly Appointment Load (7 Days) */}
      <AnimatedEntry delay={50} direction="up">
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Biểu đồ lịch khám 7 ngày tới"
            leftIcon="stats-chart-outline"
          />
          <WeeklyLoadChart appointments={appointments} />
        </View>
      </AnimatedEntry>

      {/* Chart 2: Appointment Status & Payment Breakdown */}
      <AnimatedEntry delay={60} direction="up">
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Tỷ lệ trạng thái lịch hẹn"
            leftIcon="pie-chart-outline"
          />
          <SegmentBreakdownBar
            data={[
              {
                key: 'upcoming',
                label: 'Sắp tới (Chờ khám)',
                value: upcomingCount,
                color: COLORS.primary,
              },
              {
                key: 'completed',
                label: 'Đã hoàn tất khám',
                value: completedCount,
                color: COLORS.secondary,
              },
              {
                key: 'cancelled',
                label: 'Đã hủy lịch',
                value: cancelledCount,
                color: COLORS.error,
              },
            ]}
          />

          <View style={{ height: 1, backgroundColor: COLORS.divider, marginVertical: 14 }} />

          <Text style={[styles.docName, { marginBottom: 10 }]}>
            Cơ cấu hình thức thanh toán & BHYT
          </Text>
          <SegmentBreakdownBar
            data={[
              {
                key: 'online',
                label: 'Đã thanh toán Online (VietQR/VNPAY/MoMo)',
                value: paidOnline.length,
                color: COLORS.secondary,
              },
              {
                key: 'bhyt',
                label: 'Giữ chỗ đối chiếu BHYT tại viện',
                value: bhytHolds.length,
                color: COLORS.warning,
              },
              {
                key: 'confirmed',
                label: 'Lịch hẹn tiêu chuẩn đã xác nhận',
                value: Math.max(0, otherPayments),
                color: COLORS.primary,
              },
            ]}
          />
        </View>
      </AnimatedEntry>

      {/* Chart 3: Specialty Load Distribution (Dynamic from appointments) */}
      <AnimatedEntry delay={60} direction="up">
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Phân bổ lịch khám theo chuyên khoa"
            leftIcon="bar-chart-outline"
          />
          <SpecialtyDistributionChart appointments={appointments} />
        </View>
      </AnimatedEntry>
    </ScrollView>
  );

  const renderDoctorsManagement = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
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
          { key: 'all', label: `Tất cả (${doctors.length})` },
          { key: 'active', label: `Đang trực (${verifiedDocs})` },
          { key: 'pending', label: `Chờ duyệt CCHN (${pendingDocs})` },
        ]}
        style={{ marginBottom: 14 }}
      />

      <AppButton
        title={
          showAddDoc
            ? 'Đóng biểu mẫu thêm bác sĩ'
            : '+ Thêm bác sĩ mới vào hệ thống'
        }
        variant={showAddDoc ? 'outline' : 'primary'}
        size="md"
        leftIcon={showAddDoc ? 'close-outline' : 'person-add-outline'}
        onPress={() => setShowAddDoc((prev) => !prev)}
        style={{ marginBottom: 14 }}
      />

      {showAddDoc && (
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Cấp hồ sơ Bác sĩ & Chứng chỉ hành nghề"
            leftIcon="medkit-outline"
          />
          <AppInput
            label="HỌ TÊN & HỌC HÀM / HỌC VỊ (*)"
            placeholder="VD: ThS. BS. Phạm Quốc Bảo"
            value={newDocName}
            onChangeText={(v) => {
              setNewDocName(v);
              if (docErrors.name) setDocErrors((p) => ({ ...p, name: '' }));
            }}
            error={docErrors.name}
            leftIcon="person-outline"
          />
          <AppInput
            label="CHỨC DANH / CHUYÊN MÔN SÂU"
            placeholder="VD: Chuyên gia Nội Cơ Xương Khớp"
            value={newDocDegree}
            onChangeText={setNewDocDegree}
            leftIcon="ribbon-outline"
          />
          <AppInput
            label="MÃ CHỨNG CHỈ HÀNH NGHỀ (CCHN) (*)"
            placeholder="VD: 048291/HCM-CCHN"
            value={newDocLicense}
            onChangeText={(v) => {
              setNewDocLicense(v);
              if (docErrors.license) setDocErrors((p) => ({ ...p, license: '' }));
            }}
            error={docErrors.license}
            leftIcon="shield-checkmark-outline"
          />

          <Text style={[styles.docSub, { fontWeight: '700', marginBottom: 6 }]}>
            CHỌN CHUYÊN KHOA (*)
          </Text>
          <SegmentedControl
            variant="chips"
            selectedKey={newDocSpecialty}
            onSelect={setNewDocSpecialty}
            options={SPECIALTIES.map((s) => ({ key: s.name, label: s.name }))}
            style={{ marginBottom: 12 }}
          />

          <Text style={[styles.docSub, { fontWeight: '700', marginBottom: 6 }]}>
            BỆNH VIỆN CÔNG TÁC (*)
          </Text>
          <SegmentedControl
            variant="chips"
            selectedKey={newDocHospitalId}
            onSelect={setNewDocHospitalId}
            options={[
              ...hospitals.map((h) => ({ key: h.id, label: h.name })),
              { key: 'custom', label: '+ Nhập bệnh viện mới' },
            ]}
            style={{ marginBottom: 12 }}
          />

          {newDocHospitalId === 'custom' && (
            <>
              <AppInput
                label="TÊN BỆNH VIỆN / CƠ SỞ Y TẾ MỚI (*)"
                placeholder="VD: Bệnh viện Nhân Dân 115"
                value={customHospName}
                onChangeText={(v) => {
                  setCustomHospName(v);
                  if (docErrors.customHosp)
                    setDocErrors((p) => ({ ...p, customHosp: '' }));
                }}
                error={docErrors.customHosp}
                leftIcon="business-outline"
              />
              <AppInput
                label="ĐỊA CHỈ CƠ SỞ Y TẾ"
                placeholder="VD: 527 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM"
                value={customHospAddress}
                onChangeText={setCustomHospAddress}
                leftIcon="location-outline"
              />
            </>
          )}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <AppInput
                label="PHÍ TƯ VẤN (VNĐ) (*)"
                placeholder="300000"
                keyboardType="numeric"
                value={newDocFee}
                onChangeText={setNewDocFee}
                error={docErrors.fee}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput
                label="SỐ NĂM KINH NGHIỆM (*)"
                placeholder="8"
                keyboardType="numeric"
                value={newDocExp}
                onChangeText={setNewDocExp}
                error={docErrors.exp}
              />
            </View>
          </View>

          <AppButton
            title="Lưu hồ sơ Bác sĩ vào hệ thống"
            variant="primary"
            size="md"
            leftIcon="checkmark-circle-outline"
            onPress={handleSubmitDoctor}
          />
        </View>
      )}

      {filteredAdminDoctors.map((doc) => (
        <View key={doc.id} style={[styles.card, SHADOWS.sm]}>
          <View style={styles.docManageRow}>
            <Image source={{ uri: doc.avatar }} style={styles.docAvatar} />
            <View style={styles.docManageInfoCol}>
              <View style={styles.docNameBadgeRow}>
                <Text
                  style={[styles.docName, { flexShrink: 1 }]}
                  numberOfLines={2}
                >
                  {doc.name}
                </Text>
                <Badge
                  label={doc.verified ? 'Đã xác thực' : 'Chờ duyệt CCHN'}
                  variant={doc.verified ? 'teal' : 'warning'}
                  icon={doc.verified ? 'checkmark-circle' : 'time-outline'}
                />
              </View>
              <Text style={styles.docSub} numberOfLines={1}>
                {doc.degree} • Khoa {doc.specialty}
              </Text>
              <Text style={styles.docHospitalLine} numberOfLines={1}>
                {doc.hospital}
              </Text>
              <Text style={styles.docMeta} numberOfLines={1}>
                Phí khám: {doc.fee} • {doc.experienceYears} năm KN • ★{' '}
                {doc.rating || 'Mới'} ({doc.reviewCount} lượt)
              </Text>
            </View>
          </View>

          <View style={styles.docActionRow}>
            {!doc.verified ? (
              <AppButton
                title="Duyệt CCHN & Mở lịch khám"
                variant="primary"
                size="sm"
                leftIcon="shield-checkmark-outline"
                fullWidth={false}
                style={{ flex: 1 }}
                onPress={() => {
                  approveDoctor(doc.id);
                  setDocFilter('all');
                  setAdminToast(
                    `Đã duyệt CCHN cho ${doc.name}. Bác sĩ đã hiển thị trên Trang chủ Bệnh nhân!`
                  );
                }}
              />
            ) : (
              <>
                <AppButton
                  title="Phân lịch trực"
                  variant="tonal"
                  size="sm"
                  leftIcon="calendar-outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() =>
                    Alert.alert(
                      'Lịch trực',
                      `Đã mở bảng phân ca trực cho ${doc.name}`
                    )
                  }
                />
                <AppButton
                  title="Cấu hình BHYT"
                  variant="outline"
                  size="sm"
                  leftIcon="create-outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() =>
                    Alert.alert(
                      'Cấu hình',
                      `Chỉnh sửa thông tin BHYT cho ${doc.name}`
                    )
                  }
                />
              </>
            )}
          </View>
        </View>
      ))}

      {/* Linked Hospitals Management Section */}
      <SectionHeader
        title={`Cơ sở y tế & Bệnh viện liên kết (${hospitals.length})`}
        actionText={showAddHosp ? 'Đóng' : '+ Thêm bệnh viện'}
        onActionPress={() => setShowAddHosp((prev) => !prev)}
      />

      {showAddHosp && (
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={[styles.docName, { marginBottom: 10 }]}>
            Thêm Bệnh viện / Phòng khám liên kết mới
          </Text>
          <AppInput
            label="TÊN BỆNH VIỆN / PHÒNG KHÁM (*)"
            placeholder="VD: Bệnh viện Đại học Y Dược - Cơ sở 2"
            value={hospName}
            onChangeText={(v) => {
              setHospName(v);
              if (hospErrors.name) setHospErrors((p) => ({ ...p, name: '' }));
            }}
            error={hospErrors.name}
            leftIcon="business-outline"
          />
          <AppInput
            label="ĐỊA CHỈ (*)"
            placeholder="VD: 201 Nguyễn Chí Thanh, Phường 12, Quận 5, TP.HCM"
            value={hospAddress}
            onChangeText={(v) => {
              setHospAddress(v);
              if (hospErrors.address)
                setHospErrors((p) => ({ ...p, address: '' }));
            }}
            error={hospErrors.address}
            leftIcon="location-outline"
          />
          <AppInput
            label="HOTLINE TỔNG ĐÀI"
            placeholder="VD: 02838555678"
            keyboardType="phone-pad"
            value={hospPhone}
            onChangeText={setHospPhone}
            leftIcon="call-outline"
          />
          <AppInput
            label="HƯỚNG DẪN CỔNG VÀO & GỬI XE"
            placeholder="VD: Cổng số 1 — Khu tiếp đón Khám BHYT"
            value={hospGate}
            onChangeText={setHospGate}
            leftIcon="navigate-outline"
          />
          <AppButton
            title="Lưu cơ sở y tế vào hệ thống"
            variant="primary"
            size="md"
            leftIcon="checkmark-circle-outline"
            onPress={handleSubmitHospital}
          />
        </View>
      )}

      {hospitals.map((h) => (
        <View key={h.id} style={[styles.card, SHADOWS.sm]}>
          <View style={styles.aptRowTop}>
            <Text style={[styles.docName, { flex: 1 }]} numberOfLines={1}>
              {h.name}
            </Text>
            <Badge label={h.tag} variant="teal" />
          </View>
          <Text style={styles.docSub}>{h.address}</Text>
          <Text style={styles.docMeta}>
            Cổng vào: {h.gateInfo} • Hotline: {h.phone}
          </Text>
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
        title={`Điều phối lịch hẹn toàn viện (${appointments.length})`}
        subtitle="Đồng bộ thời gian thực từ ứng dụng Bệnh nhân"
      />
      {appointments.map((apt) => {
        const badgeVariant =
          apt.status === 'cancelled'
            ? ('danger' as const)
            : apt.status === 'completed'
            ? ('teal' as const)
            : ('blue' as const);
        return (
          <View key={apt.id} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.aptRowTop}>
              <Text style={styles.aptCode}>{apt.code}</Text>
              <Badge label={apt.statusBadge} variant={badgeVariant} showDot />
            </View>
            <Text style={styles.aptPatient}>
              Bệnh nhân: Nguyễn Văn Vũ (32T • Nam)
            </Text>
            <Text style={styles.aptDoc}>
              Bác sĩ phụ trách: {apt.doctor.name} ({apt.doctor.hospital})
            </Text>
            <Text style={styles.aptTime}>
              Khung giờ: {apt.timeRange} • {apt.room || 'Tư vấn trực tuyến'}
            </Text>
            {apt.status === 'upcoming' && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <AppButton
                  title="Hủy lịch hẹn"
                  variant="outline"
                  size="sm"
                  leftIcon="close-circle-outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => cancelAppointment(apt.id)}
                />
              </View>
            )}
          </View>
        );
      })}
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
          title="Đồng bộ BHYT VssID"
          description="Tự động kiểm tra thẻ BHYT và mức hưởng 80-100% khi bệnh nhân đặt lịch."
          value={autoSyncVssID}
          onValueChange={setAutoSyncVssID}
        />
        <SettingToggleRow
          icon="notifications-outline"
          iconColor={COLORS.secondary}
          title="Nhắc lịch khám tự động"
          description="Gửi thông báo nhắc nhở trước 24h và 2h cho bệnh nhân và bác sĩ trực."
          value={autoGdtTax}
          onValueChange={setAutoGdtTax}
        />
      </View>

      <AppButton
        title="Đăng xuất Admin"
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
        subtitle="admin@smartclinic.vn"
        badgeText="ADMIN"
        leftIconBox="shield-checkmark-outline"
        rightActions={[
          { icon: 'log-out-outline', label: 'Đăng xuất Admin', onPress: onLogout },
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
              accessibilityRole="tab"
              accessibilityLabel={t.label}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={t.icon as any}
                size={20}
                color={active ? COLORS.primary : COLORS.textSecondary}
                importantForAccessibility="no"
              />
              <Text
                style={[
                  styles.roleTabLabel,
                  active && styles.roleTabLabelActive,
                ]}
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ToastBanner
        visible={!!adminToast}
        title="Quản trị hệ thống"
        message={adminToast || ''}
        onDismiss={() => setAdminToast(null)}
      />
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
  const {
    appointments,
    completeAppointment,
    prescriptions,
    addPrescriptionDrug,
    diagnosisNote,
    setDiagnosisNote,
  } = useAppContext();
  const doctor = DOCTORS[0]; // TS. BS. Lê Thu Trang
  const [activeTab, setActiveTab] = useState<DoctorTab>('schedule');
  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugQty, setNewDrugQty] = useState('14 viên');
  const [newDrugDosage, setNewDrugDosage] = useState('1 viên/lần • Sáng, Tối');
  const [showAddDrugForm, setShowAddDrugForm] = useState(false);
  const [queueStatuses, setQueueStatuses] = useState<Record<string, string>>({
    '1': 'Đã check-in QR • Đang chờ',
    '2': 'Chờ tới lượt',
    '3': 'Chat trực tuyến (14:00)',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const upcomingPatientApts = appointments.filter((a) => a.status === 'upcoming');
  const completedPatientApts = appointments.filter((a) => a.status === 'completed');

  const renderSchedule = () => (
    <ScrollView
      contentContainerStyle={styles.scrollPad}
      showsVerticalScrollIndicator={false}
    >
      {/* Doctor Identity Card */}
      <AnimatedEntry delay={40} direction="up">
        <LinearGradient
          colors={GRADIENTS.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroBanner, SHADOWS.md]}
        >
          <View style={styles.heroUserRow}>
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: doctor.avatar }} style={styles.docHeroAvatar} />
              <View style={{ position: 'absolute', bottom: -2, right: -2 }}>
                <PulsingDot color="#86F2E4" size={7} />
              </View>
            </View>
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
              <Text style={styles.heroMetricVal}>
                {15 + appointments.length} ca
              </Text>
              <Text style={styles.heroMetricLabel}>Tổng lịch hôm nay</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>
                {11 + completedPatientApts.length} ca
              </Text>
              <Text style={styles.heroMetricLabel}>Đã hoàn tất</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetricItem}>
              <Text style={styles.heroMetricVal}>
                0{4 + upcomingPatientApts.length} ca
              </Text>
              <Text style={styles.heroMetricLabel}>Đang chờ khám</Text>
            </View>
          </View>
        </LinearGradient>
      </AnimatedEntry>

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
      ].map((pt, idx) => (
        <AnimatedEntry key={pt.id} delay={100 + idx * 70} direction="up">
          <View style={[styles.card, SHADOWS.sm]}>
            <View style={styles.aptRowTop}>
              <Badge label={`${pt.stt} • ${pt.time}`} variant="blue" />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {pt.id === '1' && <PulsingDot color={COLORS.secondary} size={6} />}
                <Badge label={queueStatuses[pt.id]} variant="teal" showDot />
              </View>
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
                  setToastMessage(`Đã phát loa gọi ${pt.stt} - ${pt.name} vào Phòng 302.`);
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
        </AnimatedEntry>
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
          actionText="Xem chi tiết"
          onActionPress={() => onNavigate?.('labImagingResults')}
        />
        <Text style={styles.docName}>Chụp MRI Sọ não (Không cản từ)</Text>
        <Text style={[styles.docSub, { marginTop: 4 }]}>
          Nhu mô não không thấy tổn thương khu trú, hệ thống não thất cân đối, không có dấu hiệu nhồi máu não hay xuất huyết.
        </Text>
        <AppButton
          title="Xem kết quả CĐHA & Xét nghiệm"
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollPad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader
          title="Kê đơn thuốc điện tử"
          subtitle="BN: Nguyễn Văn Vũ (#BN-882910) • Toa #DT-241029-01"
        />

        <View style={[styles.card, SHADOWS.sm]}>
          <AppInput
            label="Chẩn đoán lâm sàng (ICD-10: G44.2)"
            leftIcon="medkit-outline"
            value={diagnosisNote}
            onChangeText={setDiagnosisNote}
          />

          <Text style={styles.rxSectionLabel}>
            Danh mục thuốc chỉ định ({prescriptions.length} loại):
          </Text>
          {prescriptions.map((d) => (
            <View key={d.id} style={styles.rxItemRow}>
              <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                <Text style={styles.docName} numberOfLines={1}>
                  {d.name}
                </Text>
                <Text style={styles.docSub} numberOfLines={1}>
                  {d.dosageTag} • {d.instructionTag}
                </Text>
              </View>
              <Badge label={d.quantity} variant="blue" />
            </View>
          ))}

          {/* Interactive Add New Drug to Prescription */}
          {showAddDrugForm ? (
            <View
              style={{
                marginTop: 12,
                padding: 12,
                backgroundColor: COLORS.surfaceContainerLow,
                borderRadius: RADIUS.md,
              }}
            >
              <Text style={[styles.docName, { marginBottom: 8 }]}>
                + Thêm thuốc mới vào đơn của BN. Nguyễn Văn Vũ
              </Text>
              <AppInput
                label="Tên thuốc & Hàm lượng *"
                placeholder="VD: Magnesium B6 470mg"
                value={newDrugName}
                onChangeText={setNewDrugName}
              />
              <AppInput
                label="Số lượng cấp"
                placeholder="VD: 14 viên"
                value={newDrugQty}
                onChangeText={setNewDrugQty}
              />
              <AppInput
                label="Liều dùng & Hướng dẫn"
                placeholder="VD: 1 viên/lần • Sau ăn sáng, tối"
                value={newDrugDosage}
                onChangeText={setNewDrugDosage}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <AppButton
                  title="Hủy"
                  variant="outline"
                  size="sm"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => setShowAddDrugForm(false)}
                />
                <AppButton
                  title="Thêm vào đơn"
                  variant="primary"
                  size="sm"
                  leftIcon="add-circle-outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() => {
                    if (!newDrugName.trim()) return;
                    addPrescriptionDrug({
                      name: newDrugName.trim(),
                      indication: 'Chỉ định bổ sung từ Bác sĩ điều trị',
                      quantity: newDrugQty.trim() || '14 viên',
                      dosageTag: newDrugDosage.trim() || '1 viên/lần',
                      instructionTag: 'Uống sau ăn theo chỉ dẫn BS',
                    });
                    setNewDrugName('');
                    setShowAddDrugForm(false);
                    setToastMessage(
                      `Đã thêm "${newDrugName.trim()}" vào đơn thuốc điện tử của BN. Nguyễn Văn Vũ.`
                    );
                  }}
                />
              </View>
            </View>
          ) : (
            <AppButton
              title="+ Thêm thuốc vào đơn"
              variant="tonal"
              size="sm"
              leftIcon="add-circle-outline"
              onPress={() => setShowAddDrugForm(true)}
              style={{ marginTop: 10 }}
            />
          )}

          <AppButton
            title="Lưu & Phát hành đơn thuốc"
            variant="gradient"
            size="lg"
            leftIcon="checkmark-circle-outline"
            style={{ marginTop: 14 }}
            onPress={() => {
              if (upcomingPatientApts.length > 0) {
                completeAppointment(upcomingPatientApts[0].id);
              }
              setToastMessage(
                'Đã phát hành đơn thuốc #DT-241029-01 và đồng bộ tức thì sang Hồ sơ Bệnh án của bệnh nhân!'
              );
              if (onNavigate) {
                setTimeout(() => onNavigate('postConsultSummary'), 600);
              }
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
        title="Đăng xuất tài khoản"
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
        title="Cổng Bác Sĩ"
        subtitle={doctor.name}
        badgeText="BÁC SĨ"
        leftIconBox="medkit-outline"
        rightActions={[
          { icon: 'log-out-outline', label: 'Đăng xuất Bác sĩ', onPress: onLogout },
        ]}
      />

      <ToastBanner
        visible={!!toastMessage}
        title="Thông Báo"
        message={toastMessage ?? ''}
        onDismiss={() => setToastMessage(null)}
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
              accessibilityRole="tab"
              accessibilityLabel={t.label}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={t.icon as any}
                size={20}
                color={active ? COLORS.primary : COLORS.textSecondary}
                importantForAccessibility="no"
              />
              <Text
                style={[
                  styles.roleTabLabel,
                  active && styles.roleTabLabelActive,
                ]}
                numberOfLines={1}
                maxFontSizeMultiplier={1.2}
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
    padding: SPACING.md,
    paddingBottom: 28,
  },
  heroBanner: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
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
    borderColor: COLORS.textOnPrimary,
    backgroundColor: COLORS.surfaceContainer,
  },
  heroName: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
  },
  heroEmail: {
    fontSize: TYPOGRAPHY.size.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  heroMetricsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.xs,
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
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: '800',
    color: '#86F2E4',
  },
  heroMetricLabel: {
    fontSize: TYPOGRAPHY.size.xxs,
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
    borderColor: COLORS.borderSubtle,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
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
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  kpiTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  kpiSub: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    ...LAYOUT.card,
  },
  barRow: {
    marginBottom: SPACING.sm,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  barName: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.xs,
  },
  barCount: {
    fontSize: TYPOGRAPHY.size.xs,
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
    padding: SPACING.sm,
  },
  auditTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  auditSub: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  docManageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  docManageInfoCol: {
    flex: 1,
    minWidth: 0,
    marginLeft: SPACING.sm,
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
    backgroundColor: COLORS.surfaceContainer,
  },
  docName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  docSub: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  docHospitalLine: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 17,
  },
  docMeta: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.xxs,
  },
  docActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aptRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  aptCode: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  aptPatient: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  aptDoc: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aptTime: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: SPACING.xxs,
  },
  symptomBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginVertical: 10,
  },
  symptomLabel: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  symptomText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textPrimary,
    marginTop: 2,
    lineHeight: 17,
  },
  vitalMiniBox: {
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    alignItems: 'center',
  },
  vitalMiniLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  vitalMiniVal: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  rxSectionLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  rxItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: SPACING.xs,
  },
  roleTabBar: {
    height: 62,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  roleTabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

