import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS } from '../../theme';
import { Badge } from '../common/Badge';

export interface HeaderAction {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  showBadgeDot?: boolean;
}

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  onBack?: () => void;
  leftIconBox?: keyof typeof Ionicons.glyphMap;
  rightActions?: HeaderAction[];
  showProfileIcon?: boolean;
  onProfilePress?: () => void;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  onBack,
  leftIconBox,
  rightActions = [],
  showProfileIcon = false,
  onProfilePress,
  style,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.leftRow}>
        {onBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
        {leftIconBox && (
          <View style={styles.leftIconCircle}>
            <Ionicons name={leftIconBox} size={20} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.titleBlock}>
          <View style={styles.titleLine}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {badgeText && (
              <Badge
                label={badgeText}
                variant="teal"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightActions.map((act, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.iconBtn}
            onPress={act.onPress}
            activeOpacity={0.75}
          >
            <Ionicons name={act.icon} size={20} color={COLORS.textSecondary} />
            {act.showBadgeDot && <View style={styles.redDot} />}
          </TouchableOpacity>
        ))}

        {showProfileIcon && (
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={onProfilePress}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={17} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export interface HomeGreetingHeaderProps {
  userName: string;
  greetingSubtitle?: string;
  avatarUrl: string;
  onChatPress?: () => void;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export const HomeGreetingHeader: React.FC<HomeGreetingHeaderProps> = ({
  userName,
  greetingSubtitle = 'Hôm nay bạn cảm thấy thế nào?',
  avatarUrl,
  onChatPress,
  onNotificationPress,
  onAvatarPress,
}) => {
  return (
    <View style={styles.greetingContainer}>
      <TouchableOpacity
        style={styles.greetingLeft}
        onPress={onAvatarPress}
        activeOpacity={0.85}
      >
        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>
        <View>
          <Text style={styles.greetingTitle}>Xin chào, {userName} 👋</Text>
          <Text style={styles.greetingSub}>{greetingSubtitle}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightRow}>
        <TouchableOpacity
          style={[styles.circleActionBtn, SHADOWS.sm]}
          onPress={onChatPress}
        >
          <Ionicons
            name="chatbubble-outline"
            size={19}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.circleActionBtn, SHADOWS.sm]}
          onPress={onNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={COLORS.textPrimary}
          />
          <View style={styles.redDotNotify} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  leftIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  profileCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  greetingSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  circleActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  redDotNotify: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

