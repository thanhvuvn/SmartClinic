  # BÁO CÁO KIỂM ĐỊNH & PHÊ BÌNH UX/UI TOÀN DIỆN — SMARTCLINIC (`UX_AUDIT.md`)

  > **Phương pháp đánh giá:** Skill `impeccable` (`audit.native` + `critique` ở chế độ **`product` / `Operate` mode**)  
  > **Đối tượng người dùng chính:** Bệnh nhân Việt Nam (có tỷ lệ lớn người cao tuổi, mắt kém, thao tác chạm chậm, dễ bối rối khi nhiều lối vào trùng lặp)  
  > **Nền tảng:** React Native / Expo (`Platform: adaptive` — iOS HIG >= 44pt & Android Material 3 >= 48dp)  
  > **Ràng buộc kỹ thuật & y tế bắt buộc:**
  > 1. **Không đổi tên màu thương hiệu** trong `src/theme/index.ts`.
  > 2. **Không thêm thư viện mới** vào `package.json`.
  > 3. **Dùng design token sẵn có** (`COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`, `TOUCH`, `SHADOWS`).
  > 4. **An toàn nội dung y tế:** Tuyệt đối không khẳng định chắc chắn về mặt lâm sàng từ phía AI/hệ thống tự động (xóa bỏ `"độ chính xác 98%"`, `"chính xác 99.8%"`, `"Phù hợp 96%"`, `"Chẩn đoán sơ bộ"` -> chuyển sang `"Sàng lọc triệu chứng"`, `"Gợi ý chuyên khoa tham khảo"`). Không tự viết thêm kết luận y khoa mới ngoài dữ liệu bác sĩ.
  > 5. **Không giả lập tính năng nhạy cảm (OCR / Chữ ký số / Loading-Error giả):** Các tính năng chưa có backend thực tế (như quét OCR giấy tờ) phải ẩn hoặc gắn nhãn `"Sắp ra mắt"`, không tạo xác nhận chữ ký số giả, và chỉ bổ sung `EmptyState` (không làm `loading`/`error` giả khi chưa có API).

  ---

  ## PHẦN 1: KIẾN TRÚC MÀN HÌNH & 4 LUỒNG CHÍNH TOÀN ỨNG DỤNG

  > **Lưu ý kiến trúc điều hướng hiện tại (`App.tsx:28-334`):** Codebase điều hướng bằng state tập trung (`route` + `activeTab`) tại `App.tsx` và chia thành **6 module trong `src/screens/`** với tổng cộng **23 màn hình / modal chuyên biệt**.

  ### 1.1. Danh mục 23 Màn hình & Thành phần Điều hướng

  | STT | Mã Route / Tab | Tên Màn Hình | File Nguồn & Dòng | Vai Trò Trong Sản Phẩm |
  | :--- | :--- | :--- | :--- | :--- |
  | 01 | `splash` | Màn hình Khởi động (`SplashScreen`) | `src/screens/AuthScreens.tsx:30-140` | Giới thiệu thương hiệu & nạp phiên làm việc |
  | 02 | `login` | Đăng nhập (`LoginScreen`) | `src/screens/AuthScreens.tsx:150-451` | Xác thực bệnh nhân / bác sĩ / quản trị viên |
  | 03 | `register` | Đăng ký tài khoản (`RegisterScreen`) | `src/screens/AuthScreens.tsx:458-698` | Tạo hồ sơ bệnh nhân mới |
  | 04 | `main` (`home`) | Trang chủ (`HomeScreen`) | `src/screens/MainTabScreens.tsx:66-428` | Xem lịch hẹn sắp tới, tìm kiếm bác sĩ/bệnh viện, lối tắt dịch vụ |
  | 05 | `main` (`records`) | Hồ sơ bệnh án điện tử (`EHRScreen`) | `src/screens/MainTabScreens.tsx:435-591` | Xem mã định danh BN, sinh hiệu, đơn thuốc, kết quả CLS, lịch sử khám |
  | 06 | `main` (`appointments`) | Lịch khám của tôi (`AppointmentsScreen`) | `src/screens/MainTabScreens.tsx:599-781` | Quản lý lịch Sắp tới / Đã khám / Đã hủy, check-in QR, hủy lịch |
  | 07 | `main` (`ai`) | Trợ lý Y tế AI (`AIAssistantScreen`) | `src/screens/MainTabScreens.tsx:787-890` | Hỏi đáp triệu chứng, sàng lọc sơ bộ và gợi ý bác sĩ chuyên khoa |
  | 08 | `main` (`profile`) | Cá nhân & Cài đặt (`ProfileSettingsScreen`) | `src/screens/MainTabScreens.tsx:898-1217` | Thẻ BHYT VssID, cài đặt nhắc thuốc/lịch khám, liên kết gia đình, khôi phục dữ liệu |
  | 09 | `doctorDetail` | Chi tiết Bác sĩ (`DoctorDetailScreen`) | `src/screens/BookingFlowScreens.tsx:35-293` | Xem thông tin chuyên môn, ca trực, địa điểm, đánh giá và bắt đầu đặt lịch |
  | 10 | `bookingSlot` | Chọn Thời Gian Khám (`BookingSlotScreen`) | `src/screens/BookingFlowScreens.tsx:301-414` | Chọn hình thức khám (Tại viện / Chat), chọn ngày và khung giờ |
  | 11 | `bookingPayment` | Xác Nhận & Thanh Toán (`BookingPaymentScreen`) | `src/screens/BookingFlowScreens.tsx:430-715` | Đối soát viện phí BHYT, chọn phương thức thanh toán (Tại viện, VietQR, VNPAY, MoMo) |
  | 12 | `bookingSuccess` | Phiếu Khám Điện Tử (`BookingSuccessScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:37-284` | Hiển thị STT, mã QR check-in Kiosk, chia sẻ phiếu hẹn, mở Google Maps |
  | 13 | `teleconsult` | Chat Trực Tuyến Với Bác Sĩ (`TeleconsultationScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:786-1017` | Nhắn tin với bác sĩ điều trị, gửi/xem đính kèm kết quả MRI, câu hỏi nhanh |
  | 14 | `postConsultSummary` | Tóm Tắt Kết Quả Khám & Đơn Thuốc (`PostConsultSummaryScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:1022-1110` | Xem chẩn đoán của bác sĩ sau buổi khám, lời dặn và đơn thuốc đã kê |
  | 15 | `labImagingResults` | Kết Quả Cận Lâm Sàng & CĐHA (`LabAndImagingResultsScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:1115-1237` | Xem mô tả MRI/X-Quang và 14 chỉ số xét nghiệm máu, tải PDF |
  | 16 | `familyProfiles` | Hồ Sơ Sức Khỏe Gia Đình (`FamilyProfilesScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:289-431` | Quản lý danh sách người thân (Mẹ, Con trai), đặt lịch khám hộ |
  | 17 | `childEhrDetail` | Chi Tiết Hồ Sơ Sức Khỏe Trẻ Em (`ChildEHRDetailScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:437-564` | Xem chiều cao/cân nặng/BMI trẻ em, lịch tiêm chủng, lần khám gần nhất |
  | 18 | `addFamilyMember` | Thêm / Cập Nhật Hồ Sơ Người Thân (`AddEditFamilyMemberScreen`) | `src/screens/TelehealthAndFamilyScreens.tsx:569-743` | Biểu mẫu nhập thông tin thành viên gia đình mới |
  | 19 | `medLog` | Nhật Ký & Lịch Nhắc Uống Thuốc (`MedicationLogScreen`) | `src/screens/PharmacyAndMedicationScreens.tsx:29-235` | Đánh dấu đã uống/bỏ qua theo cữ Sáng - Chiều - Tối |
  | 20 | `rxDetail` | Chi Tiết Đơn Thuốc Điện Tử (`PrescriptionDetailScreen`) | `src/screens/PharmacyAndMedicationScreens.tsx:240-338` | Xem đơn thuốc có chữ ký số bác sĩ, liều dùng, chia sẻ/tải PDF |
  | 21 | `medicineCabinet` | Tủ Thuốc Gia Đình (`FamilyMedicineCabinetScreen`) | `src/screens/PharmacyAndMedicationScreens.tsx:343-439` | Quản lý tồn kho thuốc tại nhà, cảnh báo thuốc sắp hết, nhắn bác sĩ |
  | 22 | `HospitalMapModal` | Bản Đồ Cơ Sở Y Tế (`HospitalMapModal`) | `src/components/medical/HospitalMapModal.tsx:31-244` | Xem vị trí bệnh viện, khoảng cách, mở chỉ đường Google Maps |
  | 23 | `doctorHome` / `adminHome` | Cổng Bác sĩ & Quản trị (`RoleDashboards`) | `src/screens/RoleDashboards.tsx:24-662` | Bác sĩ tiếp nhận ca khám & kê đơn; Admin duyệt lịch & quản lý danh mục |

  ---

  ## PHẦN 2: ĐO TƯƠNG PHẢN THỰC TẾ (WCAG 2.1) & CHẤM ĐIỂM TỔNG QUAN

  ### 2.1. Bảng Đo Độ Tương Phản Màu Chữ Thực Tế (`src/theme/index.ts`)

  | Token Màu Chữ | Mã Hex | Nền Hiển Thị | Tỷ Lệ Tương Phản (WCAG 2.1) | Đánh Giá Cho Người Cao Tuổi |
  | :--- | :--- | :--- | :---: | :--- |
  | `COLORS.textPrimary` | `#131B2E` | `surface` (`#FFFFFF`) | **17.15 : 1** | Đạt chuẩn **AAA** (Rất rõ) |
  | `COLORS.textPrimary` | `#131B2E` | `background` (`#FAF8FF`) | **16.29 : 1** | Đạt chuẩn **AAA** (Rất rõ) |
  | `COLORS.textSecondary` | `#3F4850` | `surface` (`#FFFFFF`) | **9.32 : 1** | Đạt chuẩn **AAA** (`>= 7:1`), nhưng khi đi với cỡ chữ `9–11pt` vẫn khó đọc |
  | `COLORS.textSecondary` | `#3F4850` | `surfaceContainerLow` (`#F2F3FF`) | **8.45 : 1** | Đạt chuẩn **AAA** |
  | `COLORS.primary` | `#006194` | `surface` (`#FFFFFF`) | **6.68 : 1** | Đạt chuẩn **AA** (Gần đạt AAA `7:1`) |
  | `COLORS.secondary` | `#006A61` | `surface` (`#FFFFFF`) | **6.50 : 1** | Đạt chuẩn **AA** |
  | `COLORS.warningText` | `#B45309` | `warningContainer` (`#FEF3C7`) | **4.56 : 1** | Mức sát ngưỡng tối thiểu **AA** (`4.5:1`), hơi mờ với mắt người già khi cỡ chữ `11–12pt` |
  | `COLORS.textMuted` / `placeholder` *(Hiện tại)* | `#707881` | `surface` (`#FFFFFF`) / `background` (`#FAF8FF`) / `surfaceContainerLow` (`#F2F3FF`) | **4.47 : 1** / **4.25 : 1** / **4.06 : 1** | **RỚT chuẩn AA (`< 4.5:1`) trên cả 3 nền!** |
  | `COLORS.textMuted` / `placeholder` *(Đề xuất sửa tại P1-07)* | `#5B646E` | `surface` (`#FFFFFF`) / `background` (`#FAF8FF`) / `surfaceContainerLow` (`#F2F3FF`) | **6.01 : 1** / **5.71 : 1** / **5.45 : 1** | **Đạt chuẩn AA dư dả (`>= 5.45:1` trên cả 3 nền)** mà vẫn giữ phân cấp thị giác rõ so với `textSecondary` (`#3F4850`) |

  ---

  ## PHẦN 3: DANH SÁCH LỖI CHI TIẾT THEO MỨC ĐỘ ƯU TIÊN (`P0` / `P1` / `P2`)

  ---

  ### 🔴 MỨC P0 — AN TOÀN Y TẾ & ĐỨT GÃY LUỒNG CHÍNH (9 LỖI — CHIA THÀNH ĐỢT 1A & ĐỢT 1B)

  #### **Nhóm Đợt 1a: An toàn nội dung y tế, không giả lập OCR, sửa chính tả & đường dây nóng Cấp cứu (`P0-01`, `P0-02`, `P0-03`, `P0-08`, `P0-10` — ✅ Đã hoàn thành & nghiệm thu trên nhánh `ux/phase-1a`)**

  #### `[P0-01]` ✅ *(Commit `ec10863`)* Khẳng định "Chẩn đoán sơ bộ" và "Độ chính xác 98%" trên Banner AI Trang chủ
  - **Vị trí:** `src/components/medical/AIHeroBanner.tsx:39-43` và `src/components/medical/AIHeroBanner.tsx:67-70`
  - **Cách sửa cụ thể:**
    - Đổi `label` tại dòng 40 thành `"Hỗ trợ sàng lọc triệu chứng"` (`icon="medkit-outline"`).
    - Thay cụm `"Độ chính xác 98%"` tại dòng 67-70 bằng `"Gợi ý chuyên khoa tham khảo"` kèm icon `information-circle-outline`.

  #### `[P0-02]` ✅ *(Commit `627499c`)* Số liệu giả "Phù hợp 96%" và "AI Powered Medical Triage • Độ chính xác định hướng cao" trong màn hình Chat AI
  - **Vị trí:** `src/components/medical/AIChatComponents.tsx:31-33, 62` và `src/components/medical/AIChatComponents.tsx:139`
  - **Cách sửa cụ thể:**
    - Tại dòng 31-33: Đổi thành `"Hỗ trợ Sàng lọc Triệu chứng • Thông tin tham khảo ban đầu"`.
    - Tại dòng 62: Đổi `"Phân tích sơ bộ"` thành `"Sàng lọc triệu chứng tham khảo"`.
    - Tại dòng 139: Đổi `label="Phù hợp 96%"` thành `label="Chuyên khoa gợi ý"`.

  #### `[P0-03]` ✅ *(Commit `e83d17c`)* Tuyên bố "Tự động điền 8 mục hồ sơ chính xác 99.8% trong 3 giây" kèm nút `"Quét thẻ ngay"` chết (không có `onPress`)
  - **Vị trí:** `src/screens/TelehealthAndFamilyScreens.tsx:608-631`
    - Dòng 614: `<Badge label="Công nghệ AI OCR" variant="glass" icon="scan" />`
    - Dòng 618: `"Quét CCCD hoặc Thẻ BHYT"`
    - Dòng 621: `"Tự động điền 8 mục hồ sơ chính xác 99.8% trong 3 giây."`
    - Dòng 623-630: `<AppButton title="Quét thẻ ngay" ... />` (không truyền `onPress`).
  - **Cách sửa cụ thể:**
    - Tuyệt đối không giả lập OCR. Xóa câu `"Tự động điền 8 mục hồ sơ chính xác 99.8% trong 3 giây."` và badge `"Công nghệ AI OCR"`.
    - Chuyển khối này thành thẻ thông báo tính năng đang phát triển với badge `"Sắp ra mắt"` và nút `disabled` (`title="Tính năng quét thẻ sắp ra mắt"`).

  #### `[P0-08]` ✅ *(Commit `3dd4282`)* Sai chính tả y khoa trên `SplashScreen` ("Bác sĩ chuẩn đoán")
  - **Vị trí:** `src/screens/AuthScreens.tsx:93`
  - **Cách sửa cụ thể:** Sửa `"Bác sĩ chuẩn đoán"` thành `"Bác sĩ chuyên khoa"`.

  #### `[P0-10]` ✅ *(Commit `633a030`)* Liên hệ khẩn cấp trích xuất động từ hồ sơ (xử lý khi rỗng), ghi chú TODO gỡ nhãn dữ liệu mẫu và thêm nút gọi Cấp cứu `115` riêng biệt
  - **Vị trí:** `src/screens/MainTabScreens.tsx:1173-1192` và `src/components/medical/PatientEHRCard.tsx:321-328`
  - **Cách sửa cụ thể:**
    - Trong `ProfileHeaderCard` (`PatientEHRCard.tsx:321-328`):
      - Trích xuất động số điện thoại từ `profile?.emergencyContact`: `const extractedPhone = (profile?.emergencyContact ?? '').replace(/[^0-9+]/g, '');`.
      - **Xử lý khi `emergencyContact` rỗng hoặc không có số:** Nếu `!extractedPhone`, vô hiệu hóa thao tác gọi (`disabled`) và hiển thị `"Chưa cập nhật số điện thoại khẩn cấp"`; nếu có số, gọi `Linking.openURL(\`tel:\${extractedPhone}\`)`.
      - Hiển thị nhãn `"Liên hệ khẩn cấp (Dữ liệu mẫu)"` kèm chú thích `// TODO: Remove "(Dữ liệu mẫu)" label before production release`.
    - Trong `ProfileSettingsScreen` (`MainTabScreens.tsx:1173-1192`):
      - Tách bạch **nút gọi Cấp cứu Y tế `115` (`Linking.openURL('tel:115')`)** riêng biệt với nút gọi **Tổng đài hỗ trợ phòng khám (`1900 6868` — ghi rõ `(Mẫu)` kèm chú thích `// TODO: Remove "(Mẫu)" label before production release`)**.

  ---

  #### **Nhóm Đợt 1b: Sửa nút trên thẻ Lịch hẹn, kiểm tra lỗi biểu mẫu, bật tab lọc & làm mới chat AI (`P0-04`, `P0-05`, `P0-06`, `P0-09` — ✅ Đã hoàn thành trên nhánh `ux/phase-1b`)**

  #### `[P0-04]` ✅ *(Commit `7df173b`)* Lặp chip "Chỉ đường" nhỏ, chip "Check-in QR" nhỏ và gắn nhầm nút "Chỉ đường" vào hộp thoại Hủy lịch trên `AppointmentCard`
  - **Vị trí:** `src/components/medical/AppointmentCard.tsx:109-228` và `src/screens/MainTabScreens.tsx:661-683`
  - **Cách sửa cụ thể:**
    - **Bỏ hoàn toàn chip `"Chỉ đường"` nhỏ** (`dòng 131-162`), **bỏ chip `"Check-in QR"` nhỏ** (`dòng 174-183`), và **bỏ pill `"Chat Bác sĩ"` nhỏ** (`dòng 109-119`).
    - **Mỗi hành động chỉ có duy nhất 1 nút đạt chuẩn `>= 44pt` (`size="md"`):**
      - **Lịch khám tại viện (`isClinic`):** Giữ 2 nút `"Chỉ đường"` (mở bản đồ) + `"Xem phiếu hẹn"` (mở QR phiếu hẹn).
      - **Lịch khám online (`!isClinic`):** Dùng `"Vào phòng tư vấn"` làm nút chính (`variant="primary"`, `size="md"`), không có nút `"Chỉ đường"`.
      - **Nút `"Hủy lịch"`:** Chỉ hiển thị ở tab Lịch khám (`AppointmentsScreen` truyền `onCancelPress`), dạng nút viền (`variant="outline"`, `size="md"`, `>= 44pt`), khi bấm hiển thị hộp thoại `Alert.alert` xác nhận trước khi hủy lịch hẹn; thẻ lịch hẹn trên Trang chủ (`HomeScreen`) không hiện nút `"Hủy lịch"`.
      - **Ghi chú nền tảng:** `Alert.alert` không hoạt động trên bản Web (`react-native-web`), chạy đúng trên iOS/Android; việc tùy chọn: thay bằng `ConfirmDialog` dùng `Modal` nếu cần bản Web.

  #### `[P0-05]` ✅ *(Commit `2857ef9`)* Màn hình Thêm người thân (`AddEditFamilyMemberScreen`) và Đăng ký (`RegisterScreen`) im lặng không báo lỗi khi thiếu thông tin bắt buộc
  - **Vị trí:** `src/screens/TelehealthAndFamilyScreens.tsx:579-583, 713-730` và `src/screens/AuthScreens.tsx:491-495, 645-661`
  - **Cách sửa cụ thể:**
    - Trong `AddEditFamilyMemberScreen`: Kiểm tra và báo lỗi dưới ô `AppInput` khi để trống Họ và tên hoặc Ngày sinh.
    - Trong `RegisterScreen`: Hiển thị thông báo lỗi màu đỏ `COLORS.error` dưới dòng điều khoản khi người dùng chưa tick đồng ý (`!agreed`).

  #### `[P0-06]` ✅ *(Commit `01f488f`)* Thanh chuyển tab bị liệt ở `LabAndImagingResultsScreen` và `ChildEHRDetailScreen`, và thiếu bộ lọc ở `FamilyMedicineCabinetScreen`
  - **Vị trí:**
    1. `ChildEHRDetailScreen` (`src/screens/TelehealthAndFamilyScreens.tsx:440, 501-560`): `SegmentedControl` có 3 chip `{ key: 'exam', label: 'Khám gần nhất' }`, `{ key: 'vaccine', label: 'Sổ tiêm chủng (18 mũi)' }`, `{ key: 'growth', label: 'Biểu đồ WHO' }` (`dòng 505-509`), nhưng bên dưới luôn hiển thị cố định thẻ `"Lịch Tiêm Chủng Mở Rộng & Dịch Vụ"` (`dòng 514-545`) và `"Lần khám Nhi khoa gần nhất"` (`dòng 548-560`) mà không kiểm tra state `tab`, đồng thời tab `'growth'` (`Biểu đồ WHO`) chưa có nội dung hiển thị.
    2. `LabAndImagingResultsScreen` (`src/screens/TelehealthAndFamilyScreens.tsx:1120, 1172-1227`): `SegmentedControl` có 2 tab `{ key: 'imaging', label: 'CĐHA (MRI/X-Quang)', count: 2 }` và `{ key: 'blood', label: 'Xét Nghiệm Máu', count: 14 }`, nhưng bên dưới luôn hiển thị cả 2 khối thẻ cùng lúc (`dòng 1184-1227`).
    3. `FamilyMedicineCabinetScreen` (`src/screens/PharmacyAndMedicationScreens.tsx:343-439`): Hiển thị danh sách tĩnh 3 thuốc (`Sibelium 5mg`, `Ginkgo Biloba 80mg`, `Amlodipine 5mg` tại `dòng 393-435`), chưa có thanh chip lọc theo tình trạng thuốc (`Tất cả` / `Sắp hết` / `Đủ dùng`).
  - **Cách sửa cụ thể:**
    - Tại `ChildEHRDetailScreen`: Lọc hiển thị đúng thẻ theo `tab === 'exam'` và `tab === 'vaccine'`; với tab `'growth'` (`Biểu đồ WHO`), **tuyệt đối không tự thêm nội dung y khoa mới** — chỉ hiển thị từ dữ liệu sẵn có (`104 cm`, `16.5 kg`, `BMI 15.2`) kèm trạng thái `"Sắp ra mắt"` cho biểu đồ bách phân vị.
    - Tại `LabAndImagingResultsScreen`: Render khối CĐHA khi `tab === 'imaging'` và khối Xét nghiệm máu khi `tab === 'blood'`.
    - Tại `FamilyMedicineCabinetScreen`: Bổ sung `SegmentedControl` lọc `Tất cả` / `Sắp hết` / `Đủ dùng` kèm `EmptyState`.

  #### `[P0-09]` ✅ *(Commit `09dc390`)* Nút "Làm mới cuộc trò chuyện" và mô phỏng trạng thái đang trả lời (`AITypingIndicator`) trong `AIAssistantScreen`
  - **Vị trí:** `src/screens/MainTabScreens.tsx:787-888`
  - **Cách sửa cụ thể:**
    - Cho phép nút `"Làm mới cuộc trò chuyện"` (`dòng 830`) đặt lại hội thoại về câu chào ban đầu.
    - Mô phỏng `AITypingIndicator` ngắn cho dữ liệu mẫu và **ghi chú rõ `// TODO: Replace simulated typing timeout and sample response with real AI triage backend API`**.

  ---

  ### 🟠 MỨC P1 — TRẢI NGHIỆM NGƯỜI LỚN TUỔI, BỐ CỤC, VÙNG BẤM >= 44PT & TRẠNG THÁI (13 LỖI — ✅ ĐÃ HOÀN THÀNH ĐỢT 2A & ĐỢT 2B)

  #### **Phân nhóm Đợt 2:**
  - **Đợt 2a (`ux/phase-2a` — ✅ Đã hoàn thành & Merge vào `main`):** `P1-04` (`497aa2f`), `P1-06` (`813631e`), `A-11` (`807b71c`), `P1-01` (`648b384`), `P1-13` (`51110b2`)
  - **Đợt 2b (`ux/phase-2b` — ✅ Đã hoàn thành):** `P1-03` (`75f897c`), `P1-05` (`a77d054`), `P1-07` (`3ec0e89`), `P1-08` (`ac0b8ef`), `P1-09` (`ed84c0d`), `P1-10` (`c911be9`), `P1-11` (`da19c18`), `P1-12` (`732266f`), `P1-02` (`5ecca16`)

  1. **`[P1-01]` ✅ *(Commit `648b384`)* Đưa Lịch hẹn sắp tới lên đầu Trang chủ, thu gọn `AIHeroBanner` và giảm lối vào trùng lặp:**
    - **Vị trí:** `src/screens/MainTabScreens.tsx:154-255` và `src/components/medical/AIHeroBanner.tsx:21-74`
    - **Cách sửa:** Đưa khối `"Lịch khám sắp tới"` lên ngay dưới thanh Tìm kiếm; thu gọn `AIHeroBanner` còn một dải gọn (tiêu đề ngắn + nút `"Hỏi AI"`, bỏ vòng tròn trang trí) và rút gọn lưới `quickServices` từ 6 ô xuống 4 ô (`Nhật ký thuốc`, `Hồ sơ Gia đình`, `Tủ thuốc nhà`, `Kết quả CĐHA`) xếp 2×2.
  2. **`[P1-02]` ✅ *(Commit `5ecca16`)* Chuông thông báo trên `HomeGreetingHeader` mở đúng danh sách thông báo:**
    - **Vị trí:** `src/screens/MainTabScreens.tsx:214, 450-600` và `src/components/navigation/AppHeader.tsx:182-195`
    - **Cách sửa:** Khi bấm biểu tượng chuông thông báo trên Header Trang chủ, hiển thị sheet danh sách thông báo y tế (Lịch hẹn sắp tới, Nhắc uống thuốc, Kết quả MRI & Xét nghiệm) thay vì nhảy thẳng vào màn hình `medLog`.
  3. **`[P1-03]` ✅ *(Commit `75f897c`)* Ghi rõ nguồn trích xuất bác sĩ (với ngày sinh động theo ngày hiện tại) cho thẻ `AIClinicalInsightCard`:**
    - **Vị trí:** `src/components/medical/AIHeroBanner.tsx:110-165`
    - **Cách sửa:** Ghi rõ nguồn dưới tiêu đề và nội dung: `"Tóm tắt từ kết luận khám gần nhất của TS. BS. Lê Thu Trang (Khoa Nội Thần Kinh)"`, sử dụng ngày tính động từ thời gian hiện tại (`formatRelativeDay`).
  4. **`[P1-04]` ✅ *(Commit `497aa2f`)* Nâng chiều cao `AppButton size="sm"` từ `40pt` lên chuẩn `44pt` (`TOUCH.min`):**
    - **Vị trí:** `src/components/common/AppButton.tsx:55-59`, `src/screens/PharmacyAndMedicationScreens.tsx:570-577`, `src/screens/RoleDashboards.tsx:1155-1158`
    - **Cách sửa:** Đổi `heightMap.sm` thành `TOUCH.min` (`44pt`), đồng thời nâng `confirmBtnWrap` ở `MedicationLogScreen` lên `minHeight: TOUCH.min` và căn chỉnh `docActionRow` ở `RoleDashboards`.
  5. **`[P1-05]` ✅ *(Commit `a77d054`)* Xử lý các điều hướng sai đích trên `EHRScreen` và `ProfileSettingsScreen` (không tạo xác nhận chữ ký số giả):**
    - **Vị trí:** `src/screens/MainTabScreens.tsx:500-560, 955` và `src/components/medical/PrescriptionCard.tsx:123-163`
    - **Cách sửa:** Bỏ nút `"Xác thực chữ ký số"` giả trên `LabImagingCard`; sửa nút `"BHYT: 80%"` và `"Sửa hồ sơ"` đúng ngữ cảnh.
  6. **`[P1-06]` ✅ *(Commit `813631e`)* Nâng vùng chạm các nút icon tròn (`AppHeader`, `PatientEHRCard`, `HospitalCard`, `DoctorDetailScreen`, `AIChatComponents`) và các chip lọc (`SegmentedControl`) lên `>= 44x44pt`:**
    - **Vị trí:** `AppHeader.tsx:219-285, 327-335`, `PatientEHRCard.tsx:76-94, 114-123, 202-213, 448-487`, `HospitalCard.tsx:150-160`, `BookingFlowScreens.tsx:751-758`, `AIChatComponents.tsx:548-585`, `SegmentedControl.tsx:89-103, 164-172, 226-233`
    - **Cách sửa:** Nâng kích thước các nút tròn và chip lọc lên `TOUCH.min` (`44pt`) hoặc `minHeight: 36` + `hitSlop={TOUCH.hitSlopMd}`.
  7. **`[P1-07]` ✅ *(Commit `3ec0e89`)* Đổi `textMuted` / `placeholder` sang `#5B646E` (đạt tương phản `>= 5.45:1` trên cả 3 nền), tăng cỡ chữ nhỏ (`9–11pt`) và nới `maxFontSizeMultiplier` trên `BottomTabBar`:**
    - **Vị trí:** `src/theme/index.ts:30, 32`, `BottomTabBar.tsx:90, 128`, `AIChatComponents.tsx:380, 388, 521`, `HospitalCard.tsx:126-166`, `HospitalMapModal.tsx:482-688`
    - **Cách sửa:** Đổi `textMuted: '#5B646E'` và `placeholder: '#5B646E'` (đạt **6.01:1** trên `#FFFFFF`, **5.71:1** trên `#FAF8FF`, **5.45:1** trên `#F2F3FF`); nới `maxFontSizeMultiplier` trên `BottomTabBar.tsx:90` lên `1.4`; nâng cỡ chữ tin nhắn chat lên `14.5pt` và các nhãn `9–10pt` lên tối thiểu `12pt`.
  8. **`[P1-08]` ✅ *(Commit `ac0b8ef`)* Loại bỏ cặp nút lặp trên `PostConsultSummaryScreen` và `BookingSuccessScreen`:**
    - **Vị trí:** `src/screens/TelehealthAndFamilyScreens.tsx:278-294, 1126-1149`
    - **Cách sửa:** Xóa 2 nút lặp bên dưới `ActivePrescriptionCard` trong `PostConsultSummaryScreen`; trên `BookingSuccessScreen`, chuẩn hóa nút `"Xem lịch khám của tôi"`.
  9. **`[P1-09]` ✅ *(Commit `ed84c0d`)* Bổ sung `EmptyState` cho các danh sách có thể rỗng (`AppointmentsScreen` tab Đã khám / Đã hủy, `EHRScreen` tab Đơn thuốc):**
    - **Vị trí:** `src/screens/MainTabScreens.tsx:521-549, 729-797`
    - **Cách sửa:** Chỉ bổ sung `EmptyState` khi mảng rỗng (không tạo `loading`/`error` giả khi chưa có API).
  10. **`[P1-10]` ✅ *(Commit `c911be9`)* Bổ sung thuộc tính trợ năng (`accessibilityRole`, `accessibilityState`) cho bộ chọn ngày/giờ khám và phương thức thanh toán:**
      - **Vị trí:** `src/components/common/Animations.tsx:73-121`, `src/components/medical/DateTimeSlotPicker.tsx:37-146` và `src/screens/BookingFlowScreens.tsx:590-605`
      - **Cách sửa:** Gắn `accessibilityRole="button"` / `"radio"` và `accessibilityState={{ selected }}` cho từng ngày khám, khung giờ khám và phương thức thanh toán.
  11. **`[P1-11]` ✅ *(Commit `da19c18`)* Thu gọn thẻ thông tin bác sĩ trên đầu màn hình `TeleconsultationScreen`:**
      - **Vị trí:** `src/screens/TelehealthAndFamilyScreens.tsx:886-935`
      - **Cách sửa:** Rút gọn thanh thông tin ca tư vấn và bỏ các badge `"TRỰC TUYẾN"` / `"Bác sĩ online"` lặp 3 lần.
  12. **`[P1-12]` ✅ *(Commit `732266f`)* *(Chuyển từ P0-07)* Truyền người khám đã chọn qua route state tới `BookingPaymentScreen`:**
      - **Vị trí:** `App.tsx`, `src/screens/TelehealthAndFamilyScreens.tsx:301-445` (`FamilyProfilesScreen`), và `src/screens/BookingFlowScreens.tsx:421-545` (`BookingPaymentScreen`)
      - **Cách sửa:** Khi bấm `"Đặt lịch khám"` từ hồ sơ một thành viên trong `FamilyProfilesScreen`, lưu thành viên được chọn vào state điều hướng tại `App.tsx` và truyền xuống `BookingPaymentScreen` để hiển thị đúng tên, tuổi, mã BHYT của người khám (mặc định là chủ tài khoản `PATIENT_PROFILE` nếu đặt từ Trang chủ) thay vì thêm bộ chọn trực tiếp ở màn hình thanh toán.
  13. **`[P1-13]` ✅ *(Commit `51110b2`)* Danh sách lịch hẹn sắp tới (Trang chủ và tab Lịch khám) xếp theo thời gian gần nhất trước:**
      - **Vị trí:** `src/screens/MainTabScreens.tsx:70-105, 137-140, 628-630`
      - **Cách sửa:** Sắp xếp danh sách lịch hẹn sắp tới theo thứ tự thời gian gần nhất trước dựa trên trường ngày/giờ hiện có (`timeRange`, `dateLabel`, `code`) mà không sửa dữ liệu gốc trong `mockData.ts`.

  ---

  ### 🟡 MỨC P2 — KHỬ "MÙI AI" (AI SLOP), SINH NGÀY DỮ LIỆU ĐỘNG & ĐỒNG BỘ TOKEN (8 LỖI — ✅ ĐÃ HOÀN THÀNH ĐỢT 3A)

  1. **`[P2-01]` ✅ *(Commit `f2e506b`)* Giảm độ trễ chuỗi `AnimatedEntry` (`delay` lên tới `370ms`) theo chuẩn `Operate Mode`:**
    - **Vị trí:** `src/components/common/Animations.tsx:21-60` và các màn hình trong `src/screens/`
    - **Cách sửa:** Rút ngắn thời gian animation (`duration <= 220ms`), giới hạn `delay` tối đa `<= 60ms` và xử lý triệt để 66 lỗi lint `react-hooks/refs`.
  2. **`[P2-02]` ✅ *(Commit `07e7513`)* Xóa phụ đề quảng cáo thừa dưới các `SectionHeader`:**
    - **Vị trí:** `src/screens/MainTabScreens.tsx:246-350, 956`, `src/screens/BookingFlowScreens.tsx:170, 589`
    - **Cách sửa:** Bỏ các `subtitle` mang tính khẩu hiệu marketing.
  3. **`[P2-03]` ✅ *(Commit `b2a17dc`)* Viết lại copy cài đặt và xóa các cụm từ tự bịa kiểu AI (`"Chuông y tế độc quyền: MedAlert Melodic"`, `"94% chuẩn"`, `"tương tác dược động học"`):**
    - **Vị trí:** `src/screens/MainTabScreens.tsx:1123-1350` và `src/screens/PharmacyAndMedicationScreens.tsx:36-60`
    - **Cách sửa:** Dùng ngôn từ y tế phổ thông, giản dị và tính toán phần trăm tuân thủ uống thuốc động từ `takenCount / totalDoses`.
  4. **`[P2-04]` ✅ *(Commit `eff94ae`)* Xóa emoji (`👋`, `🏥`) và giảm lạm dụng icon `sparkles` trên các thẻ hành chính:**
    - **Vị trí:** `src/components/navigation/AppHeader.tsx:163`, `src/screens/RoleDashboards.tsx:282`, `src/components/medical/AIHeroBanner.tsx:107-111`
    - **Cách sửa:** Xóa emoji và thay `sparkles` bằng icon y tế tiêu chuẩn.
  5. **`[P2-05]` ✅ *(Commit `00c1b2e`)* Dọn dẹp các nút chết trên `AppHeader` (`showProfileIcon`, `information-circle-outline` không có `onPress`):**
    - **Vị trí:** `src/screens/AuthScreens.tsx:219, 505`, `src/screens/BookingFlowScreens.tsx:73-87, 314-319, 484-490`, `src/screens/MainTabScreens.tsx:1146-1155`
    - **Cách sửa:** Ẩn `showProfileIcon` và các icon header không có hành động.
  6. **`[P2-06]` ✅ *(Commit `254f3d3`)* Sinh ngày tháng dữ liệu mẫu tự động theo ngày hiện tại (`new Date()`), không hardcode ngày cố định:**
    - **Vị trí:** `src/data/mockData.ts` và các màn hình hiển thị ngày khám / đơn thuốc / xét nghiệm
    - **Cách sửa:** Tạo hàm tiện ích `formatRelativeDate(offsetDays)` trong `mockData.ts` để sinh ngày khám sắp tới (`hôm nay`, `+1 ngày`, `+2 ngày`), ngày đơn thuốc (`-2 ngày`), ngày tái khám (`+12 ngày`) hoàn toàn động theo thời gian thực khi mở app.
  7. **`[P2-07]` ✅ *(Commit `873dcf7`)* Thay thế các mã màu hex cứng bằng Design Token trong `src/theme/index.ts`:**
    - **Vị trí:** `src/components/medical/AIChatComponents.tsx:205, 322, 352`, `src/screens/BookingFlowScreens.tsx:962`, `src/components/navigation/BottomTabBar.tsx:106`, `src/components/navigation/AppHeader.tsx:211`
    - **Cách sửa:** Thay bằng `COLORS.tintTeal`, `COLORS.warningText`, `COLORS.border`, `COLORS.divider`, `COLORS.surfaceContainerLow`.
  8. **`[P2-08]` ✅ *(Commit `7266660`)* Đổi nhãn "Chẩn đoán sơ bộ & kết luận" trên `PrescriptionCard`:**
    - **Vị trí:** `src/components/medical/PrescriptionCard.tsx:239`
    - **Cách sửa:** Đổi nhãn `"Chẩn đoán sơ bộ & kết luận:"` thành `"Chẩn đoán & kết luận của bác sĩ:"` để phân biệt rõ kết luận chuyên môn của bác sĩ điều trị với sàng lọc triệu chứng.

  ---

  ## PHỤ LỤC: CÁC LỖI NHỎ & CHI TIẾT UX BỔ SUNG (APPENDIX `A-01` → `A-13` — ✅ ĐÃ HOÀN THÀNH ĐỢT 3B)

  | Mã | Màn hình / Thành phần | Vị trí (`file:dòng`) | Mô tả chi tiết vấn đề | Hướng xử lý cụ thể |
  | :--- | :--- | :--- | :--- | :--- |
  | **A-01** ✅ *(Commit `d80ae3e`)* | `LoginScreen` — Quên mật khẩu | `src/screens/AuthScreens.tsx:400-402` | Nút `"Quên mật khẩu?"` chưa có `onPress` và chiều cao vùng bấm `< 44pt`. | Bổ sung `minHeight: 44` và hiển thị hướng dẫn khôi phục mật khẩu qua SĐT/CSKH. |
  | **A-02** ✅ *(Commit `38d9aa6`)* | `AIAssistantScreen` — Nút chết trên thanh nhập chat | `src/components/medical/AIChatComponents.tsx:273-288` | Hai nút đính kèm ảnh (`attach-outline`) và nhập giọng nói (`mic-outline`) dưới `ChatBottomInputBar` không có `onPress`. | Gắn thông báo `"Tính năng gửi ảnh/giọng nói sắp ra mắt"` để người dùng không bấm vô ích. |
  | **A-03** ✅ *(Commit `531d225`)* | `DoctorCard` & `AIChatComponents` — Tên bác sĩ bị cắt | `src/components/medical/DoctorCard.tsx:56, 114, 198` & `AIChatComponents.tsx:157` | Tên bác sĩ ghép chung với học vị dài (`"PGS. TS. BS. Nguyễn Hoàng Minh"`) bị ép `numberOfLines={1}` trên thẻ hẹp khiến phần tên riêng bị cắt thành `...`. | Cho phép tên bác sĩ hiển thị tối đa `numberOfLines={2}`. |
  | **A-04** ✅ *(Commit `7df173b`)* | `AppointmentCard` — Nút "Hủy lịch" sát liên kết khác | `src/components/medical/AppointmentCard.tsx:211-228` | Ở lịch hẹn trực tuyến (`!isClinic`), nút `"Hủy lịch"` (màu đỏ) đặt ngang hàng và sát với `"Chi tiết cuộc hẹn"`, dễ bấm nhầm. | Thay bằng nút phụ dạng viền (`variant="outline"`, `size="md"`, `>= 44pt`) có hộp thoại xác nhận trước khi hủy (xử lý cùng `P0-04`). |
  | **A-05** ✅ *(Commit `25eff43`)* | `SpecialtyGrid` — Icon Nha khoa dùng `sparkles` | `src/data/mockData.ts:95` & `src/components/medical/SpecialtyGrid.tsx:58-73` | Chuyên khoa `"Nha khoa"` đang dùng icon `sparkles-outline` trùng với biểu tượng AI (và không được dùng `happy-outline` vì đã dùng cho `"Nhi khoa"` tại `mockData.ts:81`). | Sử dụng icon chiếc răng `tooth-outline` từ bộ `MaterialCommunityIcons` có sẵn trong thư viện `@expo/vector-icons` của dự án cho chuyên khoa Nha khoa. |
  | **A-06** ✅ *(Commit `b1869b4`)* | `BottomTabBar` — Tên 2 tab dễ nhầm lẫn | `src/components/navigation/BottomTabBar.tsx:24, 30` | Tab 2 (`"Khám bệnh"`) và Tab 3 (`"Lịch khám"`) có tên rất giống nhau, người lớn tuổi khó phân biệt đâu là Hồ sơ bệnh án, đâu là Lịch hẹn. | Đổi nhãn Tab 2 (`records`) từ `"Khám bệnh"` thành `"Hồ sơ"`. |
  | **A-07** ✅ *(Commit `9c749e5`)* | `LabAndImagingResultsScreen` — Copy PACS khó hiểu | `src/screens/TelehealthAndFamilyScreens.tsx:1188` | Có badge kỹ thuật `"PACS v4.2"` gây khó hiểu cho bệnh nhân. | Bỏ badge `"PACS v4.2"`; giữ nguyên dữ liệu kết luận bác sĩ hiện có. |
  | **A-08** ✅ *(Commit `38d9aa6`)* | `AIAssistantScreen` — Tiêu đề tiếng Anh | `src/screens/MainTabScreens.tsx:821` | `AppHeader` dùng tiêu đề tiếng Anh `"AI Health Assistant"` trong ứng dụng tiếng Việt cho bệnh nhân lớn tuổi. | Đổi tiêu đề thành `"Trợ lý Sức khỏe AI"`. |
  | **A-09** ✅ *(Commit `38d9aa6`)* | `AIAssistantScreen` — Nút lịch sử chat chết | `src/screens/MainTabScreens.tsx:826` | Nút `rightActions` `{ icon: 'time-outline', label: 'Lịch sử trò chuyện' }` trên Header màn AI không gắn `onPress`. | Ẩn nút lịch sử chưa có chức năng trên Header màn AI. |
  | **A-10** ✅ *(Commit `9c749e5`)* | `BookingSuccessScreen` — Hiện phòng chờ online khi khám tại viện | `src/screens/TelehealthAndFamilyScreens.tsx:264-271` | Nút `"Mở phòng chờ khám trực tuyến"` luôn hiển thị cả khi bệnh nhân đặt lịch khám trực tiếp tại bệnh viện (`consultMode === 'clinic'`). | Chỉ hiển thị nút vào phòng chờ trực tuyến khi lịch hẹn là tư vấn trực tuyến (`consultMode === 'chat'`). |
  | **A-11** ✅ *(Commit `807b71c`)* | `HomeScreen` — Nút "Xóa bộ lọc" quá nhỏ | `src/screens/MainTabScreens.tsx:357-367, 1316-1324` | Nút `clearFilterBtn` (`"Xóa bộ lọc"`) khi tìm kiếm trống chỉ có `paddingVertical: SPACING.xs (4pt)` -> chiều cao `~26pt` (`< 44pt`). | Tăng `minHeight: TOUCH.min` (`44pt`), `paddingHorizontal: SPACING.lg`, `justifyContent: 'center'`. |
  | **A-12** ✅ *(Commit `531d225`)* | `DoctorDetailScreen` — Tên bệnh viện lặp 4 lần | `src/components/medical/DoctorCard.tsx:112, 121` & `src/screens/BookingFlowScreens.tsx:108, 157` | Tên bệnh viện (`"BV ĐHYD TP.HCM"`) lặp lại 4 lần trên cùng màn hình Chi tiết Bác sĩ (trên Badge xanh, dưới học vị, trong thẻ Địa điểm, và ở tiêu đề Lịch trực). | Bỏ badge `"BV ĐHYD TP.HCM"` bị lặp trên `DoctorProfileHeaderCard` (vì ngay bên dưới đã có dòng tên bệnh viện đầy đủ). |
  | **A-13** ✅ *(Commit `d1862d6`)* | `AdminDashboardScreen` — Số liệu `"99.98%"` uptime tự bịa | `src/screens/RoleDashboards.tsx:89` | Thẻ quản trị hệ thống hiển thị con số `"99.98%"` uptime là số liệu marketing tự bịa không có nguồn đo thực tế. | Thay con số `"99.98%"` / `"Uptime Server"` tự bịa bằng `"Hoạt động"` / `"Trạng thái hệ thống"` và cập nhật ngày động theo `formatRelativeDate(0)`. |

  ---

  ## PHẦN 4: TIẾN ĐỘ THỰC HIỆN THEO ĐỢT

  | Đợt | Nhánh Git | Hạng mục | Trạng thái | Danh sách Commit |
  | :--- | :--- | :--- | :--- | :--- |
  | **Đợt 1a (`P0`)** | `ux/phase-1a` | `P0-01`, `P0-02`, `P0-03`, `P0-08`, `P0-10` | ✅ **Đã hoàn thành & Merge vào `main`** | `ec10863` (`P0-01`), `627499c` (`P0-02`), `e83d17c` (`P0-03`), `3dd4282` (`P0-08`), `633a030` (`P0-10`) |
  | **Đợt 1b (`P0`)** | `ux/phase-1b` | `P0-04`, `P0-05`, `P0-06`, `P0-09` | ✅ **Đã hoàn thành & Merge vào `main`** | `7df173b` (`P0-04`), `2857ef9` (`P0-05`), `01f488f` (`P0-06`), `09dc390` (`P0-09`) |
  | **Cấu hình Lint** | `chore/eslint` | Cài đặt `eslint@^9.0.0`, `eslint-config-expo@~58.0.4` | ✅ **Đã hoàn thành & Merge vào `main`** | `e966631` (`chore: add eslint (expo) devDependencies`) |
  | **Đợt 2a (`P1`)** | `ux/phase-2a` | `Bước 0 (docs)`, `P1-04`, `P1-06`, `A-11`, `P1-01`, `P1-13` | ✅ **Đã hoàn thành & Merge vào `main`** | `57ddca7` (`Bước 0`), `497aa2f` (`P1-04`), `813631e` (`P1-06`), `807b71c` (`A-11`), `648b384` (`P1-01`), `51110b2` (`P1-13`) |
  | **Đợt 2b (`P1`)** | `ux/phase-2b` | `P1-03`, `P1-05`, `P1-07`, `P1-08`, `P1-09`, `P1-10`, `P1-11`, `P1-12`, `P1-02` | ✅ **Đã hoàn thành & Merge vào `main`** | `75f897c` (`P1-03`), `a77d054` (`P1-05`), `3ec0e89` (`P1-07`), `ac0b8ef` (`P1-08`), `ed84c0d` (`P1-09`), `c911be9` (`P1-10`), `da19c18` (`P1-11`), `732266f` (`P1-12`), `5ecca16` (`P1-02`) |
  | **Đợt 3a (`P2`)** | `ux/phase-3a` | `P2-01` → `P2-08` (+ xử lý 66 lỗi `react-hooks/refs`) | ✅ **Đã hoàn thành & Merge vào `main`** | `f2e506b` (`P2-01`), `07e7513` (`P2-02`), `b2a17dc` (`P2-03`), `eff94ae` (`P2-04`), `00c1b2e` (`P2-05`), `254f3d3` (`P2-06`), `873dcf7` (`P2-07`), `7266660` (`P2-08`) |
  | **Đợt 3b (Phụ lục)** | `ux/phase-3b` | Phụ lục còn lại (`A-01`, `A-02`, `A-03`, `A-05`, `A-06`, `A-07`, `A-08`, `A-09`, `A-10`, `A-12`, `A-13`) | ✅ **Đã hoàn thành (Chờ nghiệm thu)** | `d80ae3e` (`A-01`), `38d9aa6` (`A-02, A-08, A-09`), `531d225` (`A-03, A-12`), `25eff43` (`A-05`), `b1869b4` (`A-06`), `9c749e5` (`A-07, A-10`), `d1862d6` (`A-13`) |

  ---

  ## PHẦN 5: NỢ KỸ THUẬT LINT (BASELINE HIỆN TẠI: 69 LỖI / 38 CẢNH BÁO)

  > **Cấu hình kiểm tra:**
  > - `app.json`: Chưa bật `experiments.reactCompiler` (không có trường `experiments`). Tuy nhiên `eslint-config-expo@~58.0.4` mặc định tích hợp `eslint-plugin-react-hooks` v7 nên các rule của React Compiler (`react-hooks/refs`, `react-hooks/purity`, `react-hooks/set-state-in-effect`) vẫn được kích hoạt.
  > - `package.json`: `"expo": "~58.0.21"` khớp dòng SDK 58 với `"eslint-config-expo": "~58.0.4"`.
  > - **Baseline hiện tại (`main` @ `e966631`):** **107 vấn đề = 69 lỗi (`error`) + 38 cảnh báo (`warning`)**.

  ### 5.1. Danh sách Rule & File theo Baseline

  | Rule | Mức độ | Số lượng | File bị ảnh hưởng |
  | :--- | :---: | :---: | :--- |
  | `react-hooks/refs` | 🔴 **Error** | **66** | • `src/components/common/Animations.tsx` (**56 lỗi** tại các dòng `33, 34, 53, 57, 59, 90, 139, 140, 173, 178, 180, 221, 326, 327, 328, 362, 381, 382, 398, 402`)<br>• `src/screens/AuthScreens.tsx` (**10 lỗi** tại các dòng `31, 32, 48, 50` trong `SplashScreen`) |
  | `react-hooks/purity` | 🔴 **Error** | **2** | • `src/screens/TelehealthAndFamilyScreens.tsx` (**2 lỗi** tại dòng `850` và `867` do gọi `Date.now()`) |
  | `react-hooks/set-state-in-effect` | 🔴 **Error** | **1** | • `src/components/medical/HospitalMapModal.tsx` (**1 lỗi** tại dòng `93` do gọi `setRouteState('idle')` đồng bộ trong `useEffect`) |
  | `@typescript-eslint/no-unused-vars` | 🟡 **Warning** | **38** | • `src/screens/BookingFlowScreens.tsx` (16)<br>• `src/components/medical/SpecialtyGrid.tsx` (3)<br>• `src/screens/RoleDashboards.tsx` (3)<br>• `src/components/medical/HospitalCard.tsx` (2)<br>• `src/screens/MainTabScreens.tsx` (2)<br>• `src/screens/PharmacyAndMedicationScreens.tsx` (2)<br>• `src/screens/TelehealthAndFamilyScreens.tsx` (2)<br>• `src/components/medical/AIHeroBanner.tsx` (1)<br>• `src/components/medical/AppointmentCard.tsx` (1)<br>• `src/components/medical/DateTimeSlotPicker.tsx` (1)<br>• `src/components/medical/DoctorCard.tsx` (1)<br>• `src/components/medical/HospitalMapModal.tsx` (1)<br>• `src/components/medical/PatientEHRCard.tsx` (1)<br>• `src/components/navigation/AppHeader.tsx` (1)<br>• `src/context/AppContext.tsx` (1) |

  ### 5.2. Đề xuất lộ trình xử lý nợ kỹ thuật Lint
  - **`react-hooks/refs` (66 lỗi):** ✅ **Đã xử lý triệt để (0 lỗi)** tại commit `f2e506b` (`P2-01`), giảm tổng số lỗi lint từ **69 lỗi** xuống còn **3 lỗi** (`40 problems: 3 errors, 37 warnings`).
  - **`react-hooks/purity` (`TelehealthAndFamilyScreens.tsx:850, 867` — 2 lỗi):** Sửa ở đợt sau.
  - **`@typescript-eslint/no-unused-vars` (37 cảnh báo):** Dọn dẹp tập trung ở nhánh riêng `chore/cleanup-imports`.


