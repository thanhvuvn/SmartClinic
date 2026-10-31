import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, TOUCH } from '../../theme';

export interface AppInputProps extends TextInputProps {
  label?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  error,
  containerStyle,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputBox,
          focused && styles.inputBoxFocused,
          error ? styles.inputBoxError : null,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? COLORS.primary : COLORS.textMuted}
            style={styles.leftIcon}
            importantForAccessibility="no"
          />
        ) : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={secure}
          accessibilityLabel={label || rest.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setSecure(!secure)}
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'}
            hitSlop={TOUCH.hitSlopMd}
          >
            <Ionicons
              name={secure ? 'eye-outline' : 'eye-off-outline'}
              size={19}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            accessibilityRole="button"
            accessibilityLabel={label || 'Tác vụ ô nhập'}
            hitSlop={TOUCH.hitSlopMd}
          >
            <Ionicons name={rightIcon} size={19} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Bạn muốn tìm bác sĩ, chuyên khoa hoặc triệu chứng...',
  onFilterPress,
  style,
}) => {
  return (
    <View style={[styles.searchContainer, SHADOWS.sm, style]}>
      <Ionicons
        name="search-outline"
        size={20}
        color={COLORS.textSecondary}
        importantForAccessibility="no"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        returnKeyType="search"
        style={styles.searchInput}
      />
      <TouchableOpacity
        style={styles.filterBtn}
        onPress={onFilterPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="Bộ lọc tìm kiếm"
        hitSlop={TOUCH.hitSlopSm}
      >
        <Ionicons name="options-outline" size={18} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputBox: {
    minHeight: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  inputBoxFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputBoxError: {
    borderColor: COLORS.error,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  searchContainer: {
    minHeight: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginHorizontal: 10,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

