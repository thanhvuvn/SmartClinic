import React, { useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from './src/theme';
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
} from './src/screens/BookingFlowScreens';
import {
  AdminDashboardScreen,
  DoctorDashboardScreen,
} from './src/screens/RoleDashboards';
import {
  BookingSuccessScreen,
  FamilyProfilesScreen,
  ChildEHRDetailScreen,
  AddEditFamilyMemberScreen,
  TeleconsultationScreen,
  PostConsultSummaryScreen,
  LabAndImagingResultsScreen,
} from './src/screens/TelehealthAndFamilyScreens';
import {
  MedicationLogScreen,
  PrescriptionDetailScreen,
  FamilyMedicineCabinetScreen,
} from './src/screens/PharmacyAndMedicationScreens';

export default function App() {
  const [route, setRoute] = useState<string>('login');
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<MainTabKey>('home');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem>(DOCTORS[0]);

  const navigateTo = (nextRoute: string) => {
    if (nextRoute === route) return;
    setRouteHistory((prev) => [...prev, route]);
    setRoute(nextRoute);
  };

  const goBack = (fallback = 'main') => {
    setRouteHistory((prev) => {
      if (prev.length === 0) {
        setRoute(fallback);
        return prev;
      }
      const next = [...prev];
      const last = next.pop()!;
      setRoute(last);
      return next;
    });
  };

  const handleOpenDoctor = (doc: DoctorItem) => {
    setSelectedDoctor(doc);
    navigateTo('doctorDetail');
  };

  const handleOpenBooking = (doc: DoctorItem) => {
    setSelectedDoctor(doc);
    navigateTo('bookingSlot');
  };

  const handleRoleLoginSuccess = (role: UserRole) => {
    setRouteHistory([]);
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
      case 'splash':
        return <SplashScreen onContinue={() => navigateTo('login')} />;
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={(role) => handleRoleLoginSuccess(role)}
            onGoRegister={() => navigateTo('register')}
            onBack={() => navigateTo('splash')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegisterSuccess={() => {
              setRouteHistory([]);
              setRoute('main');
              setActiveTab('home');
            }}
            onGoLogin={() => navigateTo('login')}
          />
        );
      case 'adminPortal':
        return (
          <AdminDashboardScreen
            onLogout={() => {
              setRouteHistory([]);
              setRoute('login');
            }}
            onNavigate={navigateTo}
          />
        );
      case 'doctorPortal':
        return (
          <DoctorDashboardScreen
            onLogout={() => {
              setRouteHistory([]);
              setRoute('login');
            }}
            onNavigate={navigateTo}
          />
        );
      case 'doctorDetail':
        return (
          <DoctorDetailScreen
            doctor={selectedDoctor}
            onBack={() => goBack('main')}
            onBookSlot={handleOpenBooking}
          />
        );
      case 'bookingSlot':
        return (
          <BookingSlotScreen
            doctor={selectedDoctor}
            onBack={() => goBack('doctorDetail')}
            onConfirmBooking={() => navigateTo('bookingSuccess')}
          />
        );

      // Booking Success, Real-time Chat, Clinical Results & Family Profiles
      case 'bookingSuccess':
        return (
          <BookingSuccessScreen
            onViewAppointments={() => {
              setRouteHistory([]);
              setRoute('main');
              setActiveTab('appointments');
            }}
            onGoHome={() => {
              setRouteHistory([]);
              setRoute('main');
              setActiveTab('home');
            }}
            onNavigate={navigateTo}
          />
        );
      case 'familyProfiles':
        return (
          <FamilyProfilesScreen
            onBack={() => goBack('main')}
            onSelectChild={() => navigateTo('childEHR')}
            onAddMember={() => navigateTo('addFamilyMember')}
            onNavigate={navigateTo}
          />
        );
      case 'childEHR':
        return (
          <ChildEHRDetailScreen onBack={() => goBack('familyProfiles')} />
        );
      case 'addFamilyMember':
        return (
          <AddEditFamilyMemberScreen
            onBack={() => goBack('familyProfiles')}
          />
        );
      case 'teleconsult':
        return (
          <TeleconsultationScreen
            onBack={() => goBack('main')}
            onFinishChat={() => navigateTo('postConsultSummary')}
            onOpenLabResults={() => navigateTo('labImagingResults')}
          />
        );
      case 'postConsultSummary':
        return (
          <PostConsultSummaryScreen
            onBack={() => goBack('main')}
            onNavigate={navigateTo}
          />
        );
      case 'labImagingResults':
        return (
          <LabAndImagingResultsScreen
            onBack={() => goBack('main')}
            onOpenTeleconsult={() => navigateTo('teleconsult')}
          />
        );

      // Medication & Adherence
      case 'medLog':
        return (
          <MedicationLogScreen
            onBack={() => goBack('main')}
            onOpenPrescription={() => navigateTo('rxDetail')}
            onOpenCabinet={() => navigateTo('medicineCabinet')}
          />
        );
      case 'rxDetail':
        return (
          <PrescriptionDetailScreen
            onBack={() => goBack('medLog')}
            onOpenMedLog={() => navigateTo('medLog')}
          />
        );
      case 'medicineCabinet':
        return (
          <FamilyMedicineCabinetScreen
            onBack={() => goBack('main')}
            onRefillNow={() => navigateTo('teleconsult')}
          />
        );

      // Main 5-tab Patient Portal
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
                  onNavigate={navigateTo}
                />
              )}
              {activeTab === 'records' && (
                <EHRScreen
                  onAskAI={() => setActiveTab('ai')}
                  onNavigate={navigateTo}
                />
              )}
              {activeTab === 'appointments' && (
                <AppointmentsScreen
                  onSelectDoctor={handleOpenDoctor}
                  onBookNew={() => handleOpenBooking(DOCTORS[0])}
                  onNavigate={navigateTo}
                />
              )}
              {activeTab === 'ai' && (
                <AIAssistantScreen onBookDoctor={handleOpenBooking} />
              )}
              {activeTab === 'profile' && (
                <ProfileSettingsScreen
                  onLogout={() => {
                    setRouteHistory([]);
                    setRoute('login');
                  }}
                  onNavigate={navigateTo}
                  onSwitchTab={setActiveTab}
                />
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
      <SafeAreaView style={styles.safeRoot}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1 }}>{renderCurrentScreen()}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeRoot: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
