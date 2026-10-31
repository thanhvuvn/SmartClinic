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
import { COLORS, GRADIENTS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';
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
      colors={GRADIENTS.heroCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, SHADOWS.md, style]}
    >
      <View style={styles.heroTopRow}>
        <Badge
          label="AI Powered • Chẩn đoán sơ bộ"
          variant="glass"
          icon="sparkles"
        />
        <Text style={styles.readyText}>24/7 Sẵn sàng</Text>
      </View>

      <Text style={styles.heroTitle}>Bạn đang gặp vấn đề sức khỏe gì?</Text>
      <Text style={styles.heroDesc}>
        Mô tả triệu chứng để AI phân tích và gợi ý chuyên khoa, bác sĩ phù hợp
        trong 30 giây.
      </Text>

      <View style={styles.heroBottomRow}>
        <AppButton
          title="Hỏi AI ngay"
          variant="white"
          size="md"
          leftIcon="sparkles"
          rightIcon="arrow-forward"
          fullWidth={false}
          onPress={onAskAIPress}
          style={styles.askBtn}
        />
        <View style={styles.accuracyRow}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#86F2E4" />
          <Text style={styles.accuracyText}>Độ chính xác 98%</Text>
        </View>
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
        <Ionicons name="sparkles" size={18} color={COLORS.secondary} />
      </View>
      <View style={styles.reminderContent}>
        <View style={styles.reminderTopRow}>
          <Text style={styles.reminderBadgeText}>TRỢ LÝ AI NHẮC NHỞ</Text>
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

export interface AIClinicalInsightCardProps {
  onAskAIPress?: () => void;
  style?: ViewStyle;
}

export const AIClinicalInsightCard: React.FC<AIClinicalInsightCardProps> = ({
  onAskAIPress,
  style,
}) => {
  return (
    <View style={[styles.insightCard, style]}>
      <View style={styles.insightHeader}>
        <View style={styles.insightLeft}>
          <View style={styles.insightIconBox}>
            <Ionicons name="bulb-outline" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.insightTitle}>Trợ lý AI Tóm tắt Bệnh án</Text>
        </View>
        <Badge label="Phân tích mới" variant="teal" icon="sparkles" />
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
          label="Tái khám: 12/11/2024 (sau 2 tuần)"
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
    padding: SPACING.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  readyText: {
    fontSize: TYPOGRAPHY.micro,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: TYPOGRAPHY.bodySm,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
    color: 'rgba(255,255,255,0.88)',
    marginBottom: SPACING.lg,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  askBtn: {
    paddingHorizontal: SPACING.lg,
  },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  accuracyText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
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
    flex: 1,
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

