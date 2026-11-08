import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';

export interface AIHeroBannerProps {
  onAskAIPress?: () => void;
  style?: ViewStyle;
}

export const AIHeroBanner: React.FC<AIHeroBannerProps> = ({
  onAskAIPress,
  style,
}) => {
  return (
    <LinearGradient
      colors={['#00476E', '#006194', '#006A61']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, SHADOWS.md, style]}
    >
      <View style={styles.heroCompactRow}>
        <View style={styles.heroCompactLeft}>
          <Badge
            label="Hỗ trợ sàng lọc triệu chứng"
            variant="glass"
            icon="medkit-outline"
            style={{ marginBottom: 6 }}
          />
          <Text style={styles.heroTitle}>
            Gợi ý chuyên khoa tham khảo từ triệu chứng
          </Text>
        </View>
        <AppButton
          title="Hỏi AI"
          variant="white"
          size="sm"
          leftIcon="chatbubble-ellipses-outline"
          fullWidth={false}
          onPress={onAskAIPress}
          style={styles.askBtn}
        />
      </View>
    </LinearGradient>
  );
};

export interface SmartPromoBannerProps {
  onPress?: () => void;
  style?: ViewStyle;
}

export const SmartPromoBanner: React.FC<SmartPromoBannerProps> = ({
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Đặt khám tại nhà và tại viện, hỗ trợ BHYT 100%"
      style={[styles.promoCard, SHADOWS.sm, style]}
    >
      <View
        style={styles.promoIconBox}
        importantForAccessibility="no-hide-descendants"
      >
        <Ionicons name="shield-checkmark" size={22} color={COLORS.secondary} />
      </View>
      <View style={styles.promoContent}>
        <View style={styles.promoHeaderRow}>
          <Text style={styles.promoTitle}>Đặt khám tại nhà & tại viện</Text>
          <Badge label="BHYT 100%" variant="teal" />
        </View>
        <Text style={styles.promoSub}>
          Hỗ trợ thông tuyến bảo hiểm y tế, miễn phí đặt lịch trước.
        </Text>
      </View>
      <View
        style={styles.promoChevron}
        importantForAccessibility="no-hide-descendants"
      >
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

export interface AIReminderCardProps {
  style?: ViewStyle;
}

export const AIReminderCard: React.FC<AIReminderCardProps> = ({ style }) => {
  return (
    <View style={[styles.reminderCard, style]}>
      <View style={styles.reminderIconCircle}>
        <Ionicons name="notifications-outline" size={18} color={COLORS.secondary} />
      </View>
      <View style={styles.reminderContent}>
        <View style={styles.reminderTopRow}>
          <Text style={styles.reminderBadgeText}>NHẮC NHỞ LỊCH KHÁM</Text>
          <View style={styles.greenDot} />
          <Text style={styles.reminderTimeText}>Hôm nay</Text>
        </View>
        <Text style={styles.reminderBody}>
          Vui lòng chuẩn bị sẵn{' '}
          <Text style={styles.highlightText}>CCCD gắn chip</Text> và{' '}
          <Text style={styles.highlightText}>kết quả chụp MRI cũ</Text> cho buổi
          khám Thần kinh lúc 09:30 sáng nay.
        </Text>
      </View>
    </View>
  );
};

const formatRelativeDay = (offsetDays: number): string => {
  const target = new Date();
  target.setDate(target.getDate() + offsetDays);
  const dd = String(target.getDate()).padStart(2, '0');
  const mm = String(target.getMonth() + 1).padStart(2, '0');
  const yyyy = target.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export interface AIClinicalInsightCardProps {
  onAskAIPress?: () => void;
  style?: ViewStyle;
}

export const AIClinicalInsightCard: React.FC<AIClinicalInsightCardProps> = ({
  onAskAIPress,
  style,
}) => {
  const recentExamDate = formatRelativeDay(-2);
  const followUpDate = formatRelativeDay(12);

  return (
    <View style={[styles.insightCard, style]}>
      <View style={styles.insightHeader}>
        <View style={styles.insightLeft}>
          <View style={styles.insightIconBox}>
            <Ionicons name="bulb-outline" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.insightTitle}>Tóm tắt Hồ sơ Bệnh án</Text>
            <Text style={styles.insightSourceText}>
              Tóm tắt từ kết luận khám gần nhất ({recentExamDate}) của TS. BS. Lê Thu Trang (Khoa Nội Thần Kinh)
            </Text>
          </View>
        </View>
        <Badge label="Nguồn Bác sĩ" variant="teal" icon="document-text-outline" />
      </View>

      <Text style={styles.insightParagraph}>
        Các chỉ số sinh hoá và MRI não đều bình thường. Tình trạng đau đầu do
        căng thẳng công việc đang đáp ứng tốt với liệu trình điều trị hiện tại.
      </Text>

      <View style={styles.insightTagsCol}>
        <Badge
          label="Cảnh báo: Dị ứng Penicillin"
          variant="danger"
          icon="warning-outline"
        />
        <Badge
          label={`Tái khám: ${followUpDate} (sau 2 tuần)`}
          variant="blue"
          icon="calendar-outline"
        />
      </View>

      <AppButton
        title="Hỏi AI về hồ sơ bệnh án của bạn"
        variant="primary"
        size="md"
        leftIcon="chatbubble-ellipses-outline"
        onPress={onAskAIPress}
        style={{ marginTop: 12 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  heroCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  heroCompactLeft: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
  },
  askBtn: {
    paddingHorizontal: SPACING.md,
    flexShrink: 0,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  promoIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.tintTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  promoContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.sm,
  },
  promoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  promoTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  promoSub: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
  },
  promoChevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  reminderIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  reminderContent: {
    flex: 1,
    minWidth: 0,
  },
  reminderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.xs,
  },
  reminderBadgeText: {
    fontSize: TYPOGRAPHY.micro,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  greenDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 6,
  },
  reminderTimeText: {
    fontSize: TYPOGRAPHY.micro,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reminderBody: {
    fontSize: TYPOGRAPHY.bodySm,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.textPrimary,
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  insightCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 170,
  },
  insightIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    flexShrink: 0,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  insightSourceText: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    marginTop: 2,
  },
  insightParagraph: {
    fontSize: TYPOGRAPHY.bodySm,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  insightTagsCol: {
    gap: SPACING.sm,
  },
});

