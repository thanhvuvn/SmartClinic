import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, TOUCH } from '../../theme';
import { DoctorItem } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';
import {
  AnimatedEntry,
  PressableScale,
  PulsingDot,
  TypingDots,
} from '../common/Animations';

export const AIMedicalTriageBanner: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <AnimatedEntry delay={40} direction="down">
    <View style={[styles.triageContainer, style]}>
      <View style={styles.triagePill}>
        <PulsingDot color={COLORS.secondaryDark} size={6} />
        <Text style={styles.triagePillText}>
          Hỗ trợ Sàng lọc Triệu chứng • Thông tin tham khảo ban đầu
        </Text>
      </View>
      <Text style={styles.triageSub}>
        Trợ lý AI gợi ý chuyên khoa phù hợp, không thay thế bác sĩ khám bệnh
      </Text>
    </View>
  </AnimatedEntry>
);

export interface AIChatBubbleProps {
  sender: 'ai' | 'user';
  message: string;
  time: string;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({
  sender,
  message,
  time,
}) => {
  const isAI = sender === 'ai';
  return (
    <AnimatedEntry delay={50} distance={10} direction={isAI ? 'up' : 'up'}>
      <View style={[styles.msgRow, !isAI && styles.msgRowUser]}>
        {isAI && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={16} color={COLORS.secondary} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isAI ? styles.bubbleAI : styles.bubbleUser,
          ]}
        >
          <Text style={[styles.msgText, !isAI && styles.msgTextUser]}>
            {message}
          </Text>
          <Text style={[styles.msgTime, !isAI && styles.msgTimeUser]}>{time}</Text>
        </View>
        {!isAI && (
          <View style={styles.userAvatar}>
            <Ionicons name="person-outline" size={15} color="#FFFFFF" />
          </View>
        )}
      </View>
    </AnimatedEntry>
  );
};

export const AITypingIndicator: React.FC = () => (
  <AnimatedEntry delay={20} distance={8} direction="up">
    <View style={styles.msgRow}>
      <View style={styles.botAvatar}>
        <Ionicons name="sparkles" size={16} color={COLORS.secondary} />
      </View>
      <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 10, paddingHorizontal: 12 }]}>
        <TypingDots color={COLORS.secondaryDark} />
      </View>
    </View>
  </AnimatedEntry>
);

export interface AIClinicalResponseCardProps {
  doctors: DoctorItem[];
  onBookDoctor?: (doc: DoctorItem) => void;
}

export const AIClinicalResponseCard: React.FC<AIClinicalResponseCardProps> = ({
  doctors,
  onBookDoctor,
}) => {
  return (
    <View style={styles.msgRow}>
      <View style={styles.botAvatar}>
        <Ionicons name="sparkles" size={16} color={COLORS.secondary} />
      </View>

      <View style={styles.clinicalContainer}>
        {/* Preliminary Analysis Box */}
        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Ionicons name="shield-half-outline" size={16} color={COLORS.primary} />
            <Text style={styles.analysisTitle}>Sàng lọc triệu chứng tham khảo</Text>
          </View>
          <Text style={styles.analysisBody}>
            Dựa trên triệu chứng đau nửa đầu thái dương kèm chóng mặt kéo dài 2
            ngày và tăng khi tập trung màn hình, có thể liên quan đến căng thẳng
            thần kinh hoặc rối loạn tuần hoàn não thoáng qua. Bạn nên khám chuyên
            khoa để bác sĩ kiểm tra trực tiếp.
          </Text>
        </View>

        {/* Recommended Specialty */}
        <View style={styles.analysisCard}>
          <Text style={styles.sectionCap}>CHUYÊN KHOA KHUYẾN NGHỊ</Text>
          <View style={styles.specialtyRecommendBox}>
            <View style={styles.specIconBox}>
              <Ionicons name="pulse" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={styles.specTitle}>Nội Thần Kinh</Text>
              <Text style={styles.specSub} numberOfLines={1}>
                Đau đầu, chóng mặt, rối loạn tiền đình
              </Text>
            </View>
            <Badge label="Chuyên khoa gợi ý" variant="teal" />
          </View>
        </View>

        {/* Best Matched Doctors */}
        <View style={styles.recHeaderRow}>
          <Text style={styles.sectionCap}>BÁC SĨ CHUYÊN KHOA PHÙ HỢP NHẤT</Text>
          <Text style={styles.recCount}>{doctors.length} gợi ý</Text>
        </View>

        {doctors.map((doc, index) => (
          <View key={doc.id} style={[styles.aiDocCard, SHADOWS.sm]}>
            <View style={styles.aiDocTop}>
              <Image source={{ uri: doc.avatar }} style={styles.aiDocAvatar} />
              <View style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                <View style={styles.aiDocNameRow}>
                  <Text
                    style={[styles.aiDocName, { flexShrink: 1 }]}
                    numberOfLines={1}
                  >
                    {doc.name}
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.aiDocSub}>{doc.degree}</Text>
                <Text style={styles.aiDocSub}>{doc.hospital}</Text>
                <View style={styles.aiDocMeta}>
                  <Ionicons name="star" size={12} color={COLORS.warning} />
                  <Text style={styles.aiDocRating}>{doc.rating}</Text>
                  <Text style={styles.aiDocReviews}>
                    ({doc.reviewCount}+ đánh giá) • {doc.experienceYears} năm KN
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.aiDocFeeRow}>
              <View>
                <Text style={styles.aiFeeLabel}>Phí tư vấn</Text>
                <Text style={styles.aiFeeVal}>{doc.fee}</Text>
              </View>
              <Badge
                label={doc.availableText}
                variant={index === 0 ? 'teal' : 'surface'}
                showDot={index === 0}
              />
            </View>

            <AppButton
              title={
                index === 0 ? 'Đặt lịch khám ngay' : 'Xem thông tin & Đặt lịch'
              }
              variant={index === 0 ? 'primary' : 'tonal'}
              size="sm"
              leftIcon="calendar-outline"
              onPress={() => onBookDoctor?.(doc)}
            />
          </View>
        ))}

        {/* Medical Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="warning-outline" size={15} color={COLORS.warningText} />
          <Text style={styles.disclaimerText}>
            Lưu ý: Kết quả phân tích từ AI chỉ mang tính chất tham khảo định
            hướng chuyên khoa, không thay thế chẩn đoán lâm sàng của bác sĩ
            chuyên môn.
          </Text>
        </View>
      </View>
    </View>
  );
};

export interface QuickPromptChipsProps {
  prompts: { label: string; icon: keyof typeof Ionicons.glyphMap; danger?: boolean }[];
  onSelectPrompt?: (label: string) => void;
}

export const QuickPromptChips: React.FC<QuickPromptChipsProps> = ({
  prompts,
  onSelectPrompt,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.promptsRow}
  >
    {prompts.map((p) => (
      <PressableScale
        key={p.label}
        activeScale={0.93}
        onPress={() => onSelectPrompt?.(p.label)}
        accessibilityRole="button"
        accessibilityLabel={p.label}
      >
        <View style={[styles.promptChip, p.danger && styles.promptChipDanger]}>
          <Ionicons
            name={p.icon}
            size={14}
            color={p.danger ? COLORS.error : COLORS.primary}
            importantForAccessibility="no"
          />
          <Text
            style={[
              styles.promptChipText,
              p.danger && { color: COLORS.error },
            ]}
          >
            {p.label}
          </Text>
        </View>
      </PressableScale>
    ))}
  </ScrollView>
);

export interface ChatBottomInputBarProps {
  value: string;
  onChangeText: (val: string) => void;
  onSend: () => void;
}

export const ChatBottomInputBar: React.FC<ChatBottomInputBarProps> = ({
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <View style={styles.chatInputBar}>
      <TouchableOpacity
        style={styles.attachBtn}
        accessibilityRole="button"
        accessibilityLabel="Đính kèm tệp hoặc hình ảnh"
        hitSlop={TOUCH.hitSlopSm}
      >
        <Ionicons name="attach-outline" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.attachBtn}
        accessibilityRole="button"
        accessibilityLabel="Nhập bằng giọng nói"
        hitSlop={TOUCH.hitSlopSm}
      >
        <Ionicons name="mic-outline" size={19} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <View style={styles.chatTextInputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Mô tả triệu chứng hoặc đặt câu hỏi..."
          placeholderTextColor={COLORS.placeholder}
          accessibilityLabel="Nhập nội dung tin nhắn"
          returnKeyType="send"
          onSubmitEditing={onSend}
          style={styles.chatTextInput}
        />
      </View>
      <TouchableOpacity
        style={[styles.sendBtn, SHADOWS.sm]}
        onPress={onSend}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Gửi tin nhắn"
        hitSlop={TOUCH.hitSlopSm}
      >
        <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  triageContainer: {
    marginBottom: 14,
  },
  triagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tintTeal,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  triagePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.secondaryDark,
    flex: 1,
  },
  triageSub: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.tintTeal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.lg,
    padding: 14,
  },
  bubbleAI: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  msgText: {
    fontSize: 14.5,
    lineHeight: 21,
    color: COLORS.textPrimary,
  },
  msgTextUser: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: 12,
    color: COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  msgTimeUser: {
    color: 'rgba(255,255,255,0.75)',
  },
  clinicalContainer: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: 12,
  },
  analysisCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  analysisTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  analysisBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  sectionCap: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  specialtyRecommendBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  specIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  specSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  recHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  recCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  aiDocCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
  },
  aiDocTop: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  aiDocAvatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
  },
  aiDocNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiDocName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  aiDocSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aiDocMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  aiDocRating: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.warning,
  },
  aiDocReviews: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  aiDocFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 10,
  },
  aiFeeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  aiFeeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.sm,
    padding: 10,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: COLORS.textSecondary,
  },
  promptsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH.min,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  promptChipDanger: {
    backgroundColor: '#FFF5F5',
    borderColor: COLORS.errorContainer,
  },
  promptChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  attachBtn: {
    width: TOUCH.min,
    height: TOUCH.min,
    borderRadius: TOUCH.min / 2,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTextInputWrap: {
    flex: 1,
    minHeight: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  chatTextInput: {
    fontSize: 13.5,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

