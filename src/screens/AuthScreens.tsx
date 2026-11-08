import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS, RADIUS, SHADOWS, TYPOGRAPHY } from '../theme';
import {
  AppButton,
  AppHeader,
  AppInput,
  Badge,
  SegmentedControl,
  AnimatedEntry,
  PressableScale,
  PulsingDot,
} from '../components';

export interface SplashScreenProps {
  onContinue: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onContinue }) => {
  const [logoScale] = useState(() => new Animated.Value(0.75));
  const [progressAnim] = useState(() => new Animated.Value(0.15));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.95,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start();
  }, [logoScale, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient colors={GRADIENTS.splashBg} style={styles.splashContainer}>
      {/* Top Subtle Trust Badge */}
      <AnimatedEntry delay={20} direction="down">
        <View style={[styles.splashTopPill, SHADOWS.sm]}>
          <PulsingDot color={COLORS.secondary} size={6} />
          <Text style={styles.splashTopPillText}>HỆ THỐNG Y TẾ KỸ THUẬT SỐ</Text>
        </View>
      </AnimatedEntry>

      {/* Center Identity Block */}
      <AnimatedEntry delay={40} direction="up" style={styles.splashCenter}>
        <Animated.View style={[styles.logoCircle, SHADOWS.lg, { transform: [{ scale: logoScale }] }]}>
          <Ionicons name="medical" size={44} color={COLORS.primary} />
          <View style={styles.sparkleBadge}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
        </Animated.View>

        <Text style={styles.brandName}>SmartClinic</Text>
        <Badge
          label="Trợ lý y tế thông minh AI"
          variant="blue"
          icon="sparkles"
          style={{ alignSelf: 'center', marginTop: 8 }}
        />

        <Text style={styles.tagline}>
          Đặt lịch khám dễ dàng – Chăm sóc sức{'\n'}khỏe thông minh
        </Text>

        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={15}
              color={COLORS.secondary}
            />
            <Text style={styles.trustText}>Bác sĩ chuyên khoa</Text>
          </View>
          <View style={styles.trustDividerDot} />
          <View style={styles.trustItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={COLORS.secondary}
            />
            <Text style={styles.trustText}>Bảo mật y tế</Text>
          </View>
        </View>
      </AnimatedEntry>

      {/* Bottom Loading & Compliance Block */}
      <AnimatedEntry delay={60} direction="up" style={styles.splashBottom}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
            <LinearGradient
              colors={GRADIENTS.primaryTeal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: '100%', height: '100%' }}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>Đang tải hồ sơ sức khỏe...</Text>

        <PressableScale onPress={onContinue} activeScale={0.95}>
          <View style={styles.enterBtn}>
            <Text style={styles.enterBtnText}>Bắt đầu trải nghiệm →</Text>
          </View>
        </PressableScale>

        <View style={styles.compliancePill}>
          <Ionicons
            name="shield-checkmark-outline"
            size={13}
            color={COLORS.secondary}
          />
          <Text style={styles.complianceText}>
            Phiên bản 2.4.0 • Tiêu chuẩn an toàn y tế Bộ Y tế
          </Text>
        </View>
      </AnimatedEntry>
    </LinearGradient>
  );
};

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, email: string) => void;
  onGoRegister: () => void;
  onBack?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoRegister,
  onBack,
}) => {
  const [email, setEmail] = useState('vu.nguyen@smartclinic.vn');
  const [password, setPassword] = useState('12345678');
  const [remember, setRemember] = useState(true);
  const [selectedRolePreset, setSelectedRolePreset] =
    useState<UserRole>('patient');

  const detectRoleFromEmail = (rawEmail: string): UserRole => {
    const lower = rawEmail.trim().toLowerCase();
    if (lower.includes('admin') || lower.includes('quantri')) {
      return 'admin';
    }
    if (
      lower.includes('bs') ||
      lower.includes('bacsi') ||
      lower.includes('doctor') ||
      lower.includes('trang') ||
      lower.includes('minh') ||
      lower.includes('duc') ||
      lower.includes('tuan')
    ) {
      return 'doctor';
    }
    return 'patient';
  };

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSelectPreset = (role: UserRole) => {
    setSelectedRolePreset(role);
    setEmailError('');
    setPasswordError('');
    if (role === 'admin') {
      setEmail('admin@smartclinic.vn');
      setPassword('admin123');
    } else if (role === 'doctor') {
      setEmail('bs.trang@smartclinic.vn');
      setPassword('doctor123');
    } else {
      setEmail('vu.nguyen@smartclinic.vn');
      setPassword('12345678');
    }
  };

  const handleLoginPress = () => {
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
    if (!password || password.length < 6) {
      setPasswordError('Mật khẩu cần tối thiểu 6 ký tự');
      return;
    }
    setEmailError('');
    setPasswordError('');
    const role = detectRoleFromEmail(email);
    onLoginSuccess(role, email);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenBg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Đăng Nhập"
        onBack={onBack}
        showProfileIcon
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <AnimatedEntry delay={40} direction="up">
          <View style={styles.authHero}>
            <View style={[styles.authLogoBox, SHADOWS.sm]}>
              <Ionicons name="medkit" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.authTitle}>Đăng nhập</Text>
            <Text style={styles.authSub}>
              Chào mừng bạn quay trở lại với{'\n'}SmartClinic
            </Text>
          </View>
        </AnimatedEntry>

        {/* Quick Role Account Switcher for Demo */}
        <AnimatedEntry delay={90} direction="up">
          <View style={styles.roleQuickBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.roleQuickTitle}>
                Chọn nhanh tài khoản phân quyền (Demo):
              </Text>
              <PulsingDot color={COLORS.secondary} size={5} />
            </View>
            <View style={styles.roleQuickButtons}>
              <PressableScale
                style={{ flex: 1 }}
                activeScale={0.93}
                onPress={() => handleSelectPreset('patient')}
              >
                <View
                  style={[
                    styles.roleChip,
                    selectedRolePreset === 'patient' && styles.roleChipActive,
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color={
                      selectedRolePreset === 'patient' ? '#FFFFFF' : COLORS.primary
                    }
                  />
                  <Text
                    style={[
                      styles.roleChipText,
                      selectedRolePreset === 'patient' && styles.roleChipTextActive,
                    ]}
                  >
                    Bệnh nhân
                  </Text>
                </View>
              </PressableScale>

              <PressableScale
                style={{ flex: 1 }}
                activeScale={0.93}
                onPress={() => handleSelectPreset('doctor')}
              >
                <View
                  style={[
                    styles.roleChip,
                    selectedRolePreset === 'doctor' && styles.roleChipActive,
                  ]}
                >
                  <Ionicons
                    name="medkit-outline"
                    size={14}
                    color={
                      selectedRolePreset === 'doctor' ? '#FFFFFF' : COLORS.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.roleChipText,
                      selectedRolePreset === 'doctor' && styles.roleChipTextActive,
                    ]}
                  >
                    Bác sĩ
                  </Text>
                </View>
              </PressableScale>

              <PressableScale
                style={{ flex: 1 }}
                activeScale={0.93}
                onPress={() => handleSelectPreset('admin')}
              >
                <View
                  style={[
                    styles.roleChip,
                    selectedRolePreset === 'admin' && styles.roleChipActive,
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={14}
                    color={
                      selectedRolePreset === 'admin' ? '#FFFFFF' : COLORS.textPrimary
                    }
                  />
                  <Text
                    style={[
                      styles.roleChipText,
                      selectedRolePreset === 'admin' && styles.roleChipTextActive,
                    ]}
                  >
                    Admin
                  </Text>
                </View>
              </PressableScale>
            </View>
          </View>
        </AnimatedEntry>

        {/* Form */}
        <AnimatedEntry delay={150} direction="up">
          <AppInput
            label="Email hoặc số điện thoại"
            leftIcon="at-outline"
            placeholder="Nhập email hoặc số điện thoại của bạn"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (emailError) setEmailError('');
              setSelectedRolePreset(detectRoleFromEmail(txt));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            error={emailError}
          />

          <AppInput
            label="Mật khẩu"
            leftIcon="lock-closed-outline"
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (passwordError) setPasswordError('');
            }}
            isPassword
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleLoginPress}
            error={passwordError}
          />

          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRemember(!remember)}
              accessibilityRole="checkbox"
              accessibilityLabel="Ghi nhớ đăng nhập"
              accessibilityState={{ checked: remember }}
            >
              <View
                style={[
                  styles.checkbox,
                  remember && styles.checkboxChecked,
                ]}
              >
                {remember && (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.rememberLabel}>Ghi nhớ đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Quên mật khẩu">
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <AppButton
            title="Đăng nhập"
            variant="gradient"
            size="lg"
            rightIcon="arrow-forward"
            onPress={handleLoginPress}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC TIẾP TỤC VỚI</Text>
            <View style={styles.dividerLine} />
          </View>

          <AppButton
            title="Đăng nhập bằng Google"
            variant="google"
            size="lg"
            onPress={handleLoginPress}
          />

          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthLabel}>Chưa có tài khoản? </Text>
            <TouchableOpacity
              onPress={onGoRegister}
              accessibilityRole="button"
              accessibilityLabel="Đăng ký ngay"
            >
              <Text style={styles.switchAuthLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityAssurance}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={COLORS.secondary}
            />
            <Text style={styles.securityText}>
              Thông tin được mã hóa bảo mật chuẩn y tế
            </Text>
          </View>
        </AnimatedEntry>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onGoLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onGoLogin,
}) => {
  const [fullName, setFullName] = useState('Nguyễn Văn Vũ');
  const [email, setEmail] = useState('vu.nguyen@smartclinic.vn');
  const [phone, setPhone] = useState('0912345678');
  const [dob, setDob] = useState('15/08/1992');
  const [gender, setGender] = useState('nam');
  const [password, setPassword] = useState('Smart123456');
  const [confirmPassword, setConfirmPassword] = useState('Smart123456');
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegisterSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Vui lòng nhập họ và tên đầy đủ';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Email không đúng định dạng';
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(cleanPhone)) {
      newErrors.phone = 'Số điện thoại cần đủ 10 số hợp lệ tại Việt Nam';
    }
    if (!password || password.length < 8) {
      newErrors.password = 'Mật khẩu cần tối thiểu 8 ký tự';
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    if (!agreed) {
      newErrors.agreed =
        'Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật y tế';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0 && agreed) {
      onRegisterSuccess();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenBg}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title="Đăng Ký"
        onBack={onGoLogin}
        showProfileIcon
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AnimatedEntry delay={40} direction="up">
          <Badge
            label="Bảo mật chuẩn Y tế"
            variant="teal"
            icon="shield-checkmark"
          />
          <Text style={[styles.authTitle, { textAlign: 'left', marginTop: 8 }]}>
            Tạo tài khoản
          </Text>
          <Text style={[styles.authSub, { textAlign: 'left', marginBottom: 14 }]}>
            Đăng ký để trải nghiệm dịch vụ y tế thông minh & đặt khám nhanh chóng
          </Text>

          {/* EHR Sync Highlight Box */}
          <View style={styles.ehrBanner}>
            <View style={styles.ehrBannerIcon}>
              <Ionicons name="shield-half-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ehrBannerTitle}>Hồ sơ bệnh án điện tử</Text>
              <Text style={styles.ehrBannerSub} numberOfLines={1}>
                Đồng bộ tự động với bác sĩ điều trị và bệnh viện
              </Text>
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={120} direction="up">
          <AppInput
            label="Họ và tên"
            leftIcon="person-outline"
            placeholder="Ví dụ: Nguyễn Văn Vũ"
            value={fullName}
            onChangeText={(txt) => {
              setFullName(txt);
              if (errors.fullName) setErrors((p) => ({ ...p, fullName: '' }));
            }}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            error={errors.fullName}
          />
          <AppInput
            label="Email"
            leftIcon="mail-outline"
            placeholder="example@email.com"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (errors.email) setErrors((p) => ({ ...p, email: '' }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            error={errors.email}
          />
          <AppInput
            label="Số điện thoại"
            leftIcon="call-outline"
            placeholder="0912 345 678"
            value={phone}
            onChangeText={(txt) => {
              setPhone(txt);
              if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
            }}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            returnKeyType="next"
            error={errors.phone}
          />

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 1 }}>
              <AppInput
                label="Ngày sinh"
                leftIcon="calendar-outline"
                placeholder="DD/MM/YYYY"
                value={dob}
                onChangeText={setDob}
                returnKeyType="next"
              />
            </View>
            <View style={{ flex: 1.15 }}>
              <Text style={styles.inputLabel}>Giới tính</Text>
              <SegmentedControl
                variant="primarySelect"
                selectedKey={gender}
                onSelect={setGender}
                options={[
                  { key: 'nam', label: 'Nam' },
                  { key: 'nu', label: 'Nữ' },
                  { key: 'khac', label: 'Khác' },
                ]}
              />
            </View>
          </View>

          <AppInput
            label="Mật khẩu"
            leftIcon="lock-closed-outline"
            placeholder="Tối thiểu 8 ký tự"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errors.password) setErrors((p) => ({ ...p, password: '' }));
            }}
            isPassword
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            error={errors.password}
          />
          <AppInput
            label="Xác nhận mật khẩu"
            leftIcon="lock-closed-outline"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChangeText={(txt) => {
              setConfirmPassword(txt);
              if (errors.confirmPassword)
                setErrors((p) => ({ ...p, confirmPassword: '' }));
            }}
            isPassword
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleRegisterSubmit}
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              const next = !agreed;
              setAgreed(next);
              if (next && errors.agreed) {
                setErrors((p) => ({ ...p, agreed: '' }));
              }
            }}
            accessibilityRole="checkbox"
            accessibilityLabel="Đồng ý điều khoản dịch vụ và chính sách bảo mật y tế"
            accessibilityState={{ checked: agreed }}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              Tôi đồng ý với{' '}
              <Text style={styles.switchAuthLink}>Điều khoản dịch vụ</Text> và{' '}
              <Text style={styles.switchAuthLink}>Chính sách bảo mật y tế</Text>{' '}
              của SmartClinic
            </Text>
          </TouchableOpacity>
          {errors.agreed ? (
            <Text
              style={{
                fontSize: TYPOGRAPHY.caption,
                color: COLORS.error,
                marginTop: -6,
                marginBottom: 10,
                fontWeight: '600',
              }}
            >
              {errors.agreed}
            </Text>
          ) : null}

          <AppButton
            title="Đăng ký"
            variant="primary"
            size="lg"
            leftIcon="person-add-outline"
            onPress={handleRegisterSubmit}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          <AppButton
            title="Đăng ký bằng Google"
            variant="google"
            size="lg"
            onPress={onRegisterSuccess}
          />

          <View style={styles.switchAuthRow}>
            <Text style={styles.switchAuthLabel}>Đã có tài khoản? </Text>
            <TouchableOpacity
              onPress={onGoLogin}
              accessibilityRole="button"
              accessibilityLabel="Đăng nhập ngay"
            >
              <Text style={styles.switchAuthLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </AnimatedEntry>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  splashTopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  splashTopPillText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.4,
  },
  splashCenter: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  brandName: {
    fontSize: TYPOGRAPHY.size.hero,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tagline: {
    fontSize: TYPOGRAPHY.size.md,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 14,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    gap: 10,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  trustDividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.switchTrackOff,
  },
  splashBottom: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    width: '55%',
    height: '100%',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 14,
  },
  enterBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    marginBottom: 14,
  },
  enterBtnText: {
    color: COLORS.textOnPrimary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '700',
  },
  compliancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  complianceText: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
  },
  screenBg: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 36,
  },
  authHero: {
    alignItems: 'center',
    marginVertical: 14,
  },
  authLogoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  authTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  authSub: {
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: 19,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  roleQuickBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  roleQuickTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  roleQuickButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  roleChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleChipText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleChipTextActive: {
    color: COLORS.textOnPrimary,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.switchTrackOff,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rememberLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  forgotText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginHorizontal: 10,
  },
  switchAuthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  switchAuthLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  switchAuthLink: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  securityAssurance: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: 14,
    gap: 6,
  },
  securityText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  ehrBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  ehrBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  ehrBannerTitle: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ehrBannerSub: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
});

