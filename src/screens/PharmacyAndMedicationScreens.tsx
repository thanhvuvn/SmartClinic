import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from '../theme';
import { PRESCRIPTION_DRUGS } from '../data/mockData';
import {
  AppHeader,
  AppButton,
  Badge,
  SectionHeader,
} from '../components';

// ============================================================================
// SCREEN 8: NHẬT KÝ & NHẮC UỐNG THUỐC
// ============================================================================
export const MedicationLogScreen: React.FC<{
  onBack?: () => void;
  onOpenPrescription?: () => void;
  onOpenCabinet?: () => void;
}> = ({ onBack, onOpenPrescription, onOpenCabinet }) => {
  const [takenMap, setTakenMap] = useState<Record<string, boolean>>({
    morning: true,
    afternoon: true,
    evening: false,
  });

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Nhật Ký & Nhắc Uống Thuốc"
        subtitle="Nguyễn Văn Vũ (#BN-7824) • Phác đồ Đau nửa đầu vận mạch"
        badgeText="94% tuân thủ"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Weekly Adherence Strip (Habit Tracker) */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { flex: 1 }]} numberOfLines={1}>
              Tuần 44 • Tháng 10/2024
            </Text>
            <Badge label="2/3 cữ hôm nay" variant="teal" />
          </View>
          <View style={styles.weekRow}>
            {[
              { d: 'T2', n: '28', done: true },
              { d: 'T3', n: '29', active: true },
              { d: 'T4', n: '30', done: false },
              { d: 'T5', n: '31', done: false },
              { d: 'T6', n: '01', done: false },
              { d: 'T7', n: '02', done: false },
              { d: 'CN', n: '03', done: false },
            ].map((day) => (
              <View
                key={day.d}
                style={[
                  styles.dayPill,
                  day.active && styles.dayPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    day.active && { color: '#FFFFFF' },
                  ]}
                  numberOfLines={1}
                >
                  {day.d}
                </Text>
                <Text
                  style={[
                    styles.dayPillNum,
                    day.active && { color: '#FFFFFF' },
                  ]}
                  numberOfLines={1}
                >
                  {day.n}
                </Text>
                <Ionicons
                  name={day.done ? 'checkmark-circle' : 'ellipse'}
                  size={12}
                  color={
                    day.active
                      ? '#86F2E4'
                      : day.done
                      ? COLORS.secondary
                      : '#CBD5E1'
                  }
                />
              </View>
            ))}
          </View>
        </View>

        {/* AI Medication Adherence Insight Card */}
        <LinearGradient
          colors={GRADIENTS.primaryTeal}
          style={[styles.heroCard, SHADOWS.sm]}
        >
          <View style={styles.rowBetween}>
            <Badge label="Trợ lý AI SmartClinic" variant="glass" icon="sparkles" />
            <Text style={styles.whiteSub} numberOfLines={1}>
              Toa: TS. BS. Lê Thu Trang
            </Text>
          </View>
          <Text style={styles.whiteBody}>
            Bạn đã duy trì uống đúng giờ 6 ngày liên tiếp! Cữ tối nay (21:00 -
            Flunarizine 5mg) giúp dự phòng cơn đau nửa đầu khi ngủ.
          </Text>
        </LinearGradient>

        {/* Today's Pill Schedule */}
        <SectionHeader
          title="Lịch uống thuốc hôm nay"
          actionText="Xem chi tiết toa"
          onActionPress={onOpenPrescription}
        />
        {[
          {
            key: 'morning',
            time: '08:00 • Cữ Sáng (Sau ăn)',
            drug: 'Ginkgo Biloba 80mg (1 viên)',
            desc: 'Tăng cường tuần hoàn máu não',
          },
          {
            key: 'afternoon',
            time: '14:00 • Cữ Chiều (Sau ăn)',
            drug: 'Ginkgo Biloba 80mg (1 viên)',
            desc: 'Uống với 200ml nước ấm',
          },
          {
            key: 'evening',
            time: '21:00 • Cữ Tối (Trước khi ngủ)',
            drug: 'Flunarizine 5mg (1 viên)',
            desc: 'Ngăn ngừa đau nửa đầu & co thắt mạch',
          },
        ].map((slot) => {
          const isTaken = takenMap[slot.key];
          return (
            <View key={slot.key} style={[styles.card, SHADOWS.sm]}>
              <View style={styles.rowBetween}>
                <Text style={[styles.slotTime, { flex: 1 }]} numberOfLines={1}>
                  {slot.time}
                </Text>
                <Badge
                  label={isTaken ? 'Đã uống ✓' : 'Sắp tới (21:00)'}
                  variant={isTaken ? 'teal' : 'warning'}
                />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {slot.drug}
              </Text>
              <Text style={styles.subText} numberOfLines={1}>
                {slot.desc}
              </Text>
              <AppButton
                title={isTaken ? 'Đã ghi nhận uống thuốc' : 'Xác nhận đã uống cữ này'}
                variant={isTaken ? 'tonal' : 'primary'}
                size="sm"
                leftIcon={isTaken ? 'checkmark-done' : 'checkmark-circle-outline'}
                onPress={() =>
                  setTakenMap((p) => ({ ...p, [slot.key]: !p[slot.key] }))
                }
                style={{ marginTop: 10 }}
              />
            </View>
          );
        })}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <AppButton
            title="Tủ thuốc"
            variant="tonal"
            size="md"
            leftIcon="medkit-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={onOpenCabinet}
          />
          <AppButton
            title="Cài chuông nhắc"
            variant="outline"
            size="md"
            leftIcon="notifications-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={() =>
              Alert.alert(
                'Đã bật thông báo nhắc thuốc',
                'Ứng dụng sẽ gửi thông báo nhắc uống thuốc lúc 08:00, 14:00 và 21:00 hàng ngày.'
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 13: CHI TIẾT TOA THUỐC ĐIỆN TỬ
// ============================================================================
export const PrescriptionDetailScreen: React.FC<{
  onBack?: () => void;
  onOpenMedLog?: () => void;
}> = ({ onBack, onOpenMedLog }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chi Tiết Toa Thuốc Điện Tử"
        subtitle="#DT-241029-01 • BV ĐHYD TP.HCM"
        badgeText="Hợp lệ"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Header Summary */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Badge label="Đang điều trị tích cực" variant="teal" showDot />
            <Text style={styles.slotTime}>Ngày 2 / 7 (28%)</Text>
          </View>
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            TS. BS. Lê Thu Trang
          </Text>
          <Text style={styles.subText}>
            Trưởng khoa Thần kinh • Bệnh nhân: Nguyễn Văn Vũ
          </Text>
          <Text style={styles.subText}>
            CĐ: Đau đầu căng thẳng / Rối loạn vận mạch nhẹ
          </Text>
          <Text style={styles.subText}>
            Ngày kê: 29/10/2024 • Tái khám: 05/11/2024
          </Text>
        </View>

        {/* AI Safety Audit & Dietary Advice */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Kiểm Tra Tương Tác Thuốc</Text>
            <Badge label="An toàn" variant="teal" icon="shield-checkmark" />
          </View>
          <Text style={styles.subText}>
            Không phát hiện tương khắc giữa 3 loại thuốc. Tương thích hoàn toàn
            với tiền sử dị ứng Penicillin của bạn.
          </Text>
          <View style={styles.noteCallout}>
            <Ionicons name="nutrition-outline" size={16} color={COLORS.primary} />
            <Text style={styles.noteCalloutText}>
              Kiêng cữ từ BS. Trang: Hạn chế hoàn toàn cà phê, trà đậm, bia rượu
              trong đợt dùng Flunarizine. Uống đủ 2.0L nước ấm/ngày.
            </Text>
          </View>
        </View>

        <SectionHeader
          title="Danh Mục Thuốc Kê Đơn"
          subtitle="3 loại thuốc trong phác đồ điều trị"
        />
        {PRESCRIPTION_DRUGS.map((d) => (
          <View key={d.id} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.cardTitle, { flex: 1 }]} numberOfLines={1}>
                {d.name}
              </Text>
              <Badge label={d.quantity} variant="blue" />
            </View>
            <Text style={styles.subText} numberOfLines={1}>
              {d.indication}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              <Badge label={d.dosageTag} variant={d.isWarning ? 'danger' : 'teal'} />
              <Badge label={d.instructionTag} variant="surface" />
            </View>
          </View>
        ))}

        <AppButton
          title="Mở Lịch Nhắc Uống Thuốc Hàng Ngày"
          variant="primary"
          size="lg"
          leftIcon="alarm-outline"
          onPress={onOpenMedLog || onBack}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 27: TỦ THUỐC GIA ĐÌNH & THEO DÕI SỐ LƯỢNG THUỐC
// ============================================================================
export const FamilyMedicineCabinetScreen: React.FC<{
  onBack?: () => void;
  onRefillNow?: () => void;
}> = ({ onBack, onRefillNow }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tủ Thuốc Gia Đình"
        subtitle="Quản lý số lượng thuốc tại nhà & cảnh báo sắp hết"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Refill Alert Banner */}
        <View style={[styles.alertCard, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Badge
              label="CẢNH BÁO SẮP HẾT THUỐC"
              variant="danger"
              icon="alert-circle"
            />
            <Text style={[styles.slotTime, { color: COLORS.error }]}>
              Còn dùng được 3 ngày
            </Text>
          </View>
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Sibelium 5mg (Flunarizine) chỉ còn 4 viên
          </Text>
          <Text style={styles.subText}>
            Đủ dùng đến 31/10/2024. Bạn nên đặt lịch tái khám hoặc hỏi ý kiến
            TS. BS. Lê Thu Trang trước khi mua thêm.
          </Text>
          <AppButton
            title="Nhắn tin hỏi Bác sĩ / Đặt tái khám"
            variant="primary"
            size="md"
            leftIcon="chatbubbles-outline"
            onPress={onRefillNow}
            style={{ marginTop: 10 }}
          />
        </View>

        <SectionHeader
          title="Thuốc đang lưu trữ trong gia đình"
          subtitle="Nguyễn Văn Vũ • Bé Bảo Nam • Bà Nguyễn Thị Mai"
        />
        {[
          {
            name: 'Sibelium 5mg (Flunarizine)',
            owner: 'Nguyễn Văn Vũ (Bản thân)',
            stock: 'Còn 4 / 30 viên',
            exp: 'HSD: 12/2026',
            urgent: true,
          },
          {
            name: 'Ginkgo Biloba 80mg',
            owner: 'Nguyễn Văn Vũ (Bản thân)',
            stock: 'Còn 18 / 30 viên',
            exp: 'HSD: 08/2026',
            urgent: false,
          },
          {
            name: 'Amlodipine 5mg (Thuốc Huyết áp)',
            owner: 'Bà Nguyễn Thị Mai (Mẹ • 62T)',
            stock: 'Còn 22 / 30 viên',
            exp: 'HSD: 05/2027',
            urgent: false,
          },
        ].map((med) => (
          <View key={med.name} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.cardTitle, { flex: 1 }]} numberOfLines={1}>
                {med.name}
              </Text>
              <Badge
                label={med.stock}
                variant={med.urgent ? 'danger' : 'teal'}
              />
            </View>
            <Text style={styles.subText} numberOfLines={1}>
              Người dùng: {med.owner} • {med.exp}
            </Text>
          </View>
        ))}
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
  alertCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.errorContainer,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  slotTime: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 12,
  },
  dayPill: {
    flex: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainerLow,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 3,
  },
  dayPillActive: {
    backgroundColor: COLORS.primary,
  },
  dayPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayPillNum: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  heroCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
  },
  whiteSub: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.85)',
  },
  whiteBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#FFFFFF',
    marginTop: 8,
  },
  noteCallout: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
    marginTop: 10,
    gap: 8,
  },
  noteCalloutText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textPrimary,
  },
});
