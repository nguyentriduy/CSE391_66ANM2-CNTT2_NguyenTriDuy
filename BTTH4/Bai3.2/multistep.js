// Quản lý các bước
const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3')
];
let currentStepIndex = 0; // Bắt đầu từ Bước 1 (index 0)

// Các nút điều hướng
const btnNext1 = document.getElementById('btnNext1');
const btnPrev2 = document.getElementById('btnPrev2');
const btnNext2 = document.getElementById('btnNext2');
const btnPrev3 = document.getElementById('btnPrev3');
const form = document.getElementById('multiStepForm');

const progressBar = document.getElementById('progressBar');
const summaryList = document.getElementById('summaryList');
const successMessage = document.getElementById('successMessage');

// Các phần tử input
const fullnameEl = document.getElementById('fullname');
const dobEl = document.getElementById('dob');
const genderEls = document.getElementsByName('gender');
const genderHidden = document.getElementById('genderHidden');

const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const confirmPasswordEl = document.getElementById('confirmPassword');

// Hàm tiện ích hiển thị lỗi
function showError(inputEl, errorId, message) {
    document.getElementById(errorId).innerText = message;
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid');
}
function clearError(inputEl, errorId) {
    document.getElementById(errorId).innerText = '';
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
}

// ================= VALIDATE BƯỚC 1 =================
function validateStep1() {
    let isValid = true;

    // Validate Họ tên
    if (fullnameEl.value.trim() === '') {
        showError(fullnameEl, 'fullnameError', 'Vui lòng nhập họ và tên.');
        isValid = false;
    } else { clearError(fullnameEl, 'fullnameError'); }

    // Validate Ngày sinh
    if (dobEl.value === '') {
        showError(dobEl, 'dobError', 'Vui lòng chọn ngày sinh.');
        isValid = false;
    } else { clearError(dobEl, 'dobError'); }

    // Validate Giới tính
    let isGenderChecked = false;
    for (let radio of genderEls) {
        if (radio.checked) isGenderChecked = true;
    }
    if (!isGenderChecked) {
        showError(genderHidden, 'genderError', 'Vui lòng chọn giới tính.');
        isValid = false;
    } else { clearError(genderHidden, 'genderError'); }

    return isValid;
}

// ================= VALIDATE BƯỚC 2 =================
function validateStep2() {
    let isValid = true;

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailEl.value.trim() === '' || !emailRegex.test(emailEl.value.trim())) {
        showError(emailEl, 'emailError', 'Email không hợp lệ.');
        isValid = false;
    } else { clearError(emailEl, 'emailError'); }

    // Validate Password
    if (passwordEl.value.length < 6) {
        showError(passwordEl, 'passwordError', 'Mật khẩu phải từ 6 ký tự.');
        isValid = false;
    } else { clearError(passwordEl, 'passwordError'); }

    // Validate Confirm Password
    if (confirmPasswordEl.value === '' || confirmPasswordEl.value !== passwordEl.value) {
        showError(confirmPasswordEl, 'confirmPasswordError', 'Mật khẩu xác nhận không khớp.');
        isValid = false;
    } else { clearError(confirmPasswordEl, 'confirmPasswordError'); }

    return isValid;
}

// ================= HÀM CHUYỂN BƯỚC VÀ CẬP NHẬT GIAO DIỆN =================
function updateView() {
    // Ẩn tất cả các bước, chỉ hiện bước hiện tại
    steps.forEach((step, index) => {
        if (index === currentStepIndex) {
            step.classList.remove('d-none');
        } else {
            step.classList.add('d-none');
        }
    });

    // Cập nhật Progress Bar
    let percentage = ((currentStepIndex + 1) / steps.length) * 100;
    progressBar.style.width = percentage + '%';
    progressBar.innerText = `Bước ${currentStepIndex + 1} / ${steps.length}`;

    // Nếu đang ở Bước 3, hiển thị tóm tắt dữ liệu
    if (currentStepIndex === 2) {
        let genderVal = '';
        for (let radio of genderEls) { if (radio.checked) genderVal = radio.value; }
        
        // Format lại ngày sinh cho đẹp (dd/mm/yyyy)
        let dobParts = dobEl.value.split('-');
        let dobFormatted = `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`;

        summaryList.innerHTML = `
            <li class="list-group-item"><strong>Họ và tên:</strong> ${fullnameEl.value}</li>
            <li class="list-group-item"><strong>Ngày sinh:</strong> ${dobFormatted}</li>
            <li class="list-group-item"><strong>Giới tính:</strong> ${genderVal}</li>
            <li class="list-group-item"><strong>Email:</strong> ${emailEl.value}</li>
            <li class="list-group-item"><strong>Mật khẩu:</strong> ********</li>
        `;
    }
}

// ================= GẮN SỰ KIỆN NÚT ĐIỀU HƯỚNG =================

btnNext1.addEventListener('click', () => {
    if (validateStep1()) {
        currentStepIndex++;
        updateView();
    }
});

btnPrev2.addEventListener('click', () => {
    currentStepIndex--;
    updateView(); // Dữ liệu cũ tự động giữ nguyên do không reload lại trang
});

btnNext2.addEventListener('click', () => {
    if (validateStep2()) {
        currentStepIndex++;
        updateView();
    }
});

btnPrev3.addEventListener('click', () => {
    currentStepIndex--;
    updateView();
});

// Xóa lỗi khi người dùng nhập lại (Event Delegation)
form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
        e.target.classList.remove('is-invalid', 'is-valid');
        let errorContainer = document.getElementById(e.target.id + 'Error');
        if (errorContainer) errorContainer.innerText = '';
    }
});
genderEls.forEach(radio => {
    radio.addEventListener('change', () => {
        genderHidden.classList.remove('is-invalid');
        document.getElementById('genderError').innerText = '';
    });
});

// ================= XỬ LÝ KHI GỬI FORM (SUBMIT) =================
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Ẩn form, hiện lời chúc thành công
    form.classList.add('d-none');
    successMessage.classList.remove('d-none');
    progressBar.parentElement.classList.add('d-none'); // Ẩn luôn thanh tiến trình
});