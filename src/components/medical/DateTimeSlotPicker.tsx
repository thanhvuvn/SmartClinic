import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS } from '../../theme';
import { DaySlotItem, TimeSlotItem } from '../../data/mockData';

export interface HorizontalDateSelectorProps {
  days: DaySlotItem[];
  selectedDayId: string;
  onSelectDay: (id: string) => void;
  style?: ViewStyle;
}

export const HorizontalDateSelector: React.FC<HorizontalDateSelectorProps> = ({
  days,
  selectedDayId,
  onSelectDay,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.daysRow, style]}
    >
      {days.map((day) => {
        const isSelected = day.id === selectedDayId;
        const isFull = day.isFull;
        return (
          <TouchableOpacity
            key={day.id}
            activeOpacity={0.8}
            disabled={isFull}
            onPress={() => onSelectDay(day.id)}
            accessibilityRole="button"
            accessibilityLabel={`${day.dayLabel}, ngày ${day.dateNumber}, ${
              isFull ? 'Kín lịch' : `Còn ${day.slotsAvailable} chỗ`
            }`}
            accessibilityState={{ selected: isSelected, disabled: !!isFull }}
            style={[
              styles.dayCard,
              isSelected && [styles.dayCardSelected, SHADOWS.md],
              isFull && styles.dayCardFull,
            ]}
          >
            {day.badge && (
              <View style={styles.todayPill}>
                <Text style={styles.todayPillText}>{day.badge}</Text>
              </View>
            )}
            <Text
              style={[
                styles.dayLabel,
                isSelected && styles.dayLabelSelected,
                isFull && styles.dayTextDisabled,
              ]}
            >
              {day.dayLabel}
            </Text>
            <Text
              style={[
                styles.dateNum,
                isSelected && styles.dateNumSelected,
                isFull && styles.dayTextDisabled,
              ]}
            >
              {day.dateNumber}
            </Text>
            <Text
              style={[
                styles.slotsStatus,
                isSelected && styles.slotsStatusSelected,
                isFull && styles.slotsStatusFull,
              ]}
            >
              {isFull ? 'Kín lịch' : `Còn ${day.slotsAvailable} chỗ`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export interface TimeSlotGridProps {
  slots: TimeSlotItem[];
  selectedSlotId: string;
  onSelectSlot: (slot: TimeSlotItem) => void;
  style?: ViewStyle;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  style,
}) => {
  const morningSlots = slots.filter((s) => s.period === 'morning');
  const afternoonSlots = slots.filter((s) => s.period === 'afternoon');

  const renderSlot = (slot: TimeSlotItem) => {
    const isBooked = slot.status === 'booked';
    const isSelected = slot.id === selectedSlotId;
    const isFast = slot.status === 'fast' && !isSelected;

    return (
      <TouchableOpacity
        key={slot.id}
        disabled={isBooked}
        activeOpacity={0.8}
        onPress={() => onSelectSlot(slot)}
        accessibilityRole="button"
        accessibilityLabel={`Khung giờ ${slot.time}`}
        accessibilityState={{ selected: isSelected, disabled: isBooked }}
        style={[
          styles.slotBtn,
          isBooked && styles.slotBooked,
          isSelected && [styles.slotSelected, SHADOWS.sm],
          isFast && styles.slotFast,
        ]}
      >
        <Text
          style={[
            styles.slotTimeText,
            isBooked && styles.slotTimeBooked,
            isSelected && styles.slotTimeSelected,
            isFast && styles.slotTimeFast,
          ]}
        >
          {slot.time}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle-outline"
            size={12}
            color="#FFFFFF"
            style={styles.slotCornerIcon}
          />
        )}
        {isFast && (
          <Ionicons
            name="flash"
            size={11}
            color={COLORS.secondary}
            style={styles.slotCornerIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.gridCard, SHADOWS.sm, style]}>
      <Text style={styles.gridMainTitle}>Khung giờ khám khả dụng</Text>
      <View style={styles.noteRow}>
        <Ionicons name="time-outline" size={14} color={COLORS.primary} />
        <Text style={styles.noteText}>
          Vui lòng đến trước 15 phút để làm thủ tục
        </Text>
      </View>

      {/* Morning */}
      <View style={styles.periodHeader}>
        <Ionicons name="sunny-outline" size={16} color={COLORS.primary} />
        <Text style={styles.periodTitle}>Buổi sáng (08:00 - 11:30)</Text>
      </View>
      <View style={styles.slotsWrap}>{morningSlots.map(renderSlot)}</View>

      {/* Afternoon */}
      <View style={[styles.periodHeader, { marginTop: 14 }]}>
        <Ionicons name="partly-sunny-outline" size={16} color={COLORS.primary} />
        <Text style={styles.periodTitle}>Buổi chiều (13:30 - 17:00)</Text>
      </View>
      <View style={styles.slotsWrap}>{afternoonSlots.map(renderSlot)}</View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendLabel}>Đang chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: COLORS.surfaceContainer },
            ]}
          />
          <Text style={styles.legendLabel}>Còn chỗ</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#E2E8F0' }]} />
          <Text style={styles.legendLabel}>Đã kín chỗ</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  daysRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  dayCard: {
    width: 78,
    minHeight: 96,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayCardFull: {
    backgroundColor: '#F8FAFC',
    opacity: 0.7,
  },
  todayPill: {
    backgroundColor: COLORS.secondaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginBottom: 4,
  },
  todayPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.onSecondaryContainer,
  },
  dayLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayLabelSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  dateNum: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginVertical: 3,
  },
  dateNumSelected: {
    color: '#FFFFFF',
  },
  dayTextDisabled: {
    color: '#94A3B8',
  },
  slotsStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  slotsStatusSelected: {
    color: '#86F2E4',
  },
  slotsStatusFull: {
    color: COLORS.error,
  },
  gridCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  gridMainTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    marginBottom: 14,
  },
  noteText: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  periodTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotBtn: {
    flexGrow: 1,
    flexBasis: '22%',
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotBooked: {
    backgroundColor: '#F8FAFC',
  },
  slotSelected: {
    backgroundColor: COLORS.primary,
  },
  slotFast: {
    backgroundColor: '#CCFBF1',
  },
  slotTimeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  slotTimeBooked: {
    color: '#CBD5E1',
    textDecorationLine: 'line-through',
  },
  slotTimeSelected: {
    color: '#FFFFFF',
  },
  slotTimeFast: {
    color: COLORS.secondaryDark,
  },
  slotCornerIcon: {
    position: 'absolute',
    top: 3,
    right: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

