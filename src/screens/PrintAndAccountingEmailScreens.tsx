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
  AppHeader,
  AppButton,
  AppInput,
  Badge,
  SectionHeader,
  SegmentedControl,
} from '../components';

// ============================================================================
// SCREEN 31: [2:2] LỊCH SỬ IN & CHIA SẺ CHỨNG TỪ
// ============================================================================
export const PrintAndShareHistoryScreen: React.FC<{
  onBack?: () => void;
  onOpenEmailReceipt?: () => void;
  onOpenAirPrint?: () => void;
  onOpenSendEmail?: () => void;
}> = ({ onBack, onOpenEmailReceipt, onOpenAirPrint, onOpenSendEmail }) => {
  const [filter, setFilter] = useState('all');
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Lịch Sử In & Chia Sẻ Chứng Từ"
        subtitle="#BUNDLE-TAX-MED-2024-884192 • Hồ sơ xác thực"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <SegmentedControl
          variant="chips"
          selectedKey={filter}
          onSelect={setFilter}
          options={[
            { key: 'all', label: 'Tất cả (12)' },
            { key: 'print', label: 'Lệnh in ấn (4)' },
            { key: 'email', label: 'Đã gửi Email/Zalo (5)' },
            { key: 'cloud', label: 'Tải về & Đám mây (3)' },
          ]}
          style={{ marginBottom: 14 }}
        />

        {[
          {
            title: 'In Trọn Bộ Hồ Sơ Thuế & BHYT (A4)',
            meta: '16:48 • HP LaserJet Pro M428fdw • 01 bản (In màu)',
            file: 'SmartClinic_HoSoThue_NguyenVanVu_28102024.pdf (4.8 MB)',
            status: 'Thành công (300 DPI)',
          },
          {
            title: 'Gửi Email Kế Toán Công Ty',
            meta: '16:42 • ketoan.tax@congty-sample.vn',
            file: 'Đính kèm AES-256 • TLS 1.3 DKIM Valid',
            status: 'Đã chuyển phát',
          },
        ].map((log) => (
          <View key={log.title} style={[styles.card, SHADOWS.sm]}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{log.title}</Text>
              <Badge label={log.status} variant="teal" />
            </View>
            <Text style={styles.subText}>{log.meta}</Text>
            <Text style={styles.subText}>📄 {log.file}</Text>
            <AppButton
              title="Xem Chi Tiết Biên Nhận & Log"
              variant="tonal"
              size="sm"
              onPress={onOpenEmailReceipt}
              style={{ marginTop: 10 }}
            />
          </View>
        ))}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <AppButton
            title="In Không Dây (AirPrint)"
            variant="primary"
            size="md"
            leftIcon="print-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={onOpenAirPrint}
          />
          <AppButton
            title="Gửi Email Kế Toán"
            variant="secondary"
            size="md"
            leftIcon="mail-outline"
            fullWidth={false}
            style={{ flex: 1 }}
            onPress={onOpenSendEmail}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 32: [2:260] CHI TIẾT BIÊN NHẬN GỬI EMAIL KẾ TOÁN
// ============================================================================
export const AccountingEmailReceiptDetailScreen: React.FC<{
  onBack?: () => void;
  onOpenGatewayPDF?: () => void;
}> = ({ onBack, onOpenGatewayPDF }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Biên Nhận Gửi Email Kế Toán"
        subtitle="#MSG-TAX-2024-884192-MAIL01 • TLS 1.3 • DKIM"
        badgeText="Đã chuyển phát"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader title="Thông Tin Người Nhận & Tiêu Đề" />
          <Text style={styles.subText}>
            • <Text style={styles.bold}>Đến (To):</Text>{' '}
            ketoan.tax@congty-sample.vn (Bộ phận Kế toán - CP Sample Tech VN)
          </Text>
          <Text style={styles.subText}>
            • <Text style={styles.bold}>CC:</Text> nguyenvanvu.tech@gmail.com
          </Text>
          <Text style={styles.subText}>
            • <Text style={styles.bold}>Chủ đề:</Text> [Hồ Sơ Y Tế & Hóa Đơn
            GTGT] Nguyễn Văn Vũ - Đơn Thuốc #DT-HCM-2024-884122 & HĐ #0048192
          </Text>
          <Text style={styles.subText}>
            • <Text style={styles.bold}>Mục đích:</Text> Hoàn ứng viện phí &
            Quyết toán công tác Q4/2024
          </Text>
        </View>

        <AppButton
          title="Tải Bản Biên Nhận PDF Ký Số Gateway"
          variant="primary"
          size="lg"
          leftIcon="download-outline"
          onPress={onOpenGatewayPDF}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 33: [2:512] TẢI BẢN BIÊN NHẬN PDF KÝ SỐ GATEWAY
// ============================================================================
export const GatewaySignedReceiptPDFScreen: React.FC<{
  onBack?: () => void;
  onOpenAirPrint?: () => void;
  onOpenSendEmail?: () => void;
}> = ({ onBack, onOpenAirPrint, onOpenSendEmail }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Biên Nhận PDF Ký Số Gateway"
        subtitle="#RCPT-GW-2024-884192-KTOAN • PKI / TSA"
        badgeText="HỢP PHÁP"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="ĐÃ KÝ SỐ GATEWAY • HỢP PHÁP" variant="teal" showDot />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Biên Nhận Chuyển Phát & Truy Vết Kế Toán
          </Text>
          <Text style={styles.subText}>
            Issuer CA: SmartClinic Secure Mail Gateway Authority (Root CA: Ban
            Cơ yếu Chính phủ / NEAC)
          </Text>
          <Text style={styles.subText}>
            Thuật toán: RSA 2048-bit • SHA-256 w/ RSA • Thời gian TSA: 16:42:18
            (28/10/2024)
          </Text>
        </View>

        <AppButton
          title="In Không Dây (AirPrint) Biên Nhận Này"
          variant="gradient"
          size="lg"
          leftIcon="print-outline"
          onPress={onOpenAirPrint}
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="Chuyển tiếp Email Kế Toán Thuế"
          variant="tonal"
          size="md"
          leftIcon="mail-outline"
          onPress={onOpenSendEmail}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 37: [2:1671] TÙY CHỌN IN ẤN KHÔNG DÂY (AIRPRINT)
// ============================================================================
export const AirPrintOptionsModalScreen: React.FC<{
  onBack?: () => void;
  onSelectPrinter?: () => void;
  onStartPrint?: () => void;
}> = ({ onBack, onSelectPrinter, onStartPrint }) => {
  const [copies, setCopies] = useState(1);
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tùy Chọn In Ấn Không Dây (AirPrint)"
        subtitle="BC-NEAC-TTKT #992147.pdf • 2 Trang A4"
        badgeText="AirPrint IPP-S"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <TouchableOpacity
          style={[styles.card, SHADOWS.sm]}
          onPress={onSelectPrinter}
        >
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="print" size={24} color={COLORS.primary} />
              <View>
                <Text style={styles.cardTitle}>HP LaserJet Pro M404dw</Text>
                <Text style={styles.subText}>
                  Sẵn sàng • Phòng Kế Toán (5GHz) • Đổi máy in
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Số bản sao</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setCopies(Math.max(1, copies - 1))}
              >
                <Text style={styles.cardTitle}>-</Text>
              </TouchableOpacity>
              <Text style={styles.cardTitle}>{copies} bản</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setCopies(copies + 1)}
              >
                <Text style={styles.cardTitle}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subText}>
            Khổ giấy: A4 (210 × 297 mm) • Hai mặt tự động (Duplex) • Ký số PKI
          </Text>
        </View>

        <AppButton
          title="Tiến hành In Ngay"
          variant="gradient"
          size="lg"
          leftIcon="print-outline"
          onPress={onStartPrint}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 38: [2:1857] DANH SÁCH MÁY IN KHẢ DỤNG
// ============================================================================
export const AvailablePrintersListScreen: React.FC<{
  onBack?: () => void;
  onConfirmPrinter?: () => void;
}> = ({ onBack, onConfirmPrinter }) => {
  const [selected, setSelected] = useState('hp');
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Danh Sách Máy In Khả Dụng"
        subtitle="Mạng nội bộ: SmartClinic-Staff-5G (WPA3-LAN)"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="Lưu ý in báo cáo NEAC" variant="warning" icon="information-circle" />
          <Text style={styles.subText}>
            Báo cáo Thẩm định Chữ ký số NEAC có con dấu pháp lý màu đỏ. Khuyến
            nghị sử dụng máy in Laser Màu Tầng 1 (Canon C3830i) hoặc HP M404dw.
          </Text>
        </View>

        {[
          {
            id: 'hp',
            name: 'HP LaserJet Pro M404dw (Mặc định)',
            loc: 'Phòng Kế Toán & Giám Định (Tầng 2)',
            spec: 'IPP-S / AirPrint (AES-256) • Khay giấy: 250 tờ • Mực K: 85%',
          },
          {
            id: 'canon',
            name: 'Canon imageRUNNER ADVANCE C3830i (In Màu)',
            loc: 'Quầy Hành Chính & Cấp Chứng Từ (Tầng 1)',
            spec: 'Laser Màu 1200 DPI • Hỗ trợ in dấu mộc đỏ pháp lý NEAC',
          },
        ].map((p) => {
          const active = selected === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => setSelected(p.id)}
              style={[
                styles.card,
                SHADOWS.sm,
                active && { borderColor: COLORS.primary, borderWidth: 2 },
              ]}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{p.name}</Text>
                <Badge
                  label={active ? 'Đang chọn' : 'Sẵn sàng'}
                  variant={active ? 'primarySolid' : 'teal'}
                />
              </View>
              <Text style={styles.subText}>{p.loc}</Text>
              <Text style={styles.subText}>{p.spec}</Text>
            </TouchableOpacity>
          );
        })}

        <AppButton
          title="Xác nhận chọn máy in này"
          variant="primary"
          size="lg"
          onPress={onConfirmPrinter || onBack}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 39: [2:2151] TIẾN TRÌNH ĐANG IN & HÀNG ĐỢI MÁY IN
// ============================================================================
export const PrintSpoolingProgressScreen: React.FC<{
  onBack?: () => void;
  onFinishPrint?: () => void;
}> = ({ onBack, onFinishPrint }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tiến Trình Đang In & Hàng Đợi"
        subtitle="192.168.1.108:631 • HP LaserJet Pro M404dw"
        badgeText="68%"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>LỆNH IN ƯU TIÊN #992147</Text>
            <Badge label="Còn ~6 giây" variant="teal" showDot />
          </View>
          <Text style={styles.subText}>
            Tệp: BC-NEAC-TTKT #992147.pdf • Báo cáo Thẩm định Chữ ký số NEAC (2
            Trang A4 Duplex)
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '68%' }]} />
          </View>
          <Text style={styles.subText}>
            Đang in Trang 2/2 (Khối ký số & Mộc đỏ) • Tốc độ: 1.2 MB/s
          </Text>
        </View>

        <AppButton
          title="Xem Màn Hình In Hoàn Tất & Nhận Tài Liệu →"
          variant="primary"
          size="lg"
          onPress={onFinishPrint}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 40: [2:2419] GỬI EMAIL KẾ TOÁN THUẾ
// ============================================================================
export const SendTaxAccountingEmailScreen: React.FC<{
  onBack?: () => void;
  onSendSuccess?: () => void;
}> = ({ onBack, onSendSuccess }) => {
  const [toEmail, setToEmail] = useState('ketoan-thue@smartmed.vn');
  const [ccEmail, setCcEmail] = useState('nguyenvanvu.work@gmail.com');

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Gửi Email Kế Toán Thuế"
        subtitle="Biên nhận #PRN-REC-2024-992147 • Bảo mật SSL/TLS"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <AppInput
            label="Gửi đến (To) - Hộp thư thẩm định tài chính *"
            leftIcon="mail-outline"
            value={toEmail}
            onChangeText={setToEmail}
          />
          <AppInput
            label="Gửi kèm bản sao (CC)"
            leftIcon="people-outline"
            value={ccEmail}
            onChangeText={setCcEmail}
          />
          <Text style={styles.cardTitle}>
            Đính kèm tự động mã hóa (3 tệp • 2.78 MB):
          </Text>
          <Text style={styles.subText}>
            1. Bien-Nhan-In-PKI-PRN992147.pdf (1.2 MB)
          </Text>
          <Text style={styles.subText}>
            2. Bao-Cao-Tham-Dinh-NEAC-Signed.pdf (1.4 MB)
          </Text>
          <Text style={styles.subText}>3. Log-Kiem-Toan-SHA256.xml (0.18 MB)</Text>
        </View>

        <AppButton
          title="Ký số Gateway & Gửi Email Kế Toán"
          variant="gradient"
          size="lg"
          leftIcon="send-outline"
          onPress={onSendSuccess}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 41: [2:2682] BIÊN NHẬN IN & LOG KÝ SỐ PKI
// ============================================================================
export const PrintReceiptAndPKILogScreen: React.FC<{
  onBack?: () => void;
  onSendEmail?: () => void;
}> = ({ onBack, onSendEmail }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Biên Nhận In & Log Ký Số PKI"
        subtitle="#PRN-REC-2024-992147 • Nghị định 130/2018/NĐ-CP"
        badgeText="HỢP PHÁP"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Text style={styles.cardTitle}>
            Tài Liệu & Phần Cứng Thực Thi (IPP-S TLS v1.3)
          </Text>
          <Text style={styles.subText}>
            • Tệp in: BC-NEAC-TTKT #992147.pdf (2 Trang • Duplex)
          </Text>
          <Text style={styles.subText}>
            • SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </Text>
          <Text style={styles.subText}>
            • Máy in: HP M404dw (192.168.1.108 • MAC: 44:65:0B:A1:7E:22)
          </Text>
        </View>

        <AppButton
          title="Chuyển tiếp Biên Nhận sang Email Kế Toán Thuế"
          variant="primary"
          size="lg"
          leftIcon="mail-outline"
          onPress={onSendEmail}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 42: [2:3043] IN HOÀN TẤT & BIÊN NHẬN LỆNH IN
// ============================================================================
export const PrintCompletedReceiptScreen: React.FC<{
  onBack?: () => void;
  onOpenPKILog?: () => void;
}> = ({ onBack, onOpenPKILog }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="In Hoàn Tất & Biên Nhận Lệnh In"
        subtitle="HP LaserJet Pro M404dw • Tầng 2"
        badgeText="Sẵn sàng lấy"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="TRỰC TUYẾN • SẴN SÀNG LẤY TÀI LIỆU" variant="teal" showDot />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Vị trí nhận tài liệu: Khay ra phía trên (Output Bin #1)
          </Text>
          <Text style={styles.subText}>
            Quy cách: 2 Trang A4 • Hai mặt (Duplex) • Độ phân giải 1.200 DPI (1
            bản gốc lưu hành).
          </Text>
        </View>

        <AppButton
          title="Xem Biên Nhận In & Log Ký Số PKI (#PRN-REC)"
          variant="primary"
          size="lg"
          leftIcon="shield-checkmark-outline"
          onPress={onOpenPKILog}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 43: [2:3282] GỬI EMAIL THÀNH CÔNG & MÃ VẬN ĐƠN KIỂM TOÁN
// ============================================================================
export const EmailSentAuditSuccessScreen: React.FC<{
  onBack?: () => void;
}> = ({ onBack }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Gửi Email Kiểm Toán Thành Công"
        subtitle="mailgw01.smartmed.vn • SPF: PASS • DKIM: VALID"
        badgeText="Hoàn tất"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="ĐÃ CHUYỂN PHÁT & LƯU LOG KIỂM TOÁN" variant="teal" showDot />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Người nhận: ketoan-thue@smartmed.vn
          </Text>
          <Text style={styles.subText}>
            CC: nguyenvanvu.work@gmail.com, ketoan.truong@smartclinic.vn
          </Text>
          <Text style={styles.subText}>
            Đã đính kèm 3 tệp chứng thực (2.78 MB): Biên nhận in PKI, Báo cáo
            thẩm định NEAC có dấu mộc đỏ và tệp XML SHA-256.
          </Text>
        </View>

        <AppButton
          title="Hoàn tất & Quay về"
          variant="primary"
          size="lg"
          onPress={onBack}
        />
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
    marginTop: 4,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceContainer,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});

