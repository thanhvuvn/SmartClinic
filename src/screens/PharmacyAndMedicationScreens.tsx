import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
  SegmentedControl,
  StickyBottomBar,
} from '../components';

// ============================================================================
// SCREEN 8: [1:1817] NHẬT KÝ & THÔNG BÁO UỐNG THUỐC
// ============================================================================
export const MedicationLogScreen: React.FC<{
  onBack?: () => void;
  onOpenPrescription?: () => void;
  onOpenCabinet?: () => void;
  onOpenLockAlert?: () => void;
}> = ({ onBack, onOpenPrescription, onOpenCabinet, onOpenLockAlert }) => {
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
            <Text style={styles.cardTitle}>Tuần 44 • Tháng 10/2024</Text>
            <Badge label="Tiến độ hôm nay: 2/3 cữ" variant="teal" />
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
                >
                  {day.d}
                </Text>
                <Text
                  style={[
                    styles.dayPillNum,
                    day.active && { color: '#FFFFFF' },
                  ]}
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
            <Text style={styles.whiteSub}>Toa: TS. BS. Lê Thu Trang</Text>
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
                <Text style={styles.slotTime}>{slot.time}</Text>
                <Badge
                  label={isTaken ? 'Đã uống ✓' : 'Sắp tới (21:00)'}
                  variant={isTaken ? 'teal' : 'warning'}
                />
              </View>
              <Text style={styles.cardTitle}>{slot.drug}</Text>
              <Text style={styles.subText}>{slot.desc}</Text>
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
            title="Tủ thuốc gia đình"
            variant="tonal"
            size="md"
            leftIcon="medkit-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={onOpenCabinet}
          />
          <AppButton
            title="Chuông nhắc thuốc"
            variant="outline"
            size="md"
            leftIcon="notifications-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={onOpenLockAlert}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 13: [1:3212] CHI TIẾT TOA THUỐC & LỊCH NHẮC UỐNG THUỐC
// ============================================================================
export const PrescriptionDetailScreen: React.FC<{
  onBack?: () => void;
  onOrderDelivery?: () => void;
}> = ({ onBack, onOrderDelivery }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chi Tiết Toa Thuốc Điện Tử"
        subtitle="#DT-241029-01 • Ký số: BV ĐHYD TP.HCM"
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
            <Text style={styles.cardTitle}>AI SmartAudit™ Tương Tác Thuốc</Text>
            <Badge label="An toàn tuyệt đối" variant="teal" icon="shield-checkmark" />
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
          subtitle="3 loại dược phẩm đạt chuẩn GPP"
        />
        {PRESCRIPTION_DRUGS.map((d) => (
          <View key={d.id} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{d.name}</Text>
              <Badge label={d.quantity} variant="blue" />
            </View>
            <Text style={styles.subText}>{d.indication}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Badge label={d.dosageTag} variant={d.isWarning ? 'danger' : 'teal'} />
              <Badge label={d.instructionTag} variant="surface" />
            </View>
          </View>
        ))}

        <AppButton
          title="Đặt giao thuốc tận nhà (Cold Chain GPP)"
          variant="gradient"
          size="lg"
          leftIcon="bicycle-outline"
          onPress={onOrderDelivery}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 24: [1:6927] THÔNG BÁO NHẮC UỐNG THUỐC LIỀU ĐẦU TIÊN
// ============================================================================
export const FirstDoseLockscreenAlertScreen: React.FC<{
  onConfirmTaken?: () => void;
  onBack?: () => void;
}> = ({ onConfirmTaken, onBack }) => {
  return (
    <LinearGradient
      colors={['#0F172A', '#1E3A5F', '#004B73']}
      style={styles.lockScreen}
    >
      <View style={styles.lockTop}>
        <View style={styles.dynamicIsland}>
          <Ionicons name="lock-open-outline" size={14} color="#86F2E4" />
          <Text style={styles.islandText}>Face ID đã xác thực • SmartClinic</Text>
        </View>
        <Text style={styles.lockDate}>Thứ Hai, 28 tháng 10</Text>
        <Text style={styles.lockClock}>21:00</Text>
      </View>

      {/* Main Notification Card */}
      <View style={[styles.card, SHADOWS.lg]}>
        <View style={styles.rowBetween}>
          <Badge
            label="SMARTCLINIC • ƯU TIÊN Y KHOA"
            variant="primarySolid"
            icon="medkit"
          />
          <Text style={styles.subText}>Vừa xong (21:00)</Text>
        </View>

        <Text style={[styles.cardTitle, { fontSize: 16, marginTop: 10 }]}>
          Đã đến giờ uống thuốc liều đầu tiên tối nay
        </Text>
        <Text style={styles.subText}>
          Toa điện tử #DT-HCM-2024-884122 • Chỉ định: TS. BS. Lê Thu Trang
        </Text>

        <View style={styles.pillHighlightBox}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Sibelium 5mg (Flunarizine)</Text>
            <Badge label="Liều 1/30 viên" variant="teal" />
          </View>
          <Text style={styles.subText}>
            Liều dùng: 1 viên trước khi ngủ • Sau bữa ăn nhẹ
          </Text>
          <Text style={[styles.subText, { color: COLORS.primary, marginTop: 4 }]}>
            💧 Uống với 200ml nước ấm. Tránh nhìn màn hình vi tính sau khi uống.
          </Text>
        </View>

        <AppButton
          title="Đã uống thuốc (Ghi nhận vào Hồ sơ)"
          variant="gradient"
          size="lg"
          leftIcon="checkmark-circle-outline"
          onPress={onConfirmTaken || onBack}
          style={{ marginBottom: 8 }}
        />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AppButton
            title="Nhắc sau 15p"
            variant="tonal"
            size="sm"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={onBack}
          />
          <AppButton
            title="Hỏi Dược sĩ trực"
            variant="outline"
            size="sm"
            fullWidth={false}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

// ============================================================================
// SCREEN 27: [1:7864] TỦ THUỐC GIA ĐÌNH & LỊCH NHẮC NẠP THUỐC
// ============================================================================
export const FamilyMedicineCabinetScreen: React.FC<{
  onBack?: () => void;
  onRefillNow?: () => void;
}> = ({ onBack, onRefillNow }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tủ Thuốc Gia Đình & Nhắc Nạp"
        subtitle="Quản lý tồn kho thuốc tại nhà & cảnh báo hết thuốc"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Refill Alert Banner */}
        <View style={[styles.alertCard, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Badge
              label="CẢNH BÁO NẠP THUỐC ĐỊNH KỲ"
              variant="danger"
              icon="alert-circle"
            />
            <Text style={[styles.slotTime, { color: COLORS.error }]}>
              Cần nạp trong 3 ngày
            </Text>
          </View>
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Sibelium 5mg (Flunarizine) chỉ còn 4 viên
          </Text>
          <Text style={styles.subText}>
            Đủ dùng đến 31/10/2024. Toa #DT-HCM-2024-884122 của TS. BS. Lê Thu
            Trang hỗ trợ tái nạp nhanh có BHYT.
          </Text>
          <AppButton
            title="Đặt nạp thuốc giao tận nhà ngay"
            variant="primary"
            size="md"
            leftIcon="cart-outline"
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
              <Text style={styles.cardTitle}>{med.name}</Text>
              <Badge
                label={med.stock}
                variant={med.urgent ? 'danger' : 'teal'}
              />
            </View>
            <Text style={styles.subText}>
              Người dùng: {med.owner} • {med.exp}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 21: [1:5904] GIAO THUỐC TẬN NHÀ
// ============================================================================
export const HomeMedicineDeliveryScreen: React.FC<{
  onBack?: () => void;
  onTrackDelivery?: () => void;
}> = ({ onBack, onTrackDelivery }) => {
  const [shipOption, setShipOption] = useState('express');
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Giao Thuốc Tận Nhà (GPP)"
        subtitle="Toa đã ký số #DT-HCM-2024-884122"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Prescription Verification Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Badge label="Toa Thuốc Điện Tử Đã Ký Số" variant="teal" showDot />
            <Text style={styles.slotTime}>#DT-HCM-2024-884122</Text>
          </View>
          <Text style={[styles.cardTitle, { marginTop: 6 }]}>
            TS. BS. Lê Thu Trang • BV Đại học Y Dược TP.HCM
          </Text>
          <Text style={styles.subText}>
            Dược sĩ SmartClinic đang trực tuyến đối soát mã BHYT & liều dùng
            trước khi xuất kho chuẩn GPP.
          </Text>
        </View>

        {/* Delivery Address */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Địa Chỉ Nhận Thuốc"
            leftIcon="location-outline"
            actionText="Thay đổi"
          />
          <Text style={styles.cardTitle}>Nguyễn Văn Vũ • 0918 234 892</Text>
          <Text style={styles.subText}>
            Căn hộ 12B.04, Chung cư Sunrise Riverside, Nguyễn Hữu Thọ, Phước
            Kiển, Nhà Bè, TP. Hồ Chí Minh
          </Text>
        </View>

        {/* Shipping Method */}
        <SectionHeader title="Phương thức vận chuyển Y tế" />
        <SegmentedControl
          variant="box"
          selectedKey={shipOption}
          onSelect={setShipOption}
          options={[
            { key: 'express', label: 'Hỏa Tốc 2H (Cold Chain 30k)' },
            { key: 'standard', label: 'Tiêu Chuẩn GPP (15k)' },
          ]}
          style={{ marginBottom: 14 }}
        />

        {/* Drug Basket */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Danh Mục Thuốc Kê Đơn (3 loại)"
            badgeText="BHYT -80%"
            badgeVariant="teal"
          />
          {[
            { name: 'Sibelium 5mg (Flunarizine) - Hộp 30v', price: '185.000đ' },
            { name: 'Ginkgo Biloba 80mg - Hộp 30v', price: '140.000đ' },
            { name: 'Paracetamol 500mg - Vỉ 10v', price: '25.000đ' },
          ].map((item) => (
            <View key={item.name} style={styles.priceRow}>
              <Text style={styles.subText}>{item.name}</Text>
              <Text style={styles.cardTitle}>{item.price}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.subText}>Quỹ BHYT thanh toán:</Text>
            <Text style={[styles.cardTitle, { color: COLORS.secondary }]}>
              -210.000đ
            </Text>
          </View>
        </View>
      </ScrollView>

      <StickyBottomBar
        topLabel="Đã áp dụng BHYT & Thùng lạnh Cold Chain"
        priceLabel="Thanh toán:"
        priceValue="170.000 đ"
        buttonTitle="Xác nhận & Giao thuốc"
        onButtonPress={onTrackDelivery}
      />
    </View>
  );
};

// ============================================================================
// SCREEN 20: [1:5577] THEO DÕI GIAO THUỐC THỜI GIAN THỰC
// ============================================================================
export const LiveDeliveryTrackingScreen: React.FC<{
  onBack?: () => void;
  onOpenHandover?: () => void;
}> = ({ onBack, onOpenHandover }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Theo Dõi Giao Thuốc 5G"
        subtitle="Đơn #MED-2024-9982 • Bảo mật GPP"
        badgeText="Còn 18 phút"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Simulated Route Banner */}
        <LinearGradient
          colors={GRADIENTS.heroCard}
          style={[styles.heroCard, SHADOWS.md]}
        >
          <View style={styles.rowBetween}>
            <Badge label="ĐANG GIAO HÀNG HỎA TỐC" variant="teal" showDot />
            <Text style={styles.whiteSub}>2.4 km • Dự kiến 16:45</Text>
          </View>
          <Text style={[styles.whiteTitle, { marginTop: 8 }]}>
            Kho Dược BV ĐHYD (Q.5) ➔ Sunrise Riverside (Nhà Bè)
          </Text>
          <Text style={styles.whiteSub}>
            Vị trí hiện tại: Cầu Kênh Tẻ hướng về Quận 7 / Nhà Bè
          </Text>
        </LinearGradient>

        {/* Medical IoT Cold Chain Telemetry Card */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>
              Cảm biến IoT SmartMed Box (Cold Chain)
            </Text>
            <Badge label="Chuẩn 2-8°C" variant="teal" />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={styles.telemetryBox}>
              <Text style={styles.subText}>Nhiệt độ thùng</Text>
              <Text style={styles.telemetryVal}>5.1 °C</Text>
            </View>
            <View style={styles.telemetryBox}>
              <Text style={styles.subText}>Độ ẩm khoang</Text>
              <Text style={styles.telemetryVal}>44 %</Text>
            </View>
            <View style={styles.telemetryBox}>
              <Text style={styles.subText}>Niêm phong</Text>
              <Text style={styles.telemetryVal}>An toàn</Text>
            </View>
          </View>
        </View>

        {/* Courier Profile */}
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Nhân viên giao dược phẩm GPP"
            badgeText="Đã xác thực"
            badgeVariant="blue"
          />
          <Text style={styles.cardTitle}>
            Nguyễn Tuấn Kiệt • Biển số 59-X3 892.41
          </Text>
          <Text style={styles.subText}>
            Mã OTP nhận thuốc của bạn: <Text style={{ fontWeight: '800', color: COLORS.primary }}>8841</Text>
          </Text>
          <AppButton
            title="Mở Biên Bản Giao Nhận & Mở Niêm Phong"
            variant="primary"
            size="md"
            leftIcon="shield-checkmark-outline"
            onPress={onOpenHandover}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 19: [1:5227] BIÊN BẢN GIAO NHẬN & MỞ NIÊM PHONG THUỐC
// ============================================================================
export const DeliveryHandoverUnsealScreen: React.FC<{
  onBack?: () => void;
  onConfirmHandover?: () => void;
}> = ({ onBack, onConfirmHandover }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Biên Bản Giao Nhận & Mở Niêm Phong"
        subtitle="#BBGN-2024-9982 • 16:42 • 28/10/2024"
        badgeText="GPP"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="Đã giao đến nơi • Đối soát tại chỗ" variant="teal" showDot />
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={styles.telemetryBox}>
              <Text style={styles.subText}>Bên giao (SmartMed)</Text>
              <Text style={styles.cardTitle}>Nguyễn Tuấn Kiệt</Text>
              <Text style={styles.subText}>Xe 59-X3 892.41</Text>
            </View>
            <View style={styles.telemetryBox}>
              <Text style={styles.subText}>Bên nhận (Bệnh nhân)</Text>
              <Text style={styles.cardTitle}>Nguyễn Văn Vũ</Text>
              <Text style={styles.subText}>0918 234 892</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader
            title="Bằng chứng Chuỗi Lạnh lúc mở nắp"
            badgeText="5.1°C • 44% RH"
            badgeVariant="teal"
          />
          <Text style={styles.subText}>
            ✓ Tem niêm phong Hologram #SM-99821 nguyên vẹn trước khi mở.
          </Text>
          <Text style={styles.subText}>
            ✓ Đủ 03 hộp thuốc theo đúng toa #DT-HCM-884122.
          </Text>
        </View>

        <AppButton
          title="Ký xác nhận đã nhận đủ thuốc an toàn"
          variant="gradient"
          size="lg"
          leftIcon="checkmark-done-circle-outline"
          onPress={onConfirmHandover || onBack}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 26: [1:7462] LỊCH SỬ TÁI NẠP & HÓA ĐƠN THUỐC BHYT
// ============================================================================
export const RefillHistoryAndBHYTScreen: React.FC<{
  onBack?: () => void;
  onOpenVATInvoice?: () => void;
}> = ({ onBack, onOpenVATInvoice }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Lịch Sử Tái Nạp & Hóa Đơn BHYT"
        subtitle="Mã BHYT: GD-4-79-11-20948 • BV ĐHYD TP.HCM"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {/* Financial & Insurance Benefits Summary */}
        <LinearGradient
          colors={GRADIENTS.insuranceCard}
          style={[styles.heroCard, SHADOWS.md]}
        >
          <Text style={styles.whiteSub}>
            Quyền lợi Dược phẩm & BHYT Năm 2024 (4 đợt nạp)
          </Text>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <View>
              <Text style={styles.whiteSub}>Tổng tiền thuốc nạp</Text>
              <Text style={styles.whiteTitle}>2.450.000 đ</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.whiteSub}>BHYT đã chi trả (-36%)</Text>
              <Text style={[styles.whiteTitle, { color: '#86F2E4' }]}>
                Tiết kiệm 890.000 đ
              </Text>
            </View>
          </View>
        </LinearGradient>

        <SectionHeader
          title="Danh sách đợt nạp & Hóa đơn VAT"
          badgeText="04/04 Hợp lệ"
          badgeVariant="teal"
        />
        {[
          {
            code: 'HĐ VAT #0048192 (1C24TSM)',
            date: '28/10/2024 • Đợt nạp Quý 4',
            amount: '350.000 đ (BHYT trả 210.000 đ)',
          },
          {
            code: 'HĐ VAT #0039104 (1C24TSM)',
            date: '15/09/2024 • Đợt nạp Quý 3',
            amount: '680.000 đ (BHYT trả 420.000 đ)',
          },
        ].map((inv) => (
          <View key={inv.code} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{inv.code}</Text>
              <Badge label="Đã cấp mã CQT" variant="teal" />
            </View>
            <Text style={styles.subText}>{inv.date}</Text>
            <Text style={[styles.slotTime, { marginTop: 4 }]}>{inv.amount}</Text>
            <AppButton
              title="Xem Hóa Đơn Điện Tử VAT & XML"
              variant="tonal"
              size="sm"
              leftIcon="document-text-outline"
              onPress={onOpenVATInvoice}
              style={{ marginTop: 10 }}
            />
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
    marginTop: 12,
  },
  dayPill: {
    width: 42,
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
  whiteTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
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
  lockScreen: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  lockTop: {
    alignItems: 'center',
    marginTop: 12,
  },
  dynamicIsland: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
    marginBottom: 18,
  },
  islandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lockDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  lockClock: {
    fontSize: 54,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pillHighlightBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  telemetryVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.secondary,
    marginTop: 2,
  },
});

