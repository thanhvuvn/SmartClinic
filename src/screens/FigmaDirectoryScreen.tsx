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
import { AppHeader, SearchBar, Badge, SegmentedControl } from '../components';

export interface FigmaScreenEntry {
  index: number;
  figmaId: string;
  title: string;
  category: 'core' | 'telehealth_family' | 'pharmacy' | 'pki_tax' | 'print_email';
  routeKey: string;
}

export const ALL_43_FIGMA_SCREENS: FigmaScreenEntry[] = [
  { index: 1, figmaId: '1:2', title: 'AI Health Assistant', category: 'core', routeKey: 'tab_ai' },
  { index: 2, figmaId: '1:239', title: 'Hồ Sơ Bệnh Án Điện Tử', category: 'core', routeKey: 'tab_records' },
  { index: 3, figmaId: '1:728', title: 'Splash Screen', category: 'core', routeKey: 'splash' },
  { index: 4, figmaId: '1:800', title: 'Đăng Nhập (3 Phân Quyền)', category: 'core', routeKey: 'login' },
  { index: 5, figmaId: '1:898', title: 'Đăng Ký', category: 'core', routeKey: 'register' },
  { index: 6, figmaId: '1:1050', title: 'Hồ Sơ & Cài Đặt Thông Báo', category: 'core', routeKey: 'tab_profile' },
  { index: 7, figmaId: '1:1471', title: 'Trang Chủ', category: 'core', routeKey: 'tab_home' },
  { index: 8, figmaId: '1:1817', title: 'Nhật Ký & Thông Báo Uống Thuốc', category: 'pharmacy', routeKey: 'medLog' },
  { index: 9, figmaId: '1:2174', title: 'Chi Tiết Bác Sĩ', category: 'core', routeKey: 'doctorDetail' },
  { index: 10, figmaId: '1:2451', title: 'Chọn Lịch Khám', category: 'core', routeKey: 'bookingSlot' },
  { index: 11, figmaId: '1:2703', title: 'Đặt Lịch Thành Công', category: 'telehealth_family', routeKey: 'bookingSuccess' },
  { index: 12, figmaId: '1:2961', title: 'Lịch Khám Của Tôi', category: 'core', routeKey: 'tab_appointments' },
  { index: 13, figmaId: '1:3212', title: 'Chi Tiết Toa Thuốc & Lịch Nhắc Uống Thuốc', category: 'pharmacy', routeKey: 'rxDetail' },
  { index: 14, figmaId: '1:3491', title: 'Quản Lý Hồ Sơ Người Thân', category: 'telehealth_family', routeKey: 'familyProfiles' },
  { index: 15, figmaId: '1:3822', title: 'Chi Tiết Bệnh Án Người Thân - Bé Bảo Nam', category: 'telehealth_family', routeKey: 'childEHR' },
  { index: 16, figmaId: '1:4230', title: 'Thêm Mới / Chỉnh Sửa Hồ Sơ Người Thân', category: 'telehealth_family', routeKey: 'addFamilyMember' },
  { index: 17, figmaId: '1:4593', title: 'Tư Vấn Trực Tuyến - TS. BS. Lê Thu Trang', category: 'telehealth_family', routeKey: 'teleconsult' },
  { index: 18, figmaId: '1:4768', title: 'Kết Quả Cận Lâm Sàng & CĐHA', category: 'telehealth_family', routeKey: 'labImagingResults' },
  { index: 19, figmaId: '1:5227', title: 'Biên Bản Giao Nhận & Mở Niêm Phong Thuốc', category: 'pharmacy', routeKey: 'deliveryHandover' },
  { index: 20, figmaId: '1:5577', title: 'Theo Dõi Giao Thuốc Thời Gian Thực', category: 'pharmacy', routeKey: 'liveDelivery' },
  { index: 21, figmaId: '1:5904', title: 'Giao Thuốc Tận Nhà', category: 'pharmacy', routeKey: 'homeDelivery' },
  { index: 22, figmaId: '1:6278', title: 'Tóm tắt sau khám & Đơn thuốc đã ký số', category: 'pki_tax', routeKey: 'postConsultSummary' },
  { index: 23, figmaId: '1:6655', title: 'Chi Tiết Chứng Thư Số & Dữ Liệu XML', category: 'pki_tax', routeKey: 'digitalCertXML' },
  { index: 24, figmaId: '1:6927', title: 'Thông Báo Nhắc Uống Thuốc Liều Đầu Tiên', category: 'pharmacy', routeKey: 'firstDoseAlert' },
  { index: 25, figmaId: '1:7110', title: 'Chi Tiết Hóa Đơn Điện Tử VAT', category: 'pki_tax', routeKey: 'vatInvoice' },
  { index: 26, figmaId: '1:7462', title: 'Lịch Sử Tái Nạp & Hóa Đơn Thuốc BHYT', category: 'pharmacy', routeKey: 'refillBHYT' },
  { index: 27, figmaId: '1:7864', title: 'Tủ Thuốc Gia Đình & Lịch Nhắc Nạp Thuốc', category: 'pharmacy', routeKey: 'medicineCabinet' },
  { index: 28, figmaId: '1:8245', title: 'Tải Tệp Thành Công & Xem Bản In Chuẩn A4', category: 'pki_tax', routeKey: 'downloadA4Preview' },
  { index: 29, figmaId: '1:8580', title: 'Tải Trọn Bộ Chứng Từ PDF Có Dấu Mộc Đối Soát Thuế', category: 'pki_tax', routeKey: 'fullTaxDossier' },
  { index: 30, figmaId: '1:8948', title: 'Đối Soát Cổng Thuế GDT', category: 'pki_tax', routeKey: 'gdtTaxPortal' },
  { index: 31, figmaId: '2:2', title: 'Lịch Sử In & Chia Sẻ Chứng Từ', category: 'print_email', routeKey: 'printShareHistory' },
  { index: 32, figmaId: '2:260', title: 'Chi Tiết Biên Nhận Gửi Email Kế Toán', category: 'print_email', routeKey: 'accountingEmailReceipt' },
  { index: 33, figmaId: '2:512', title: 'Tải Bản Biên Nhận PDF Ký Số Gateway', category: 'print_email', routeKey: 'gatewaySignedPDF' },
  { index: 34, figmaId: '2:754', title: 'Tra Cứu Chứng Thư Số PKI Công Khai Trên Cổng NEAC', category: 'pki_tax', routeKey: 'neacPublicLookup' },
  { index: 35, figmaId: '2:1065', title: 'Báo Cáo Thẩm Định NEAC (PDF) - Trang 1/2', category: 'pki_tax', routeKey: 'neacReportP1' },
  { index: 36, figmaId: '2:1350', title: 'Báo Cáo Thẩm Định NEAC - Trang 2/2', category: 'pki_tax', routeKey: 'neacReportP2' },
  { index: 37, figmaId: '2:1671', title: 'Tùy Chọn In Ấn Không Dây (AirPrint)', category: 'print_email', routeKey: 'airPrintOptions' },
  { index: 38, figmaId: '2:1857', title: 'Danh Sách Máy In Khả Dụng', category: 'print_email', routeKey: 'availablePrinters' },
  { index: 39, figmaId: '2:2151', title: 'Tiến Trình Đang In & Hàng Đợi Máy In', category: 'print_email', routeKey: 'printSpooling' },
  { index: 40, figmaId: '2:2419', title: 'Gửi Email Kế Toán Thuế', category: 'print_email', routeKey: 'sendTaxEmail' },
  { index: 41, figmaId: '2:2682', title: 'Biên Nhận In & Log Ký Số PKI', category: 'print_email', routeKey: 'printPKILog' },
  { index: 42, figmaId: '2:3043', title: 'In Hoàn Tất & Biên Nhận Lệnh In', category: 'print_email', routeKey: 'printCompleted' },
  { index: 43, figmaId: '2:3282', title: 'Gửi Email Thành Công & Mã Vận Đơn Kiểm Toán', category: 'print_email', routeKey: 'emailSentSuccess' },
];

export const FigmaDirectoryScreen: React.FC<{
  onSelectScreen: (routeKey: string) => void;
  onClose: () => void;
}> = ({ onSelectScreen, onClose }) => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  const filtered = ALL_43_FIGMA_SCREENS.filter((s) => {
    const matchCat = cat === 'all' || s.category === cat;
    const matchText =
      !search.trim() ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.figmaId.includes(search) ||
      String(s.index) === search.trim();
    return matchCat && matchText;
  });

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Danh Mục Đầy Đủ 43 Màn Figma"
        subtitle="Hoàn thành 43/43 Frames + Admin/Doctor Portal + UI Kit"
        badgeText="100%"
        onBack={onClose}
      />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm theo tên màn hình hoặc số thứ tự (1 - 43)..."
          style={{ marginBottom: 12 }}
        />

        <SegmentedControl
          variant="chips"
          selectedKey={cat}
          onSelect={setCat}
          options={[
            { key: 'all', label: 'Tất cả (43)' },
            { key: 'core', label: 'Cốt lõi (10)' },
            { key: 'telehealth_family', label: 'Người thân & Video (6)' },
            { key: 'pharmacy', label: 'Thuốc & Giao hàng (8)' },
            { key: 'pki_tax', label: 'PKI, NEAC & Thuế (9)' },
            { key: 'print_email', label: 'AirPrint & Kế toán (10)' },
          ]}
          style={{ marginBottom: 14 }}
        />

        {filtered.map((item) => (
          <TouchableOpacity
            key={item.figmaId}
            activeOpacity={0.8}
            onPress={() => onSelectScreen(item.routeKey)}
            style={[styles.itemCard, SHADOWS.sm]}
          >
            <View style={styles.numCircle}>
              <Text style={styles.numText}>{item.index}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSub}>Figma Node ID: [{item.figmaId}]</Text>
            </View>
            <Badge label="Mở màn" variant="blue" />
            <Ionicons
              name="chevron-forward"
              size={16}
              color={COLORS.primary}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scrollPad: { padding: 16, paddingBottom: 32 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  numCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.primary,
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
