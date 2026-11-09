import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../theme';
import { AppointmentItem, getRelativeDayMeta } from '../../data/mockData';

// ============================================================================
// Tiện ích tính toán số liệu cho biểu đồ Admin (dữ liệu thật từ AppContext)
// ============================================================================

const DATE_PATTERN = /(\d{2})\/(\d{2})\/(\d{4})/;

/** Trích ngày khám dd/mm/yyyy từ lịch hẹn; trả về null nếu không xác định được */
export const getAppointmentDateKey = (apt: AppointmentItem): string | null => {
  const fromRange = apt.timeRange.match(DATE_PATTERN);
  if (fromRange) return fromRange[0];
  const fromLabel = apt.dateLabel.match(DATE_PATTERN);
  if (fromLabel) return fromLabel[0];
  if (apt.dateLabel.includes('Hôm nay')) return getRelativeDayMeta(0).fullDate;
  return null;
};

export const formatVnd = (value: number): string =>
  `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;

const pct = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

// ============================================================================
// 1. LỊCH KHÁM 7 NGÀY TỚI (cột đứng, chia Tại viện / Trực tuyến)
// ============================================================================
const BAR_MAX_HEIGHT = 96;

export const WeeklyLoadChart: React.FC<{ appointments: AppointmentItem[] }> = ({
  appointments,
}) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const meta = getRelativeDayMeta(i);
    const dayApts = appointments.filter(
      (a) => a.status === 'upcoming' && getAppointmentDateKey(a) === meta.fullDate
    );
    return {
      key: meta.fullDate,
      label: i === 0 ? 'H.nay' : meta.dayLabel,
      shortDate: meta.shortDate,
      clinic: dayApts.filter((a) => a.mode === 'clinic').length,
      video: dayApts.filter((a) => a.mode === 'video').length,
    };
  });
  const maxTotal = Math.max(1, ...days.map((d) => d.clinic + d.video));
  const weekTotal = days.reduce((s, d) => s + d.clinic + d.video, 0);

  return (
    <View>
      <View style={styles.weekChartRow}>
        {days.map((d) => {
          const total = d.clinic + d.video;
          return (
            <View
              key={d.key}
              style={styles.weekCol}
              accessible
              accessibilityLabel={`${d.label} ${d.shortDate}: ${total} lịch khám, ${d.clinic} tại viện, ${d.video} trực tuyến`}
            >
              <Text style={styles.weekCount}>{total}</Text>
              <View style={styles.weekTrack}>
                {d.video > 0 && (
                  <View
                    style={{
                      height: (d.video / maxTotal) * BAR_MAX_HEIGHT,
                      backgroundColor: COLORS.secondary,
                    }}
                  />
                )}
                {d.clinic > 0 && (
                  <View
                    style={{
                      height: (d.clinic / maxTotal) * BAR_MAX_HEIGHT,
                      backgroundColor: COLORS.primary,
                    }}
                  />
                )}
              </View>
              <Text style={styles.weekLabel} numberOfLines={1}>
                {d.label}
              </Text>
              <Text style={styles.weekDate} numberOfLines={1}>
                {d.shortDate}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <LegendDot color={COLORS.primary} label="Tại viện" />
        <LegendDot color={COLORS.secondary} label="Trực tuyến" />
        <Text style={styles.legendTotal}>Tổng 7 ngày: {weekTotal} lịch</Text>
      </View>
    </View>
  );
};

// ============================================================================
// 2. THANH TỶ LỆ PHÂN ĐOẠN (trạng thái lịch hẹn / hình thức thanh toán)
// ============================================================================
export interface SegmentDatum {
  key: string;
  label: string;
  value: number;
  color: string;
}

export const SegmentBreakdownBar: React.FC<{
  data: SegmentDatum[];
  emptyText?: string;
}> = ({ data, emptyText = 'Chưa có dữ liệu' }) => {
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return <Text style={styles.emptyText}>{emptyText}</Text>;
  }

  return (
    <View>
      <View
        style={styles.segmentTrack}
        accessible
        accessibilityLabel={data
          .map((d) => `${d.label} ${d.value} (${pct(d.value, total)}%)`)
          .join(', ')}
      >
        {data
          .filter((d) => d.value > 0)
          .map((d) => (
            <View
              key={d.key}
              style={{ flex: d.value, backgroundColor: d.color }}
            />
          ))}
      </View>
      <View style={styles.segmentLegend}>
        {data.map((d) => (
          <View key={d.key} style={styles.segmentLegendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: d.color }]} />
            <Text style={styles.segmentLegendLabel}>{d.label}</Text>
            <Text style={styles.segmentLegendValue}>
              {d.value} ({pct(d.value, total)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// 3. PHÂN BỔ LỊCH KHÁM THEO CHUYÊN KHOA (thanh ngang)
// ============================================================================
export const SpecialtyDistributionChart: React.FC<{
  appointments: AppointmentItem[];
}> = ({ appointments }) => {
  const active = appointments.filter((a) => a.status !== 'cancelled');
  const counts = active.reduce<Record<string, number>>((acc, a) => {
    acc[a.doctor.specialty] = (acc[a.doctor.specialty] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...rows.map((r) => r[1]));

  if (rows.length === 0) {
    return <Text style={styles.emptyText}>Chưa có lịch khám nào</Text>;
  }

  return (
    <View>
      {rows.map(([name, count], idx) => (
        <View
          key={name}
          style={styles.hBarRow}
          accessible
          accessibilityLabel={`${name}: ${count} lịch khám, ${pct(count, active.length)}%`}
        >
          <View style={styles.hBarLabelRow}>
            <Text style={styles.hBarName} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.hBarCount}>
              {count} lịch ({pct(count, active.length)}%)
            </Text>
          </View>
          <View style={styles.hBarTrack}>
            <View
              style={[
                styles.hBarFill,
                {
                  width: `${(count / maxCount) * 100}%`,
                  backgroundColor: idx % 2 === 0 ? COLORS.primary : COLORS.secondary,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendSwatch, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  weekChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 4,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
  },
  weekCount: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  weekTrack: {
    width: 22,
    height: BAR_MAX_HEIGHT,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceContainerLow,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  weekLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  weekDate: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  legendTotal: {
    marginLeft: 'auto',
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  segmentTrack: {
    flexDirection: 'row',
    height: 16,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceContainerLow,
    gap: 2,
  },
  segmentLegend: {
    marginTop: 12,
    gap: 8,
  },
  segmentLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  segmentLegendLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySm,
    color: COLORS.textPrimary,
  },
  segmentLegendValue: {
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hBarRow: {
    marginBottom: 12,
  },
  hBarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  hBarName: {
    flex: 1,
    fontSize: TYPOGRAPHY.bodySm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  hBarCount: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  hBarTrack: {
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainerLow,
    overflow: 'hidden',
  },
  hBarFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.bodySm,
    color: COLORS.textSecondary,
    paddingVertical: 8,
  },
});

