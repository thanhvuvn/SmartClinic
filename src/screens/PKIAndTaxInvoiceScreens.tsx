import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS } from '../theme';
import {
  AppHeader,
  AppButton,
  Badge,
  SectionHeader,
  SegmentedControl,
} from '../components';

// ============================================================================
// SCREEN 22: [1:6278] TÓM TẮT SAU KHÁM & ĐƠN THUỐC ĐÃ KÝ SỐ
// ============================================================================
export const PostConsultSummarySignedRxScreen: React.FC<{
  onBack?: () => void;
  onOpenXMLCert?: () => void;
}> = ({ onBack, onOpenXMLCert }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tóm Tắt Sau Khám & Đơn Ký Số"
        subtitle="Ca khám #KB-2024-9982 • 28/10/2024 (32 phút)"
        badgeText="Đã ký số"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <LinearGradient
          colors={GRADIENTS.primaryTeal}
          style={[styles.heroCard, SHADOWS.sm]}
        >
          <Badge
            label="Hồ sơ & Đơn thuốc đã ký số hợp lệ"
            variant="glass"
            icon="shield-checkmark"
          />
          <Text style={[styles.whiteTitle, { marginTop: 8 }]}>
            Ký số bởi TS. BS. Lê Thu Trang
          </Text>
          <Text style={styles.whiteSub}>
            Chứng thực Ban Cơ Yếu Chính Phủ liên thông Cổng Đơn Thuốc Quốc Gia.
          </Text>
        </LinearGradient>

        {/* SmartScribe AI Summary */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>SmartScribe AI Summary</Text>
            <Badge label="Bác sĩ đã phê duyệt" variant="teal" />
          </View>
          <Text style={styles.subText}>
            • <Text style={{ fontWeight: '700' }}>G43.0:</Text> Đau nửa đầu
            Migraine không có tiền triệu (Migraine without aura).
          </Text>
          <Text style={styles.subText}>
            • <Text style={{ fontWeight: '700' }}>G47.0:</Text> Rối loạn giấc
            ngủ thứ phát do stress công việc.
          </Text>
        </View>

        <AppButton
          title="Xem Chi Tiết Chứng Thư Số PKI & Dữ Liệu XML"
          variant="primary"
          size="lg"
          leftIcon="code-slash-outline"
          onPress={onOpenXMLCert}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 23: [1:6655] CHI TIẾT CHỨNG THƯ SỐ & DỮ LIỆU XML
// ============================================================================
export const DigitalCertAndXMLInspectorScreen: React.FC<{
  onBack?: () => void;
  onOpenNEACLookup?: () => void;
}> = ({ onBack, onOpenNEACLookup }) => {
  const [viewMode, setViewMode] = useState('xml');
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chứng Thư Số PKI & Dữ Liệu XML"
        subtitle="1C24TSM • Số 0048192 • Mã CQT: 00389AF92B710048192"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <SegmentedControl
          variant="box"
          selectedKey={viewMode}
          onSelect={setViewMode}
          options={[
            { key: 'pdf', label: 'Bản PDF' },
            { key: 'xml', label: 'Dữ liệu XML' },
            { key: 'pki', label: 'Chứng thư PKI' },
          ]}
          style={{ marginBottom: 14 }}
        />

        {/* PKI Digital Certificate Hierarchy Card (X.509) */}
        <View style={[styles.card, SHADOWS.sm]}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Chuỗi Tin Cậy X.509 (Cert Chain)</Text>
            <Badge label="Còn 442 ngày" variant="teal" />
          </View>
          {[
            '1. Root CA Quốc Gia (Bộ TT&TT - Vietnam National Root CA)',
            '2. Viettel-CA SHA256 Sub-CA (Tập đoàn CN-VT Quân đội)',
            '3. CTCP Dược & TBYT Bệnh viện Đại học Y Dược TP.HCM (MST: 0302198421)',
          ].map((c) => (
            <Text key={c} style={styles.subText}>
              🔒 {c}
            </Text>
          ))}
        </View>

        {/* Raw XML Tree Inspector */}
        <View style={[styles.xmlBox, SHADOWS.sm]}>
          <Text style={styles.xmlCode}>
            {`<HDon Id="ID_0048192">\n  <DLHDon>\n    <TTChung>\n      <KHMSHDon>1</KHMSHDon>\n      <KHHDon>1C24TSM</KHHDon>\n      <SHDon>0048192</SHDon>\n      <NLap>2024-10-28</NLap>\n    </TTChung>\n    <NDHDon>\n      <NMua><Ten>NGUYỄN VĂN VŨ</Ten><MaBN>#BN-882910</MaBN></NMua>\n    </NDHDon>\n  </DLHDon>\n  <DSCKS>\n    <SignatureValue>MIIEpAIBAAKCAQEA79q2...</SignatureValue>\n  </DSCKS>\n</HDon>`}
          </Text>
        </View>

        <AppButton
          title="Tra cứu công khai trên Cổng NEAC (Bộ TT&TT)"
          variant="primary"
          size="md"
          leftIcon="globe-outline"
          onPress={onOpenNEACLookup}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 25: [1:7110] CHI TIẾT HÓA ĐƠN ĐIỆN TỬ VAT
// ============================================================================
export const ElectronicVATInvoiceScreen: React.FC<{
  onBack?: () => void;
  onOpenGDTTax?: () => void;
}> = ({ onBack, onOpenGDTTax }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Chi Tiết Hóa Đơn Điện Tử VAT"
        subtitle="Ký hiệu: 1C24TSM • Số HĐ: 0048192 • 28/10/2024"
        badgeText="HỢP LỆ"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.a4Sheet, SHADOWS.md]}>
          <Text style={styles.a4Header}>
            HÓA ĐƠN GIÁ TRỊ GIA TĂNG (BẢN THỂ HIỆN ĐIỆN TỬ)
          </Text>
          <Text style={styles.a4Sub}>
            Đơn vị bán: CÔNG TY CỔ PHẦN DƯỢC & TBYT BV ĐHYD TP.HCM (MST:
            0302198421)
          </Text>
          <Text style={styles.a4Sub}>
            Mã của Cơ quan Thuế: 00389AF92B710048192
          </Text>
          <View style={styles.divider} />
          <Text style={styles.cardTitle}>
            Họ tên người mua: NGUYỄN VĂN VŨ (#BN-882910)
          </Text>
          <Text style={styles.subText}>
            1. Sibelium 5mg (Hộp 30v) — 185.000 đ (VAT 5%)
          </Text>
          <Text style={styles.subText}>
            2. Ginkgo Biloba 80mg (Hộp 30v) — 140.000 đ (VAT 5%)
          </Text>
          <Text style={styles.subText}>
            3. Phí khám chuyên khoa Nội Thần Kinh — 350.000 đ
          </Text>
          <View style={styles.divider} />
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Tổng thanh toán (Sau BHYT):</Text>
            <Text style={[styles.cardTitle, { color: COLORS.primary }]}>
              350.000 đ
            </Text>
          </View>
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>
              ✓ ĐÃ KÝ SỐ HỢP LỆ BỞI: CTCP DƯỢC & TBYT BV ĐHYD TP.HCM
            </Text>
          </View>
        </View>

        <AppButton
          title="Đối soát trực tiếp trên Cổng Thuế GDT"
          variant="primary"
          size="lg"
          leftIcon="shield-checkmark-outline"
          onPress={onOpenGDTTax}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 28: [1:8245] TẢI TỆP THÀNH CÔNG & XEM BẢN IN CHUẨN A4
// ============================================================================
export const DownloadSuccessA4PreviewScreen: React.FC<{
  onBack?: () => void;
  onOpenPrintOptions?: () => void;
}> = ({ onBack, onOpenPrintOptions }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Tải Tệp Thành Công & Xem Bản A4"
        subtitle="#BUNDLE-TAX-MED-2024-884192"
        badgeText="300 DPI"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="Đã tải xuống thành công • Đã xác thực CA" variant="teal" showDot />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            SmartClinic_HoSoThue_NguyenVanVu_28102024.pdf
          </Text>
          <Text style={styles.subText}>
            4.8 MB • Chuẩn lưu trữ PDF/A-1b (10 năm) • Mã mở tệp: 012345 (6 số
            cuối CCCD)
          </Text>
        </View>

        <View style={[styles.a4Sheet, SHADOWS.sm]}>
          <Text style={styles.a4Header}>
            BẢNG KÊ CHỨNG TỪ Y TẾ & HÓA ĐƠN GTGT (TRANG 1/4)
          </Text>
          <Text style={styles.a4Sub}>
            Khổ chuẩn A4 (210 × 297 mm) • Độ phân giải 300 DPI Sẵn sàng in
          </Text>
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>
              SMARTCLINIC OFFICIAL • ĐÃ ĐÓNG DẤU MỘC ĐỐI SOÁT THUẾ
            </Text>
          </View>
        </View>

        <AppButton
          title="Gửi lệnh In Không Dây (AirPrint / Mopria)"
          variant="gradient"
          size="lg"
          leftIcon="print-outline"
          onPress={onOpenPrintOptions}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 29: [1:8580] TẢI TRỌN BỘ CHỨNG TỪ PDF CÓ DẤU MỘC ĐỐI SOÁT THUẾ
// ============================================================================
export const FullTaxDossierBundleScreen: React.FC<{
  onBack?: () => void;
  onDownloadSuccess?: () => void;
}> = ({ onBack, onDownloadSuccess }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Trọn Bộ Chứng Từ PDF Có Dấu Mộc"
        subtitle="Khấu trừ thuế TNCN & Bồi thường Bảo hiểm"
        badgeText="Ký số PKI"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge
            label="BỘ HỒ SƠ ĐÃ KIỂM ĐỊNH PHÁP LÝ • HỢP LỆ 100%"
            variant="teal"
            showDot
          />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Mã gói: #BUNDLE-TAX-MED-2024-884192
          </Text>
          <Text style={styles.subText}>
            Bệnh nhân: Nguyễn Văn Vũ • CCCD: ••••••012345 • BHYT:
            GD-4-79-11-20948
          </Text>
        </View>

        <View style={[styles.card, SHADOWS.sm]}>
          <SectionHeader title="4 Chứng từ pháp lý gộp trong 1 tệp PDF" />
          {[
            '1. Hóa đơn GTGT Điện tử #0048192 (Có mã của Cơ quan Thuế)',
            '2. Đơn thuốc điện tử đã ký số PKI #DT-HCM-2024-884122',
            '3. Bảng kê chi tiết viện phí & Thuốc BHYT mẫu 01/KBCB',
            '4. Biên bản thẩm định chữ ký số NEAC & Dấu thời gian VNPT TSA',
          ].map((doc) => (
            <Text key={doc} style={styles.subText}>
              ✅ {doc}
            </Text>
          ))}
        </View>

        <AppButton
          title="Tải Trọn Bộ PDF Có Dấu Mộc Đỏ (4.8 MB)"
          variant="primary"
          size="lg"
          leftIcon="download-outline"
          onPress={onDownloadSuccess}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 30: [1:8948] ĐỐI SOÁT CỔNG THUẾ GDT
// ============================================================================
export const GDTTaxPortalReconcileScreen: React.FC<{ onBack?: () => void }> = ({
  onBack,
}) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Đối Soát Cổng Thuế GDT"
        subtitle="https://hoadondientu.gdt.gov.vn/tra-cuu • TLS 1.3"
        badgeText="100% Khớp"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge
            label="TỔNG CỤC THUẾ VIỆT NAM • HỢP LỆ VỚI DỮ LIỆU GỐC CQT"
            variant="teal"
            showDot
          />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Hóa đơn điện tử có mã của Cơ quan Thuế
          </Text>
          <Text style={styles.subText}>
            Đơn vị bán: CÔNG TY CP DƯỢC & TBYT BV ĐẠI HỌC Y DƯỢC TP.HCM
          </Text>
          <Text style={styles.subText}>
            MST: 0302198421 • Ký hiệu: 1C24TSM • Số HĐ: 0048192
          </Text>
          <Text style={styles.subText}>
            Mã CQT cấp: 00389AF92B710048192 • Trạng thái: Đã cấp mã hợp lệ
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 34: [2:754] TRA CỨU CHỨNG THƯ SỐ PKI CÔNG KHAI TRÊN CỔNG NEAC
// ============================================================================
export const NEACPublicPKILookupScreen: React.FC<{
  onBack?: () => void;
  onOpenReportPage1?: () => void;
}> = ({ onBack, onOpenReportPage1 }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Cổng Thẩm Định NEAC (Bộ TT&TT)"
        subtitle="Mã phiên: #NEAC-VAL-2024-992147-VN • OCSP/CRL"
        badgeText="GOOD"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.card, SHADOWS.sm]}>
          <Badge label="TRẠNG THÁI: HỢP LỆ (GOOD)" variant="teal" showDot />
          <Text style={[styles.cardTitle, { marginTop: 8 }]}>
            Serial Number: 54:02:FA:89:11:BC:7E:90
          </Text>
          <Text style={styles.subText}>
            Liên kết chứng từ y tế: Hóa đơn điện tử #0048192 & Đơn thuốc
            #DT-HCM-2024-884122
          </Text>
          <Text style={styles.subText}>
            Cơ quan chứng thực gốc: Vietnam National Root CA (Bộ TT&TT)
          </Text>
        </View>

        <AppButton
          title="Xem Báo Cáo Thẩm Định NEAC (PDF Trang 1/2)"
          variant="primary"
          size="lg"
          leftIcon="document-text-outline"
          onPress={onOpenReportPage1}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 35: [2:1065] BÁO CÁO THẨM ĐỊNH NEAC (PDF) - TRANG 1/2
// ============================================================================
export const NEACAuditReportPage1Screen: React.FC<{
  onBack?: () => void;
  onOpenPage2?: () => void;
}> = ({ onBack, onOpenPage2 }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Báo Cáo Thẩm Định NEAC (Trang 1/2)"
        subtitle="Số: 992147/BC-NEAC-TTKT • PDF/A-1b (1.4 MB)"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.a4Sheet, SHADOWS.md]}>
          <Text style={styles.a4Header}>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM{'\n'}Độc lập - Tự do - Hạnh phúc
          </Text>
          <Text style={[styles.a4Sub, { textAlign: 'center', marginTop: 4 }]}>
            BỘ THÔNG TIN VÀ TRUYỀN THÔNG — TRUNG TÂM CHỨNG THỰC ĐIỆN TỬ QUỐC GIA
          </Text>
          <View style={styles.divider} />
          <Text style={styles.cardTitle}>
            BÁO CÁO THẨM ĐỊNH HIỆU LỰC CHỨNG THƯ SỐ (TRANG 1/2)
          </Text>
          <Text style={styles.subText}>
            Căn cứ Luật Giao dịch điện tử 20/2023/QH15 & Nghị định
            130/2018/NĐ-CP.
          </Text>
          <Text style={styles.subText}>
            Đơn vị thụ hưởng: CTCP DƯỢC & TBYT ĐHYD TP.HCM — Nhà thuốc SmartMed
            #08 (MST: 0314892100).
          </Text>
        </View>

        <AppButton
          title="Chuyển sang Trang 2/2 (Phụ lục Chuỗi Khóa PKI) →"
          variant="primary"
          size="lg"
          onPress={onOpenPage2}
        />
      </ScrollView>
    </View>
  );
};

// ============================================================================
// SCREEN 36: [2:1350] BÁO CÁO THẨM ĐỊNH NEAC - TRANG 2/2
// ============================================================================
export const NEACAuditReportPage2Screen: React.FC<{
  onBack?: () => void;
  onOpenAirPrint?: () => void;
}> = ({ onBack, onOpenAirPrint }) => {
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Báo Cáo Thẩm Định NEAC (Trang 2/2)"
        subtitle="Phụ lục II • Chuỗi Khóa PKI & Dấu Mộc Đỏ"
        badgeText="VERIFIED"
        onBack={onBack}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <View style={[styles.a4Sheet, SHADOWS.md]}>
          <Text style={styles.cardTitle}>
            II. BẢNG TRA CỨU CHI TIẾT CHUỖI CHỨNG THƯ SỐ (PKI PATH)
          </Text>
          <Text style={styles.subText}>
            • Issuer: Root CA Quốc Gia ➔ VNPT-CA Sub-CA Medical v2
          </Text>
          <Text style={styles.subText}>
            • Serial Number: 54:3E:91:A0:8C:F2:11:8A:77
          </Text>
          <Text style={styles.subText}>
            • Thuật toán băm: SHA-256 with RSA Encryption (2048-bit)
          </Text>
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>
              [DẤU MỘC ĐỎ TRUNG TÂM CHỨNG THỰC ĐIỆN TỬ QUỐC GIA - NEAC VERIFIED]
            </Text>
          </View>
        </View>

        <AppButton
          title="In Báo Cáo Không Dây (AirPrint)"
          variant="gradient"
          size="lg"
          leftIcon="print-outline"
          onPress={onOpenAirPrint}
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
    fontSize: 12,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 4,
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
  xmlBox: {
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 14,
  },
  xmlCode: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#86F2E4',
    fontFamily: 'monospace',
  },
  a4Sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  a4Header: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  a4Sub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  stampBox: {
    marginTop: 14,
    padding: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  stampText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.error,
    textAlign: 'center',
  },
});

