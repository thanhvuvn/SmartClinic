import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme';
import { AppButton } from '../common/AppButton';

export interface StickyBottomBarProps {
  topLabel: string;
  topLabelIcon?: keyof typeof Ionicons.glyphMap;
  priceLabel?: string;
  priceValue: string;
  buttonTitle: string;
  onButtonPress?: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  topLabel,
  topLabelIcon,
  priceLabel,
  priceValue,
  buttonTitle,
  onButtonPress,
}) => {
  return (
    <View style={[styles.container, SHADOWS.lg]}>
      <View style={styles.leftCol}>
        <View style={styles.topLabelRow}>
          {topLabelIcon && (
            <Ionicons
              name={topLabelIcon}
              size={14}
              color={COLORS.primary}
              style={{ marginRight: 4 }}
            />
          )}
          <Text
            style={[
              styles.topLabel,
              topLabelIcon && { color: COLORS.primary, fontWeight: '700' },
            ]}
          >
            {topLabel}
          </Text>
        </View>
        <View style={styles.priceRow}>
          {priceLabel ? (
            <Text style={styles.pricePrefix}>{priceLabel} </Text>
          ) : null}
          <Text style={styles.priceValue}>{priceValue}</Text>
        </View>
      </View>

      <AppButton
        title={buttonTitle}
        rightIcon="arrow-forward"
        variant="primary"
        size="md"
        fullWidth={false}
        style={styles.ctaBtn}
        onPress={onButtonPress}
      />
    </View>
  );
};

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <View style={styles.stepContainer}>
      {steps.map((label, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        return (
          <React.Fragment key={label}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCircleCompleted,
                  isCurrent && styles.stepCircleCurrent,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      isCurrent && styles.stepNumberCurrent,
                    ]}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isCompleted && { color: COLORS.secondary, fontWeight: '700' },
                  isCurrent && { color: COLORS.primary, fontWeight: '700' },
                ]}
              >
                {label}
              </Text>
            </View>
            {idx < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  idx < currentStep && styles.stepLineCompleted,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  leftCol: {
    flex: 1,
    paddingRight: 12,
  },
  topLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topLabel: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  pricePrefix: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  ctaBtn: {
    minWidth: 155,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    width: 82,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.secondary,
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stepNumberCurrent: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.surfaceContainer,
    marginTop: 14,
    marginHorizontal: -10,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.primary,
  },
});

