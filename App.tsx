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

  const handleSelectDirectoryRoute = (routeKey: string) => {
    if (routeKey.startsWith('tab_')) {
      const tabName = routeKey.replace('tab_', '') as MainTabKey;
      setRoute('main');
      setActiveTab(tabName);
    } else {
      setRoute(routeKey);
    }
  };

  const renderCurrentScreen = () => {
    switch (route) {
      case 'directory':
        return (
          <FigmaDirectoryScreen
            onSelectScreen={handleSelectDirectoryRoute}
            onClose={() => setRoute('main')}
          />
        );
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
            onConfirmBooking={() => setRoute('bookingSuccess')}
          />
        );

      // Telehealth, Booking Success & Family Profiles (6 screens)
      case 'bookingSuccess':
        return (
          <BookingSuccessScreen
            onViewAppointments={() => {
              setRoute('main');
              setActiveTab('appointments');
            }}
            onGoHome={() => {
              setRoute('main');
              setActiveTab('home');
            }}
          />
        );
      case 'familyProfiles':
        return (
          <FamilyProfilesScreen
            onBack={() => setRoute('main')}
            onSelectChild={() => setRoute('childEHR')}
            onAddMember={() => setRoute('addFamilyMember')}
          />
        );
      case 'childEHR':
        return (
          <ChildEHRDetailScreen onBack={() => setRoute('familyProfiles')} />
        );
      case 'addFamilyMember':
        return (
          <AddEditFamilyMemberScreen
            onBack={() => setRoute('familyProfiles')}
          />
        );
      case 'teleconsult':
        return (
          <TeleconsultationScreen
            onBack={() => setRoute('postConsultSummary')}
          />
        );
      case 'labImagingResults':
        return <LabAndImagingResultsScreen onBack={() => setRoute('main')} />;

      // Pharmacy & Medication Adherence (8 screens)
      case 'medLog':
        return (
          <MedicationLogScreen
            onBack={() => setRoute('main')}
            onOpenPrescription={() => setRoute('rxDetail')}
          />
        );
      case 'rxDetail':
        return (
          <PrescriptionDetailScreen
            onBack={() => setRoute('medLog')}
            onOrderDelivery={() => setRoute('homeDelivery')}
          />
        );
      case 'firstDoseAlert':
        return (
          <FirstDoseLockscreenAlertScreen
            onConfirmTaken={() => setRoute('medLog')}
            onBack={() => setRoute('directory')}
          />
        );
      case 'medicineCabinet':
        return (
          <FamilyMedicineCabinetScreen
            onBack={() => setRoute('directory')}
            onRefillNow={() => setRoute('homeDelivery')}
          />
        );
      case 'homeDelivery':
        return (
          <HomeMedicineDeliveryScreen
            onBack={() => setRoute('rxDetail')}
            onTrackDelivery={() => setRoute('liveDelivery')}
          />
        );
      case 'liveDelivery':
        return (
          <LiveDeliveryTrackingScreen
            onBack={() => setRoute('homeDelivery')}
            onOpenHandover={() => setRoute('deliveryHandover')}
          />
        );
      case 'deliveryHandover':
        return (
          <DeliveryHandoverUnsealScreen
            onBack={() => setRoute('refillBHYT')}
          />
        );
      case 'refillBHYT':
        return (
          <RefillHistoryAndBHYTScreen
            onBack={() => setRoute('directory')}
            onOpenVATInvoice={() => setRoute('vatInvoice')}
          />
        );

      // PKI, NEAC & Tax Invoices (9 screens)
      case 'postConsultSummary':
        return (
          <PostConsultSummarySignedRxScreen
            onBack={() => setRoute('directory')}
            onOpenXMLCert={() => setRoute('digitalCertXML')}
          />
        );
      case 'digitalCertXML':
        return (
          <DigitalCertAndXMLInspectorScreen
            onBack={() => setRoute('postConsultSummary')}
            onOpenNEACLookup={() => setRoute('neacPublicLookup')}
          />
        );
      case 'vatInvoice':
        return (
          <ElectronicVATInvoiceScreen
            onBack={() => setRoute('directory')}
            onOpenGDTTax={() => setRoute('gdtTaxPortal')}
          />
        );
      case 'downloadA4Preview':
        return (
          <DownloadSuccessA4PreviewScreen
            onBack={() => setRoute('fullTaxDossier')}
            onOpenPrintOptions={() => setRoute('airPrintOptions')}
          />
        );
      case 'fullTaxDossier':
        return (
          <FullTaxDossierBundleScreen
            onBack={() => setRoute('directory')}
            onDownloadSuccess={() => setRoute('downloadA4Preview')}
          />
        );
      case 'gdtTaxPortal':
        return (
          <GDTTaxPortalReconcileScreen onBack={() => setRoute('vatInvoice')} />
        );
      case 'neacPublicLookup':
        return (
          <NEACPublicPKILookupScreen
            onBack={() => setRoute('directory')}
            onOpenReportPage1={() => setRoute('neacReportP1')}
          />
        );
      case 'neacReportP1':
        return (
          <NEACAuditReportPage1Screen
            onBack={() => setRoute('neacPublicLookup')}
            onOpenPage2={() => setRoute('neacReportP2')}
          />
        );
      case 'neacReportP2':
        return (
          <NEACAuditReportPage2Screen
            onBack={() => setRoute('neacReportP1')}
            onOpenAirPrint={() => setRoute('airPrintOptions')}
          />
        );

      // AirPrint & Accounting Email (10 screens)
      case 'printShareHistory':
        return (
          <PrintAndShareHistoryScreen
            onBack={() => setRoute('directory')}
            onOpenEmailReceipt={() => setRoute('accountingEmailReceipt')}
          />
        );
      case 'accountingEmailReceipt':
        return (
          <AccountingEmailReceiptDetailScreen
            onBack={() => setRoute('printShareHistory')}
            onOpenGatewayPDF={() => setRoute('gatewaySignedPDF')}
          />
        );
      case 'gatewaySignedPDF':
        return (
          <GatewaySignedReceiptPDFScreen
            onBack={() => setRoute('accountingEmailReceipt')}
          />
        );
      case 'airPrintOptions':
        return (
          <AirPrintOptionsModalScreen
            onBack={() => setRoute('directory')}
            onSelectPrinter={() => setRoute('availablePrinters')}
            onStartPrint={() => setRoute('printSpooling')}
          />
        );
      case 'availablePrinters':
        return (
          <AvailablePrintersListScreen
            onBack={() => setRoute('airPrintOptions')}
            onConfirmPrinter={() => setRoute('airPrintOptions')}
          />
        );
      case 'printSpooling':
        return (
          <PrintSpoolingProgressScreen
            onBack={() => setRoute('airPrintOptions')}
            onFinishPrint={() => setRoute('printCompleted')}
          />
        );
      case 'sendTaxEmail':
        return (
          <SendTaxAccountingEmailScreen
            onBack={() => setRoute('printPKILog')}
            onSendSuccess={() => setRoute('emailSentSuccess')}
          />
        );
      case 'printPKILog':
        return (
          <PrintReceiptAndPKILogScreen
            onBack={() => setRoute('printCompleted')}
            onSendEmail={() => setRoute('sendTaxEmail')}
          />
        );
      case 'printCompleted':
        return (
          <PrintCompletedReceiptScreen
            onBack={() => setRoute('printSpooling')}
            onOpenPKILog={() => setRoute('printPKILog')}
          />
        );
      case 'emailSentSuccess':
        return (
          <EmailSentAuditSuccessScreen onBack={() => setRoute('directory')} />
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
