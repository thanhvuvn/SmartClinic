import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../theme';
import { HospitalItem } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';
import {
  openGoogleMapsDirections,
  openNearbyHospitalsOnGoogleMaps,
  callHospitalPhone,
  TravelMode,
} from '../../utils/mapNavigation';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';
import { PressableScale, PulsingDot } from '../common/Animations';

export interface HospitalMapModalProps {
  visible: boolean;
  initialHospital?: HospitalItem | null;
  onClose: () => void;
  onBookAtHospital?: (hospital: HospitalItem) => void;
}

const PIN_POSITIONS: Record<string, { top: number; left: string }> = {
  'hosp-0': { top: 76, left: '42%' }, // BV ĐHYD Q.5
  'hosp-2': { top: 96, left: '22%' }, // BV Chợ Rẫy Q.5
  'hosp-3': { top: 44, left: '58%' }, // BV Mắt Q.3
  'hosp-1': { top: 32, left: '78%' }, // BV Vinmec Bình Thạnh
};

export const HospitalMapModal: React.FC<HospitalMapModalProps> = ({
  visible,
  initialHospital,
  onClose,
  onBookAtHospital,
}) => {
  const { hospitals } = useAppContext();
  const [manualSelection, setManualSelection] = useState<{
    initialId?: string;
    hospital: HospitalItem;
  } | null>(null);
  const selectedHosp =
    manualSelection && manualSelection.initialId === initialHospital?.id
      ? manualSelection.hospital
      : initialHospital || hospitals[0];
  const setSelectedHosp = (hosp: HospitalItem) =>
    setManualSelection({ initialId: initialHospital?.id, hospital: hosp });
  const [travelMode, setTravelMode] = useState<TravelMode>('two-wheeler');

  const handleOpenDirections = () => {
    openGoogleMapsDirections({
      name: selectedHosp.name,
      address: selectedHosp.address,
      latitude: selectedHosp.latitude,
      longitude: selectedHosp.longitude,
      travelMode,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sheet, SHADOWS.lg]}>
          {/* Top Drag Handle & Header */}
          <View style={styles.handleBar} />
          <View style={styles.sheetHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>Bản Đồ & Chỉ Đường Y Tế</Text>
              <Text style={styles.sheetSubtitle}>
                Tọa độ GPS thực tế • Kết nối trực tiếp Google Maps
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Đóng bản đồ"
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Interactive Visual Radar Map Canvas */}
            <View style={[styles.mapCanvas, SHADOWS.sm]}>
              <LinearGradient
                colors={['#E0F2FE', '#ECFDF5', '#F0FDFA']}
                style={StyleSheet.absoluteFill}
              />

              {/* Simulated Road Grid Lines */}
              <View style={[styles.roadHorizontal, { top: 55 }]} />
              <View style={[styles.roadHorizontal, { top: 112 }]} />
              <View style={[styles.roadVertical, { left: '35%' }]} />
              <View style={[styles.roadVertical, { left: '66%' }]} />

              {/* District Labels */}
              <Text style={[styles.districtTag, { top: 12, left: 12 }]}>
                QUẬN 5 • HỒNG BÀNG
              </Text>
              <Text style={[styles.districtTag, { top: 12, right: 12 }]}>
                QUẬN 3 / BÌNH THẠNH
              </Text>

              {/* User Current GPS Position */}
              <View style={styles.userLocationPin}>
                <PulsingDot color={COLORS.primary} size={10} />
                <View style={styles.userLabelBox}>
                  <Text style={styles.userLabelText}>Vị trí của bạn</Text>
                </View>
              </View>

              {/* Hospital Pins on Map */}
              {hospitals.map((hosp, idx) => {
                const pos = PIN_POSITIONS[hosp.id] || {
                  top: 38 + (idx % 3) * 24,
                  left: `${28 + (idx % 4) * 16}%`,
                };
                const isSelected = hosp.id === selectedHosp.id;
                return (
                  <TouchableOpacity
                    key={hosp.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedHosp(hosp)}
                    style={[
                      styles.mapPinWrap,
                      { top: pos.top, left: pos.left as any },
                      isSelected && styles.mapPinWrapActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.mapPinBubble,
                        isSelected ? styles.mapPinBubbleActive : styles.mapPinBubbleIdle,
                      ]}
                    >
                      <Ionicons
                        name="medical"
                        size={12}
                        color={isSelected ? '#FFFFFF' : COLORS.primary}
                      />
                      <Text
                        style={[
                          styles.mapPinText,
                          isSelected && { color: '#FFFFFF' },
                        ]}
                        numberOfLines={1}
                      >
                        {hosp.name.replace('BV. ', '').replace('Bệnh viện ', '')}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.mapPinDot,
                        isSelected && { backgroundColor: COLORS.secondary },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}

              {/* Bottom Map Overlay Bar */}
              <View style={styles.mapFooterOverlay}>
                <View style={styles.coordChip}>
                  <Ionicons name="locate" size={13} color={COLORS.primary} />
                  <Text style={styles.coordText}>
                    GPS: {selectedHosp.latitude.toFixed(4)}°N,{' '}
                    {selectedHosp.longitude.toFixed(4)}°E
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => openNearbyHospitalsOnGoogleMaps()}
                  style={styles.openFullMapChip}
                >
                  <Ionicons name="map-outline" size={13} color="#FFFFFF" />
                  <Text style={styles.openFullMapText}>Mở Google Maps lớn</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Horizontal Hospital Switcher Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hospSelectorRow}
            >
              {hospitals.map((h) => {
                const active = h.id === selectedHosp.id;
                return (
                  <PressableScale
                    key={h.id}
                    activeScale={0.95}
                    onPress={() => setSelectedHosp(h)}
                    style={[
                      styles.hospTabChip,
                      active && styles.hospTabChipActive,
                    ]}
                  >
                    <Ionicons
                      name="business"
                      size={13}
                      color={active ? '#FFFFFF' : COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.hospTabText,
                        active && styles.hospTabTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {h.name}
                    </Text>
                  </PressableScale>
                );
              })}
            </ScrollView>

            {/* Selected Hospital Detail Card */}
            <View style={[styles.detailCard, SHADOWS.sm]}>
              <View style={styles.hospHeaderRow}>
                <Image
                  source={{ uri: selectedHosp.image }}
                  style={styles.hospImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.badgeRow}>
                    <Badge label={selectedHosp.tag} variant="teal" />
                    <Badge
                      label={`★ ${selectedHosp.rating}`}
                      variant="warning"
                    />
                  </View>
                  <Text style={styles.hospName} numberOfLines={2}>
                    {selectedHosp.name}
                  </Text>
                  <Text style={styles.hospAddress}>{selectedHosp.address}</Text>
                </View>
              </View>

              {/* Travel Mode Selector (Xe máy / Ô tô / Đi bộ) */}
              <Text style={styles.sectionMiniLabel}>
                CHỌN PHƯƠNG TIỆN DI CHUYỂN
              </Text>
              <View style={styles.modeRow}>
                {[
                  {
                    id: 'two-wheeler' as TravelMode,
                    icon: 'bicycle-outline',
                    label: 'Xe máy',
                    eta: selectedHosp.travelTime || '6 phút',
                  },
                  {
                    id: 'driving' as TravelMode,
                    icon: 'car-outline',
                    label: 'Ô tô / Taxi',
                    eta: '10 phút',
                  },
                  {
                    id: 'walking' as TravelMode,
                    icon: 'walk-outline',
                    label: 'Đi bộ',
                    eta: '18 phút',
                  },
                ].map((m) => {
                  const active = travelMode === m.id;
                  return (
                    <PressableScale
                      key={m.id}
                      activeScale={0.95}
                      onPress={() => setTravelMode(m.id)}
                      style={[
                        styles.modeBtn,
                        active && styles.modeBtnActive,
                      ]}
                    >
                      <Ionicons
                        name={m.icon as any}
                        size={18}
                        color={active ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modeLabel,
                          active && styles.modeLabelActive,
                        ]}
                      >
                        {m.label}
                      </Text>
                      <Text style={styles.modeEta}>
                        {selectedHosp.distance} • {m.eta}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>

              {/* Wayfinding Instructions inside Hospital */}
              <View style={styles.wayfindingBox}>
                <View style={styles.wayfindingRow}>
                  <Ionicons
                    name="enter-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.wayfindingTitle}>Cổng vào khám:</Text>
                    <Text style={styles.wayfindingDesc}>
                      {selectedHosp.gateInfo}
                    </Text>
                  </View>
                </View>

                <View style={styles.wayfindingRow}>
                  <Ionicons
                    name="car-sport-outline"
                    size={16}
                    color={COLORS.secondary}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.wayfindingTitle}>Hầm & Bãi gửi xe:</Text>
                    <Text style={styles.wayfindingDesc}>
                      {selectedHosp.parkingInfo}
                    </Text>
                  </View>
                </View>

                <View style={[styles.wayfindingRow, { marginBottom: 0 }]}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.wayfindingTitle}>Giờ tiếp nhận:</Text>
                    <Text style={styles.wayfindingDesc}>
                      {selectedHosp.workingHours}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Primary CTA: Launch Real Google Maps Turn-by-Turn Navigation */}
              <AppButton
                title="Bắt Đầu Chỉ Đường (Google Maps)"
                variant="primary"
                size="lg"
                leftIcon="navigate"
                onPress={handleOpenDirections}
                style={{ marginTop: 12 }}
              />

              {/* Secondary Actions: Call Hotline & Book Appointment */}
              <View style={styles.secondaryActionRow}>
                <AppButton
                  title={`Gọi ${selectedHosp.phone}`}
                  variant="outline"
                  size="md"
                  leftIcon="call-outline"
                  fullWidth={false}
                  style={{ flex: 1 }}
                  onPress={() =>
                    callHospitalPhone(selectedHosp.phone, selectedHosp.name)
                  }
                />
                {onBookAtHospital && (
                  <AppButton
                    title="Đặt khám tại đây"
                    variant="tonal"
                    size="md"
                    leftIcon="calendar-outline"
                    fullWidth={false}
                    style={{ flex: 1 }}
                    onPress={() => {
                      onClose();
                      onBookAtHospital(selectedHosp);
                    }}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '90%',
    paddingBottom: SPACING.xl,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.borderSubtle,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  sheetTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sheetSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  mapCanvas: {
    height: 175,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    position: 'relative',
    marginBottom: 12,
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  districtTag: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  userLocationPin: {
    position: 'absolute',
    bottom: 42,
    left: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userLabelBox: {
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  userLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapPinWrap: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
  },
  mapPinWrapActive: {
    zIndex: 10,
    transform: [{ scale: 1.06 }],
  },
  mapPinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
    borderWidth: 1.5,
  },
  mapPinBubbleIdle: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.primary,
  },
  mapPinBubbleActive: {
    backgroundColor: COLORS.primary,
    borderColor: '#FFFFFF',
  },
  mapPinText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    maxWidth: 120,
  },
  mapPinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  mapFooterOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  coordText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  openFullMapChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  openFullMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hospSelectorRow: {
    gap: 8,
    paddingBottom: 12,
  },
  hospTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 6,
  },
  hospTabChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  hospTabText: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hospTabTextActive: {
    color: '#FFFFFF',
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  hospHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hospImage: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainer,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  hospName: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  hospAddress: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionMiniLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  modeBtnActive: {
    backgroundColor: COLORS.primaryContainer,
    borderColor: COLORS.primary,
  },
  modeLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modeLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  modeEta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  wayfindingBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: 10,
  },
  wayfindingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  wayfindingTitle: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  wayfindingDesc: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});
