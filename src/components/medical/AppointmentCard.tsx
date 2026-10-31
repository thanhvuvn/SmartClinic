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
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';
import { AppointmentItem } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';

export interface AppointmentCardProps {
  appointment: AppointmentItem;
  onPrimaryPress?: (appointment: AppointmentItem) => void;
  onSecondaryPress?: (appointment: AppointmentItem) => void;
  style?: ViewStyle;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPrimaryPress,
  onSecondaryPress,
  style,
}) => {
  const { doctor } = appointment;
  const isClinic = appointment.mode === 'clinic';

  return (
    <View style={[styles.card, SHADOWS.sm, style]}>
      {/* Top Status Badges */}
      <View style={styles.topRow}>
        <Badge
          label={appointment.dateLabel}
          variant={isClinic ? 'teal' : 'surface'}
          showDot={isClinic}
          icon={!isClinic ? 'calendar-outline' : undefined}
        />
        <Badge
          label={appointment.statusBadge}
          variant="blue"
          icon={!isClinic ? 'chatbubbles-outline' : undefined}
        />
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          <View style={styles.verifiedOverlay}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
          </View>
        </View>
        <View style={{ flex: 1, minWidth: 0, marginLeft: 12 }}>
          <Text style={styles.doctorName} numberOfLines={1}>
            {doctor.name}
          </Text>
          <Text style={styles.specialty} numberOfLines={1}>
            {doctor.degree}
          </Text>
          <Text style={styles.hospital} numberOfLines={1}>
            {doctor.hospital}
          </Text>
        </View>
      </View>

      {/* Time & Queue Number Box */}
      <View style={styles.timeBox}>
        <View style={styles.timeLeft}>
          <Ionicons
            name={isClinic ? 'time-outline' : 'calendar-outline'}
            size={18}
            color={COLORS.primary}
          />
          <View style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
            <Text style={styles.timeBoxLabel} numberOfLines={1}>
              {isClinic ? 'Thời gian khám' : 'Thời gian hẹn'}
            </Text>
            <Text style={styles.timeBoxValue} numberOfLines={1}>
              {appointment.timeRange}
            </Text>
          </View>
        </View>

        {appointment.queueNumber ? (
          <View style={styles.queueRight}>
            <Ionicons name="ticket-outline" size={16} color={COLORS.secondary} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.timeBoxLabel} numberOfLines={1}>
                Số thứ tự
              </Text>
              <Text style={styles.queueNumber} numberOfLines={1}>
                {appointment.queueNumber}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.waitingRoomPill}
            onPress={() => onPrimaryPress?.(appointment)}
            accessibilityRole="button"
            accessibilityLabel={`Chat với bác sĩ ${doctor.name}`}
          >
            <Ionicons name="chatbubbles-outline" size={14} color="#FFFFFF" />
            <Text style={styles.waitingRoomText} numberOfLines={1}>
              Chat Bác sĩ
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Clinic Location + QR Code Bar */}
      {isClinic && appointment.room && (
        <>
          <View style={styles.roomRow}>
            <Ionicons name="business-outline" size={15} color={COLORS.primary} />
            <Text style={[styles.roomText, { flex: 1 }]} numberOfLines={1}>
              {appointment.room}
            </Text>
          </View>

          <View style={styles.qrCodeRow}>
            <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
              <Text style={styles.codeLabel} numberOfLines={1}>
                MÃ PHIẾU HẸN
              </Text>
              <Text style={styles.codeValue} numberOfLines={1}>
                {appointment.code}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.qrBtn}
              activeOpacity={0.8}
              onPress={() => onPrimaryPress?.(appointment)}
              accessibilityRole="button"
              accessibilityLabel={`Mở mã QR check-in phiếu hẹn ${appointment.code}`}
            >
              <Ionicons name="qr-code-outline" size={14} color={COLORS.primary} />
              <Text style={styles.qrBtnText}>Check-in QR</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <AppButton
              title="Chỉ đường"
              variant="tonal"
              size="md"
              leftIcon="map-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => onSecondaryPress?.(appointment)}
            />
            <AppButton
              title="Xem phiếu hẹn"
              variant="primary"
              size="md"
              leftIcon="receipt-outline"
              fullWidth={false}
              style={{ flex: 1 }}
              onPress={() => onPrimaryPress?.(appointment)}
            />
          </View>
        </>
      )}

      {/* Video Consultation Actions */}
      {!isClinic && (
        <View style={styles.videoFooterRow}>
          <TouchableOpacity
            style={styles.cancelLink}
            onPress={() => onSecondaryPress?.(appointment)}
          >
            <Ionicons name="close-circle-outline" size={15} color={COLORS.error} />
            <Text style={styles.cancelText}>Hủy lịch</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailLink}
            onPress={() => onPrimaryPress?.(appointment)}
          >
            <Text style={styles.detailText}>Chi tiết cuộc hẹn</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...LAYOUT.card,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.surfaceContainer,
  },
  verifiedOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },
  doctorName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  specialty: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  hospital: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
  },
  timeBoxLabel: {
    fontSize: TYPOGRAPHY.size.xxs,
    color: COLORS.textSecondary,
  },
  timeBoxValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  queueRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  queueNumber: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  waitingRoomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 5,
    flexShrink: 0,
  },
  waitingRoomText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  roomText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  qrCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  codeValue: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 5,
    flexShrink: 0,
  },
  qrBtnText: {
    fontSize: TYPOGRAPHY.size.xxs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  videoFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.error,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

