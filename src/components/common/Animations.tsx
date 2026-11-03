import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../theme';

// ==========================================
// 1. FADE IN & SLIDE UP ENTRY ANIMATION
// ==========================================
export interface AnimatedEntryProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'none';
  style?: StyleProp<ViewStyle>;
}

export const AnimatedEntry: React.FC<AnimatedEntryProps> = ({
  children,
  delay = 0,
  duration = 360,
  distance = 16,
  direction = 'up',
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(
    new Animated.Value(direction === 'up' ? distance : direction === 'down' ? -distance : 0)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translate, delay, duration, distance, direction]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: direction !== 'none' ? [{ translateY: translate }] : undefined,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// ==========================================
// 2. TACTILE PRESSABLE SCALE (Micro-interaction)
// ==========================================
export interface PressableScaleProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  activeScale?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: any;
}

export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  onPress,
  activeScale = 0.965,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: activeScale,
      useNativeDriver: true,
      speed: 35,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// ==========================================
// 3. PULSING STATUS DOT (Live radar indicator)
// ==========================================
export interface PulsingDotProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const PulsingDot: React.FC<PulsingDotProps> = ({
  color = COLORS.secondary,
  size = 8,
  style,
}) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const haloOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 2,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(haloOpacity, {
            toValue: 0,
            duration: 1300,
            useNativeDriver: true,
          }),
          Animated.timing(haloOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, haloOpacity]);

  return (
    <View style={[{ width: size * 2.2, height: size * 2.2, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Animated.View
        style={[
          styles.haloCircle,
          {
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: size * 1.1,
            backgroundColor: color,
            opacity: haloOpacity,
            transform: [{ scale: pulse }],
          },
        ]}
      />
      <View
        style={[
          styles.coreDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

// ==========================================
// 4. SHIMMER SKELETON LOADER
// ==========================================
export interface SkeletonBoxProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width,
  height,
  borderRadius = RADIUS.sm,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: COLORS.surfaceContainer,
          opacity: shimmer,
        },
        style,
      ]}
    />
  );
};

// Pre-assembled Doctor Card Skeleton
export const DoctorCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.skeletonDoctorCard, SHADOWS.sm, style]}>
    <View style={styles.skeletonRow}>
      <SkeletonBox width={68} height={68} borderRadius={RADIUS.md} />
      <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
        <SkeletonBox width="55%" height={12} />
        <SkeletonBox width="85%" height={16} />
        <SkeletonBox width="70%" height={12} />
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
      <SkeletonBox width="45%" height={14} />
      <SkeletonBox width={78} height={28} borderRadius={RADIUS.full} />
    </View>
  </View>
);

// Pre-assembled Appointment Card Skeleton
export const AppointmentCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.skeletonAppointmentCard, SHADOWS.sm, style]}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
      <SkeletonBox width={120} height={22} borderRadius={RADIUS.full} />
      <SkeletonBox width={90} height={22} borderRadius={RADIUS.full} />
    </View>
    <View style={styles.skeletonRow}>
      <SkeletonBox width={54} height={54} borderRadius={27} />
      <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
        <SkeletonBox width="70%" height={15} />
        <SkeletonBox width="50%" height={12} />
        <SkeletonBox width="60%" height={12} />
      </View>
    </View>
  </View>
);

// Pre-assembled Hospital Card Skeleton
export const HospitalCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.skeletonHospitalCard, SHADOWS.sm, style]}>
    <SkeletonBox width={76} height={76} borderRadius={RADIUS.md} style={{ marginRight: 12 }} />
    <View style={{ flex: 1, gap: 6 }}>
      <SkeletonBox width="80%" height={15} />
      <SkeletonBox width="95%" height={12} />
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
        <SkeletonBox width={50} height={16} borderRadius={RADIUS.xs} />
        <SkeletonBox width={45} height={16} borderRadius={RADIUS.xs} />
      </View>
    </View>
  </View>
);

// Pre-assembled Quick Services Grid Skeleton
export const QuickServicesSkeleton: React.FC = () => (
  <View style={styles.skeletonGrid}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <View key={i} style={[styles.skeletonServiceBox, SHADOWS.sm]}>
        <SkeletonBox width={38} height={38} borderRadius={12} style={{ marginBottom: 8 }} />
        <SkeletonBox width="70%" height={12} style={{ marginBottom: 4 }} />
        <SkeletonBox width="50%" height={9} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  haloCircle: {
    position: 'absolute',
  },
  coreDot: {
    zIndex: 1,
  },
  skeletonDoctorCard: {
    width: 275,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  skeletonAppointmentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: COLORS.borderSubtle,
    borderLeftColor: COLORS.secondary,
  },
  skeletonHospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  skeletonServiceBox: {
    width: '31.5%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
});
