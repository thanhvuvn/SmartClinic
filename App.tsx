import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from './src/theme';
import { DOCTORS, DoctorItem } from './src/data/mockData';
import { BottomTabBar, MainTabKey } from './src/components';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  UserRole,
} from './src/screens/AuthScreens';
import {
  HomeScreen,
  EHRScreen,
  AppointmentsScreen,
  AIAssistantScreen,
  ProfileSettingsScreen,
} from './src/screens/MainTabScreens';
import {
  DoctorDetailScreen,
  BookingSlotScreen,
  ComponentShowcaseScreen,
} from './src/screens/BookingFlowScreens';
import {
  AdminDashboardScreen,
  DoctorDashboardScreen,
} from './src/screens/RoleDashboards';

type ScreenRoute =
  | 'showcase'
  | 'splash'
  | 'login'
  | 'register'
  | 'main'
  | 'doctorPortal'
  | 'adminPortal'
  | 'doctorDetail'
  | 'bookingSlot';

const QUICK_ROUTES: {
  key: string;
  label: string;
  route: ScreenRoute;
  tab?: MainTabKey;
}[] = [
  { key: 'login', label: '🔐 Đăng nhập (3 Quyền)', route: 'login' },
  { key: 'admin', label: '🛡️ Admin Portal', route: 'adminPortal' },
  { key: 'doctor', label: '👨‍⚕️ Bác sĩ Portal', route: 'doctorPortal' },
  { key: 'home', label: '🏠 Bệnh nhân (Trang chủ)', route: 'main', tab: 'home' },
  { key: 'uikit', label: '🧩 UI Kit Components', route: 'showcase' },
  { key: 'doc', label: '🩺 Chi tiết BS', route: 'doctorDetail' },
  { key: 'slot', label: '📅 Chọn lịch', route: 'bookingSlot' },
  { key: 'apts', label: '📋 Lịch khám', route: 'main', tab: 'appointments' },
  { key: 'ehr', label: '📁 Bệnh án EHR', route: 'main', tab: 'records' },
  { key: 'ai', label: '✨ AI Assistant', route: 'main', tab: 'ai' },
  { key: 'profile', label: '👤 Cá nhân', route: 'main', tab: 'profile' },
  { key: 'register', label: '📝 Đăng ký', route: 'register' },
  { key: 'splash', label: '🚀 Splash', route: 'splash' },
];

export default function App() {
  const [route, setRoute] = useState<ScreenRoute>('login');
  const [activeTab, setActiveTab] = useState<MainTabKey>('home');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem>(DOCTORS[0]);
  const [showDevBar, setShowDevBar] = useState(true);

  const handleOpenDoctor = (doc: DoctorItem) => {
    setSelectedDoctor(doc);
    setRoute('doctorDetail');
  };

  const handleOpenBooking = (doc: DoctorItem) => {
    setSelectedDoctor(doc);
    setRoute('bookingSlot');
  };

  const handleRoleLoginSuccess = (role: UserRole) => {
    if (role === 'admin') {
      setRoute('adminPortal');
    } else if (role === 'doctor') {
      setRoute('doctorPortal');
    } else {
      setRoute('main');
      setActiveTab('home');
    }
  };

  const renderCurrentScreen = () => {
    switch (route) {
      case 'showcase':
        return <ComponentShowcaseScreen onClose={() => setRoute('main')} />;
      case 'splash':
        return <SplashScreen onContinue={() => setRoute('login')} />;
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={(role) => handleRoleLoginSuccess(role)}
            onGoRegister={() => setRoute('register')}
            onBack={() => setRoute('splash')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegisterSuccess={() => {
              setRoute('main');
              setActiveTab('home');
            }}
            onGoLogin={() => setRoute('login')}
          />
        );
      case 'adminPortal':
        return <AdminDashboardScreen onLogout={() => setRoute('login')} />;
      case 'doctorPortal':
        return <DoctorDashboardScreen onLogout={() => setRoute('login')} />;
      case 'doctorDetail':
        return (
          <DoctorDetailScreen
            doctor={selectedDoctor}
            onBack={() => setRoute('main')}
            onBookSlot={handleOpenBooking}
          />
        );
      case 'bookingSlot':
        return (
          <BookingSlotScreen
            doctor={selectedDoctor}
            onBack={() => setRoute('doctorDetail')}
            onConfirmBooking={() => {
              setRoute('main');
              setActiveTab('appointments');
            }}
          />
        );
      case 'main':
      default:
        return (
          <View style={styles.mainWrapper}>
            <View style={{ flex: 1 }}>
              {activeTab === 'home' && (
                <HomeScreen
                  onSelectDoctor={handleOpenDoctor}
                  onBookDoctor={handleOpenBooking}
                  onAskAI={() => setActiveTab('ai')}
                  onOpenProfile={() => setActiveTab('profile')}
                />
              )}
              {activeTab === 'records' && (
                <EHRScreen onAskAI={() => setActiveTab('ai')} />
              )}
              {activeTab === 'appointments' && (
                <AppointmentsScreen
                  onSelectDoctor={handleOpenDoctor}
                  onBookNew={() => handleOpenBooking(DOCTORS[0])}
                />
              )}
              {activeTab === 'ai' && (
                <AIAssistantScreen onBookDoctor={handleOpenBooking} />
              )}
              {activeTab === 'profile' && (
                <ProfileSettingsScreen onLogout={() => setRoute('login')} />
              )}
            </View>
            <BottomTabBar
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.responsiveShell}>
          {/* Quick Figma Screen / Component Switcher Bar for Demo */}
          {showDevBar ? (
            <View style={styles.devBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.devScroll}
              >
                {QUICK_ROUTES.map((item) => {
                  const isActive =
                    route === item.route &&
                    (!item.tab || activeTab === item.tab);
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => {
                        setRoute(item.route);
                        if (item.tab) setActiveTab(item.tab);
                      }}
                      style={[
                        styles.devChip,
                        isActive && styles.devChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.devChipText,
                          isActive && styles.devChipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.hideDevBtn}
                onPress={() => setShowDevBar(false)}
              >
                <Ionicons name="chevron-up" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.floatingShowDev}
              onPress={() => setShowDevBar(true)}
            >
              <Ionicons name="layers-outline" size={14} color="#FFFFFF" />
              <Text style={styles.floatingShowDevText}>Figma Menu</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>{renderCurrentScreen()}</View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
  },
  responsiveShell: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  mainWrapper: {
    flex: 1,
  },
  devBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131B2E',
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 6,
  },
  devScroll: {
    gap: 6,
    paddingRight: 8,
  },
  devChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  devChipActive: {
    backgroundColor: COLORS.secondaryContainer,
  },
  devChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  devChipTextActive: {
    color: COLORS.onSecondaryContainer,
  },
  hideDevBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  floatingShowDev: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 99,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 27, 46, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  floatingShowDevText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
