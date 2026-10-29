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
import {
  BookingSuccessScreen,
  FamilyProfilesScreen,
  ChildEHRDetailScreen,
  AddEditFamilyMemberScreen,
  TeleconsultationScreen,
  LabAndImagingResultsScreen,
} from './src/screens/TelehealthAndFamilyScreens';
import {
  MedicationLogScreen,
  PrescriptionDetailScreen,
  FirstDoseLockscreenAlertScreen,
  FamilyMedicineCabinetScreen,
  HomeMedicineDeliveryScreen,
  LiveDeliveryTrackingScreen,
  DeliveryHandoverUnsealScreen,
  RefillHistoryAndBHYTScreen,
} from './src/screens/PharmacyAndMedicationScreens';
import {
  PostConsultSummarySignedRxScreen,
  DigitalCertAndXMLInspectorScreen,
  ElectronicVATInvoiceScreen,
  DownloadSuccessA4PreviewScreen,
  FullTaxDossierBundleScreen,
  GDTTaxPortalReconcileScreen,
  NEACPublicPKILookupScreen,
  NEACAuditReportPage1Screen,
  NEACAuditReportPage2Screen,
} from './src/screens/PKIAndTaxInvoiceScreens';
import {
  PrintAndShareHistoryScreen,
  AccountingEmailReceiptDetailScreen,
  GatewaySignedReceiptPDFScreen,
  AirPrintOptionsModalScreen,
  AvailablePrintersListScreen,
  PrintSpoolingProgressScreen,
  SendTaxAccountingEmailScreen,
  PrintReceiptAndPKILogScreen,
  PrintCompletedReceiptScreen,
  EmailSentAuditSuccessScreen,
} from './src/screens/PrintAndAccountingEmailScreens';
import { FigmaDirectoryScreen } from './src/screens/FigmaDirectoryScreen';

const QUICK_ROUTES: {
  key: string;
  label: string;
  route: string;
  tab?: MainTabKey;
}[] = [
  { key: 'dir', label: '🗂️ Tất cả 43 Màn Figma', route: 'directory' },
  { key: 'login', label: '🔐 Đăng nhập (3 Quyền)', route: 'login' },
  { key: 'admin', label: '🛡️ Admin Portal', route: 'adminPortal' },
  { key: 'doctor', label: '👨‍⚕️ Bác sĩ Portal', route: 'doctorPortal' },
  { key: 'home', label: '🏠 Trang chủ', route: 'main', tab: 'home' },
  { key: 'uikit', label: '🧩 UI Kit Components', route: 'showcase' },
  { key: 'bookSuccess', label: '✅ Đặt lịch thành công', route: 'bookingSuccess' },
  { key: 'tele', label: '📹 Video Call BS. Trang', route: 'teleconsult' },
  { key: 'family', label: '👨‍👩‍👧 Hồ sơ Người thân', route: 'familyProfiles' },
  { key: 'medLog', label: '💊 Nhật ký uống thuốc', route: 'medLog' },
  { key: 'delivery', label: '🛵 Giao thuốc tận nhà', route: 'homeDelivery' },
  { key: 'vat', label: '🧾 Hóa đơn VAT & PKI', route: 'vatInvoice' },
  { key: 'neac', label: '🏛️ Thẩm định NEAC', route: 'neacPublicLookup' },
  { key: 'airprint', label: '🖨️ AirPrint & Kế toán', route: 'airPrintOptions' },
];

export default function App() {
  const [route, setRoute] = useState<string>('login');
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<MainTabKey>('home');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem>(DOCTORS[0]);
  const [showDevBar, setShowDevBar] = useState(true);

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

  const handleSelectDirectoryRoute = (routeKey: string) => {
    if (routeKey.startsWith('tab_')) {
      const tabName = routeKey.replace('tab_', '') as MainTabKey;
      navigateTo('main');
      setActiveTab(tabName);
    } else {
      navigateTo(routeKey);
    }
  };

  const renderCurrentScreen = () => {
    switch (route) {
      case 'directory':
        return (
          <FigmaDirectoryScreen
            onSelectScreen={handleSelectDirectoryRoute}
            onClose={() => goBack('main')}
          />
        );
      case 'showcase':
        return <ComponentShowcaseScreen onClose={() => goBack('main')} />;
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

      // Telehealth, Booking Success & Family Profiles (6 screens)
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
            onBack={() => navigateTo('postConsultSummary')}
            onOpenLabResults={() => navigateTo('labImagingResults')}
          />
        );
      case 'labImagingResults':
        return (
          <LabAndImagingResultsScreen
            onBack={() => goBack('main')}
            onDownloadPDF={() => navigateTo('downloadA4Preview')}
            onOpenTeleconsult={() => navigateTo('teleconsult')}
          />
        );

      // Pharmacy & Medication Adherence (8 screens)
      case 'medLog':
        return (
          <MedicationLogScreen
            onBack={() => goBack('main')}
            onOpenPrescription={() => navigateTo('rxDetail')}
            onOpenCabinet={() => navigateTo('medicineCabinet')}
            onOpenLockAlert={() => navigateTo('firstDoseAlert')}
          />
        );
      case 'rxDetail':
        return (
          <PrescriptionDetailScreen
            onBack={() => goBack('medLog')}
            onOrderDelivery={() => navigateTo('homeDelivery')}
          />
        );
      case 'firstDoseAlert':
        return (
          <FirstDoseLockscreenAlertScreen
            onConfirmTaken={() => navigateTo('medLog')}
            onBack={() => goBack('main')}
          />
        );
      case 'medicineCabinet':
        return (
          <FamilyMedicineCabinetScreen
            onBack={() => goBack('main')}
            onRefillNow={() => navigateTo('homeDelivery')}
          />
        );
      case 'homeDelivery':
        return (
          <HomeMedicineDeliveryScreen
            onBack={() => goBack('rxDetail')}
            onTrackDelivery={() => navigateTo('liveDelivery')}
          />
        );
      case 'liveDelivery':
        return (
          <LiveDeliveryTrackingScreen
            onBack={() => goBack('homeDelivery')}
            onOpenHandover={() => navigateTo('deliveryHandover')}
          />
        );
      case 'deliveryHandover':
        return (
          <DeliveryHandoverUnsealScreen
            onBack={() => goBack('liveDelivery')}
            onConfirmHandover={() => navigateTo('refillBHYT')}
          />
        );
      case 'refillBHYT':
        return (
          <RefillHistoryAndBHYTScreen
            onBack={() => goBack('main')}
            onOpenVATInvoice={() => navigateTo('vatInvoice')}
          />
        );

      // PKI, NEAC & Tax Invoices (9 screens)
      case 'postConsultSummary':
        return (
          <PostConsultSummarySignedRxScreen
            onBack={() => goBack('main')}
            onOpenXMLCert={() => navigateTo('digitalCertXML')}
            onOpenRxDetail={() => navigateTo('rxDetail')}
            onOpenVATInvoice={() => navigateTo('vatInvoice')}
          />
        );
      case 'digitalCertXML':
        return (
          <DigitalCertAndXMLInspectorScreen
            onBack={() => goBack('postConsultSummary')}
            onOpenNEACLookup={() => navigateTo('neacPublicLookup')}
          />
        );
      case 'vatInvoice':
        return (
          <ElectronicVATInvoiceScreen
            onBack={() => goBack('main')}
            onOpenGDTTax={() => navigateTo('gdtTaxPortal')}
            onOpenFullDossier={() => navigateTo('fullTaxDossier')}
            onOpenXMLCert={() => navigateTo('digitalCertXML')}
          />
        );
      case 'downloadA4Preview':
        return (
          <DownloadSuccessA4PreviewScreen
            onBack={() => goBack('fullTaxDossier')}
            onOpenPrintOptions={() => navigateTo('airPrintOptions')}
          />
        );
      case 'fullTaxDossier':
        return (
          <FullTaxDossierBundleScreen
            onBack={() => goBack('main')}
            onDownloadSuccess={() => navigateTo('downloadA4Preview')}
          />
        );
      case 'gdtTaxPortal':
        return (
          <GDTTaxPortalReconcileScreen
            onBack={() => goBack('vatInvoice')}
            onOpenFullDossier={() => navigateTo('fullTaxDossier')}
            onOpenNEACLookup={() => navigateTo('neacPublicLookup')}
          />
        );
      case 'neacPublicLookup':
        return (
          <NEACPublicPKILookupScreen
            onBack={() => goBack('main')}
            onOpenReportPage1={() => navigateTo('neacReportP1')}
          />
        );
      case 'neacReportP1':
        return (
          <NEACAuditReportPage1Screen
            onBack={() => goBack('neacPublicLookup')}
            onOpenPage2={() => navigateTo('neacReportP2')}
          />
        );
      case 'neacReportP2':
        return (
          <NEACAuditReportPage2Screen
            onBack={() => goBack('neacReportP1')}
            onOpenAirPrint={() => navigateTo('airPrintOptions')}
          />
        );

      // AirPrint & Accounting Email (10 screens)
      case 'printShareHistory':
        return (
          <PrintAndShareHistoryScreen
            onBack={() => goBack('main')}
            onOpenEmailReceipt={() => navigateTo('accountingEmailReceipt')}
            onOpenAirPrint={() => navigateTo('airPrintOptions')}
            onOpenSendEmail={() => navigateTo('sendTaxEmail')}
          />
        );
      case 'accountingEmailReceipt':
        return (
          <AccountingEmailReceiptDetailScreen
            onBack={() => goBack('printShareHistory')}
            onOpenGatewayPDF={() => navigateTo('gatewaySignedPDF')}
          />
        );
      case 'gatewaySignedPDF':
        return (
          <GatewaySignedReceiptPDFScreen
            onBack={() => goBack('accountingEmailReceipt')}
            onOpenAirPrint={() => navigateTo('airPrintOptions')}
            onOpenSendEmail={() => navigateTo('sendTaxEmail')}
          />
        );
      case 'airPrintOptions':
        return (
          <AirPrintOptionsModalScreen
            onBack={() => goBack('main')}
            onSelectPrinter={() => navigateTo('availablePrinters')}
            onStartPrint={() => navigateTo('printSpooling')}
          />
        );
      case 'availablePrinters':
        return (
          <AvailablePrintersListScreen
            onBack={() => goBack('airPrintOptions')}
            onConfirmPrinter={() => goBack('airPrintOptions')}
          />
        );
      case 'printSpooling':
        return (
          <PrintSpoolingProgressScreen
            onBack={() => goBack('airPrintOptions')}
            onFinishPrint={() => navigateTo('printCompleted')}
          />
        );
      case 'sendTaxEmail':
        return (
          <SendTaxAccountingEmailScreen
            onBack={() => goBack('printPKILog')}
            onSendSuccess={() => navigateTo('emailSentSuccess')}
          />
        );
      case 'printPKILog':
        return (
          <PrintReceiptAndPKILogScreen
            onBack={() => goBack('printCompleted')}
            onSendEmail={() => navigateTo('sendTaxEmail')}
          />
        );
      case 'printCompleted':
        return (
          <PrintCompletedReceiptScreen
            onBack={() => goBack('printSpooling')}
            onOpenPKILog={() => navigateTo('printPKILog')}
          />
        );
      case 'emailSentSuccess':
        return (
          <EmailSentAuditSuccessScreen
            onBack={() => {
              setRouteHistory([]);
              setRoute('main');
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
                  onSwitchTab={(tab) => setActiveTab(tab)}
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.responsiveShell}>
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
              <Text style={styles.floatingShowDevText}>43 Màn Figma</Text>
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
