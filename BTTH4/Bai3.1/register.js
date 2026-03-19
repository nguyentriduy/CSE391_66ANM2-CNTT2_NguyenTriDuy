// Lấy các phần tử form
const form = document.getElementById('registerForm');
const fullnameEl = document.getElementById('fullname');
const emailEl = document.getElementById('email');
const phoneEl = document.getElementById('phone');
const passwordEl = document.getElementById('password');
const confirmPasswordEl = document.getElementById('confirmPassword');
const genderEls = document.getElementsByName('gender');
const genderHidden = document.getElementById('genderHidden'); 
const termsEl = document.getElementById('terms');

const successMessage = document.getElementById('successMessage');
const registeredName = document.getElementById('registeredName');

// Các phần tử Nâng cấp
const nameCharCountEl = document.getElementById('nameCharCount');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordStrengthBar = document.getElementById('passwordStrengthBar');
const passwordStrengthText = document.getElementById('passwordStrengthText');

// Các hàm tiện ích hiển thị và xóa lỗi
function showError(inputEl, errorId, message) {
    const errorContainer = document.getElementById(errorId);
    if(errorContainer) errorContainer.innerText = message;
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid');
}

function clearError(inputEl, errorId) {
    const errorContainer = document.getElementById(errorId);
    if(errorContainer) errorContainer.innerText = '';
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
}

function clearNeutral(inputEl) {
    inputEl.classList.remove('is-invalid', 'is-valid');
}

// ================= CÁC HÀM VALIDATE TỪNG TRƯỜNG =================

function validateFullname() {
    const value = fullnameEl.value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/; 
    
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
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    
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
    const regex = /^0[0-9]{9}$/; 
    
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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; 
    
    if (value === '') {
        showError(passwordEl, 'passwordError', 'Mật khẩu không được để trống.');
        return false;
    } else if (!regex.test(value)) {
        showError(passwordEl, 'passwordError', 'Mật khẩu phải ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số.');
        return false;
    }
    clearError(passwordEl, 'passwordError');
    
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

// ================= NÂNG CẤP: ĐẾM KÝ TỰ, ẨN/HIỆN MẬT KHẨU, SỨC MẠNH =================

// 1. Đếm ký tự họ tên realtime
fullnameEl.addEventListener('input', function() {
    const currentLength = this.value.length;
    nameCharCountEl.innerText = `${currentLength}/50`;
    
    if (currentLength >= 50) {
        nameCharCountEl.classList.remove('text-muted');
        nameCharCountEl.classList.add('text-danger');
    } else {
        nameCharCountEl.classList.remove('text-danger');
        nameCharCountEl.classList.add('text-muted');
    }
});

// 2. Ẩn/Hiện mật khẩu
togglePasswordBtn.addEventListener('click', function() {
    const type = passwordEl.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordEl.setAttribute('type', type);
    this.innerText = type === 'password' ? '👁' : '🙈'; 
});

// 3. Thanh sức mạnh mật khẩu
passwordEl.addEventListener('input', function() {
    const val = this.value;
    let strength = 0;
    
    if (val.length >= 8) strength += 1;
    if (val.match(/[a-z]+/)) strength += 1;
    if (val.match(/[A-Z]+/)) strength += 1;
    if (val.match(/[0-9]+/)) strength += 1;
    if (val.match(/[$@#&!]+/)) strength += 1;

    passwordStrengthBar.className = 'progress-bar';
    
    if (val.length === 0) {
        passwordStrengthBar.style.width = '0%';
        passwordStrengthText.innerText = '';
    } else if (strength <= 2) { 
        passwordStrengthBar.style.width = '33%';
        passwordStrengthBar.classList.add('bg-danger');
        passwordStrengthText.innerText = 'Mức độ: Yếu';
        passwordStrengthText.className = 'form-text text-danger mt-1 d-block';
    } else if (strength === 3 || strength === 4) { 
        passwordStrengthBar.style.width = '66%';
        passwordStrengthBar.classList.add('bg-warning', 'text-dark');
        passwordStrengthText.innerText = 'Mức độ: Trung bình';
        passwordStrengthText.className = 'form-text text-warning mt-1 d-block';
    } else { 
        passwordStrengthBar.style.width = '100%';
        passwordStrengthBar.classList.add('bg-success');
        passwordStrengthText.innerText = 'Mức độ: Mạnh';
        passwordStrengthText.className = 'form-text text-success mt-1 d-block';
    }
});


// ================= GẮN SỰ KIỆN (EVENTS) CƠ BẢN =================

// Blur
fullnameEl.addEventListener('blur', validateFullname);
emailEl.addEventListener('blur', validateEmail);
phoneEl.addEventListener('blur', validatePhone);
passwordEl.addEventListener('blur', validatePassword);
confirmPasswordEl.addEventListener('blur', validateConfirmPassword);
termsEl.addEventListener('change', validateTerms);

for (let i = 0; i < genderEls.length; i++) {
    genderEls[i].addEventListener('change', validateGender); 
}

// Input (Xóa lỗi realtime)
const inputs = [fullnameEl, emailEl, phoneEl, passwordEl, confirmPasswordEl];
inputs.forEach(input => {
    input.addEventListener('input', function() {
        clearNeutral(this);
        const errorContainer = document.getElementById(this.id + 'Error');
        if (errorContainer) errorContainer.innerText = '';
    });
});

termsEl.addEventListener('input', () => { clearNeutral(termsEl); document.getElementById('termsError').innerText = ''; });
for (let i = 0; i < genderEls.length; i++) {
    genderEls[i].addEventListener('input', () => { clearNeutral(genderHidden); document.getElementById('genderError').innerText = ''; });
}

// Submit Form
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    let isFullnameValid = validateFullname();
    let isEmailValid = validateEmail();
    let isPhoneValid = validatePhone();
    let isPasswordValid = validatePassword();
    let isConfirmPasswordValid = validateConfirmPassword();
    let isGenderValid = validateGender();
    let isTermsValid = validateTerms();

    let isFormValid = isFullnameValid & isEmailValid & isPhoneValid & isPasswordValid & isConfirmPasswordValid & isGenderValid & isTermsValid;

    if (isFormValid) {
        form.classList.add('d-none');
        registeredName.innerText = fullnameEl.value;
        successMessage.classList.remove('d-none');
    }
});