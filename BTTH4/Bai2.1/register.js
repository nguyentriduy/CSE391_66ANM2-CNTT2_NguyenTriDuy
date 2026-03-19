// Lấy các phần tử form
const form = document.getElementById('registerForm');
const fullnameEl = document.getElementById('fullname');
const emailEl = document.getElementById('email');
const phoneEl = document.getElementById('phone');
const passwordEl = document.getElementById('password');
const confirmPasswordEl = document.getElementById('confirmPassword');
const genderEls = document.getElementsByName('gender');
const genderHidden = document.getElementById('genderHidden'); // Dùng để mượn class Bootstrap hiển thị lỗi
const termsEl = document.getElementById('terms');

const successMessage = document.getElementById('successMessage');
const registeredName = document.getElementById('registeredName');

// Các hàm tiện ích hiển thị và xóa lỗi
function showError(inputEl, errorId, message) {
    const errorContainer = document.getElementById(errorId);
    errorContainer.innerText = message;
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid'); // Thêm viền đỏ
}

function clearError(inputEl, errorId) {
    const errorContainer = document.getElementById(errorId);
    errorContainer.innerText = '';
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid'); // Thêm viền xanh
}

function clearNeutral(inputEl) {
    inputEl.classList.remove('is-invalid', 'is-valid');
}

// ================= CÁC HÀM VALIDATE TỪNG TRƯỜNG =================

function validateFullname() {
    const value = fullnameEl.value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/; // Chỉ chữ [cite: 93]
    
    if (value === '') {
        showError(fullnameEl, 'fullnameError', 'Họ và tên không được để trống.');
        return false;
    } else if (value.length < 3) {
        showError(fullnameEl, 'fullnameError', 'Họ và tên phải từ 3 ký tự trở lên.');
        return false;
    } else if (!regex.test(value)) {
        showError(fullnameEl, 'fullnameError', 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.');
        return false;
    }
    clearError(fullnameEl, 'fullnameError');
    return true;
}

function validateEmail() {
    const value = emailEl.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // [cite: 90]
    
    if (value === '') {
        showError(emailEl, 'emailError', 'Email không được để trống.');
        return false;
    } else if (!regex.test(value)) {
        showError(emailEl, 'emailError', 'Email không đúng định dạng (VD: name@domain.com).');
        return false;
    }
    clearError(emailEl, 'emailError');
    return true;
}

function validatePhone() {
    const value = phoneEl.value.trim();
    const regex = /^0[0-9]{9}$/; // SĐT VN [cite: 91]
    
    if (value === '') {
        showError(phoneEl, 'phoneError', 'Số điện thoại không được để trống.');
        return false;
    } else if (!regex.test(value)) {
        showError(phoneEl, 'phoneError', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.');
        return false;
    }
    clearError(phoneEl, 'phoneError');
    return true;
}

function validatePassword() {
    const value = passwordEl.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // [cite: 92]
    
    if (value === '') {
        showError(passwordEl, 'passwordError', 'Mật khẩu không được để trống.');
        return false;
    } else if (!regex.test(value)) {
        showError(passwordEl, 'passwordError', 'Mật khẩu phải ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số.');
        return false;
    }
    clearError(passwordEl, 'passwordError');
    
    // Nếu confirmPassword đã nhập rồi thì validate lại luôn để đồng bộ
    if (confirmPasswordEl.value !== '') validateConfirmPassword();
    return true;
}

function validateConfirmPassword() {
    const value = confirmPasswordEl.value;
    if (value === '') {
        showError(confirmPasswordEl, 'confirmPasswordError', 'Vui lòng xác nhận mật khẩu.');
        return false;
    } else if (value !== passwordEl.value) {
        showError(confirmPasswordEl, 'confirmPasswordError', 'Mật khẩu xác nhận không khớp.');
        return false;
    }
    clearError(confirmPasswordEl, 'confirmPasswordError');
    return true;
}

function validateGender() {
    let isChecked = false;
    for (let i = 0; i < genderEls.length; i++) {
        if (genderEls[i].checked) {
            isChecked = true;
            break;
        }
    }
    
    if (!isChecked) {
        showError(genderHidden, 'genderError', 'Vui lòng chọn giới tính.');
        return false;
    }
    clearError(genderHidden, 'genderError');
    return true;
}

function validateTerms() {
    if (!termsEl.checked) {
        showError(termsEl, 'termsError', 'Bạn phải đồng ý với điều khoản.');
        return false;
    }
    clearError(termsEl, 'termsError');
    return true;
}

// ================= GẮN SỰ KIỆN (EVENTS) =================

// 1. Gắn sự kiện blur (rời khỏi ô) để validate [cite: 111]
fullnameEl.addEventListener('blur', validateFullname);
emailEl.addEventListener('blur', validateEmail);
phoneEl.addEventListener('blur', validatePhone);
passwordEl.addEventListener('blur', validatePassword);
confirmPasswordEl.addEventListener('blur', validateConfirmPassword);
termsEl.addEventListener('change', validateTerms); // Dùng change cho checkbox

for (let i = 0; i < genderEls.length; i++) {
    genderEls[i].addEventListener('change', validateGender); // Dùng change cho radio
}

// 2. Gắn sự kiện input (bắt đầu nhập lại) để xóa lỗi ngay lập tức [cite: 112]
const inputs = [fullnameEl, emailEl, phoneEl, passwordEl, confirmPasswordEl];
inputs.forEach(input => {
    input.addEventListener('input', function() {
        clearNeutral(this);
        const errorContainer = document.getElementById(this.id + 'Error');
        if (errorContainer) errorContainer.innerText = '';
    });
});

// Xóa lỗi ngay khi tick/chọn
termsEl.addEventListener('input', () => { clearNeutral(termsEl); document.getElementById('termsError').innerText = ''; });
for (let i = 0; i < genderEls.length; i++) {
    genderEls[i].addEventListener('input', () => { clearNeutral(genderHidden); document.getElementById('genderError').innerText = ''; });
}

// 3. Xử lý khi Submit form [cite: 109, 117]
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn form tải lại trang [cite: 109]

    // Gọi tất cả các hàm validate. Dùng toán tử bitwise `&` để đảm bảo gọi TẤT CẢ các hàm, không bị ngắt quãng nửa chừng[cite: 117].
    let isFullnameValid = validateFullname();
    let isEmailValid = validateEmail();
    let isPhoneValid = validatePhone();
    let isPasswordValid = validatePassword();
    let isConfirmPasswordValid = validateConfirmPassword();
    let isGenderValid = validateGender();
    let isTermsValid = validateTerms();

    let isFormValid = isFullnameValid & isEmailValid & isPhoneValid & isPasswordValid & isConfirmPasswordValid & isGenderValid & isTermsValid;

    if (isFormValid) {
        // Ẩn form, hiện thông báo thành công [cite: 113]
        form.classList.add('d-none');
        registeredName.innerText = fullnameEl.value;
        successMessage.classList.remove('d-none');
    }
});