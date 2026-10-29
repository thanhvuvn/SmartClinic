import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS } from '../../theme';
import { DoctorItem, PrescriptionDrug } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';

export interface ActivePrescriptionCardProps {
  doctor: DoctorItem;
  prescriptionCode: string;
  date: string;
  drugs: PrescriptionDrug[];
  onViewOriginal?: () => void;
  onBuyMedicine?: () => void;
  style?: ViewStyle;
}

export const ActivePrescriptionCard: React.FC<ActivePrescriptionCardProps> = ({
  doctor,
  prescriptionCode,
  date,
  drugs,
  onViewOriginal,
  onBuyMedicine,
  style,
}) => {
  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      {/* Doctor & Prescription Code */}
      <View style={styles.headerRow}>
        <Image source={{ uri: doctor.avatar }} style={styles.docAvatar} />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.docName}>{doctor.name}</Text>
          <Text style={styles.docSub}>
            Chuyên khoa {doctor.specialty} • BV ĐHYD
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.rxCode}>{prescriptionCode}</Text>
          <Text style={styles.rxDate}>{date}</Text>
        </View>
      </View>

      {/* Drug items */}
      {drugs.map((drug) => (
        <View key={drug.id} style={styles.drugBox}>
          <View style={styles.drugTop}>
            <View style={styles.drugIconWrap}>
              <Ionicons name="medkit-outline" size={15} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.drugName}>{drug.name}</Text>
              <Text style={styles.drugIndication}>{drug.indication}</Text>
            </View>
            <Text style={styles.drugQty}>{drug.quantity}</Text>
          </View>

          <View style={styles.drugTagsRow}>
            <View
              style={[
                styles.dosageChip,
                drug.isWarning && { backgroundColor: COLORS.errorContainer },
              ]}
            >
              <Text
                style={[
                  styles.dosageChipText,
                  drug.isWarning && { color: COLORS.error },
                ]}
              >
                {drug.dosageTag}
              </Text>
            </View>
            <View style={styles.instructionChip}>
              <Text style={styles.instructionChipText}>
                {drug.instructionTag}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Pill Reminder Strip */}
      <View style={styles.reminderBar}>
        <View style={styles.reminderLeft}>
          <Ionicons name="alarm-outline" size={18} color={COLORS.secondary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.reminderTitle}>Nhắc uống thuốc</Text>
            <Text style={styles.reminderSub}>Đã bật lịch 08:00 & 21:00</Text>
          </View>
        </View>
        <Badge label="Bật" variant="teal" />
      </View>

      {/* Dual Action Buttons */}
      <View style={styles.actionRow}>
        <AppButton
          title="Xem toa gốc"
          variant="tonal"
          size="md"
          leftIcon="eye-outline"
          fullWidth={false}
          style={{ flex: 1 }}
          onPress={onViewOriginal}
        />
        <AppButton
          title="Mua thuốc giao nhanh"
          variant="secondary"
          size="md"
          leftIcon="bicycle-outline"
          fullWidth={false}
          style={{ flex: 1.25 }}
          onPress={onBuyMedicine}
        />
      </View>
    </View>
  );
};

export interface LabImagingCardProps {
  style?: ViewStyle;
}

export const LabImagingCard: React.FC<LabImagingCardProps> = ({ style }) => {
  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      <View style={styles.labTopRow}>
        <View style={styles.labIconCircle}>
          <Ionicons name="scan-outline" size={18} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Badge label="Chẩn đoán hình ảnh" variant="surface" />
          <Text style={styles.labTitle}>Chụp MRI Sọ não (Không cản từ)</Text>
        </View>
        <Badge label="Bình thường" variant="teal" />
      </View>

      <View style={styles.conclusionBox}>
        <Text style={styles.conclusionHeader}>Kết luận chuyên khoa:</Text>
        <Text style={styles.conclusionBody}>
          Nhu mô não không thấy tổn thương khu trú, hệ thống não thất cân đối,
          không có dấu hiệu nhồi máu não hay xuất huyết.
        </Text>
      </View>

      <View style={styles.labFooterRow}>
        <View style={styles.signatureRow}>
          <Ionicons
            name="checkmark-done-circle-outline"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.signatureText}>Có chữ ký số bác sĩ CĐHA</Text>
        </View>

        <View style={styles.labBtnsRow}>
          <TouchableOpacity style={styles.dicomBtn}>
            <Ionicons name="document-outline" size={14} color={COLORS.primary} />
            <Text style={styles.dicomBtnText}>Xem DICOM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pdfBtn}>
            <Ionicons name="download-outline" size={14} color="#FFFFFF" />
            <Text style={styles.pdfBtnText}>Bản PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export interface MedicalHistoryTimelineProps {
  style?: ViewStyle;
}

export const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({
  style,
}) => {
  const items = [
    {
      date: '29/10/2024',
      tag: 'Lần khám mới nhất',
      title: 'Khám Chuyên khoa Thần kinh',
      doctor: 'Bác sĩ: TS. BS. Lê Thu Trang',
      summaryLabel: 'Chẩn đoán sơ bộ & kết luận:',
      summaryValue:
        'Đau đầu căng thẳng (Tension headache) / Rối loạn vận mạch não nhẹ',
      active: true,
    },
    {
      date: '15/06/2024',
      tag: 'Hoàn thành',
      title: 'Khám Mắt tổng quát & Đo khúc xạ',
      doctor: 'Bác sĩ: ThS. BS. Nguyễn Minh Đức',
      summaryLabel: 'Kết quả:',
      summaryValue:
        'Cận thị MP: -1.75 D / MT: -1.50 D, Đáy mắt bình thường',
      active: false,
    },
  ];

  return (
    <View style={style}>
      {items.map((item, idx) => (
        <View key={item.date} style={styles.timelineRow}>
          <View style={styles.timelineRail}>
            <View
              style={[
                styles.timelineDot,
                item.active ? styles.timelineDotActive : styles.timelineDotMuted,
              ]}
            />
            {idx < items.length - 1 && <View style={styles.timelineLine} />}
          </View>

          <View style={[styles.timelineCard, SHADOWS.sm]}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineDate}>{item.date}</Text>
              <Badge label={item.tag} variant="surface" />
            </View>
            <Text style={styles.timelineTitle}>{item.title}</Text>
            <Text style={styles.timelineDoc}>{item.doctor}</Text>
            <View style={styles.timelineSummaryBox}>
              <Text style={styles.timelineSummaryLabel}>
                {item.summaryLabel}
              </Text>
              <Text style={styles.timelineSummaryVal}>{item.summaryValue}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2FF',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  docAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  docName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  docSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rxCode: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  rxDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  drugBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
  },
  drugTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  drugIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  drugName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  drugIndication: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  drugQty: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  drugTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 36,
  },
  dosageChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  dosageChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  instructionChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    flex: 1,
  },
  instructionChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reminderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reminderSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  labTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  conclusionBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12,
  },
  conclusionHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  conclusionBody: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
  labFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  signatureText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  labBtnsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dicomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  dicomBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  pdfBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.primary,
  },
  timelineDotMuted: {
    backgroundColor: '#CBD5E1',
    borderColor: '#E2E8F0',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.outlineVariant,
    marginVertical: 4,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 14,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  timelineDoc: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  timelineSummaryBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.sm,
    padding: 10,
  },
  timelineSummaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  timelineSummaryVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});

