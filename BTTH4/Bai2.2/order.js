// Cấu hình giá sản phẩm
const prices = {
    "ao_thun": 150000,
    "ao_khoac": 250000,
    "balo": 300000
};

// Lấy các phần tử DOM
const form = document.getElementById('orderForm');
const productEl = document.getElementById('product');
const quantityEl = document.getElementById('quantity');
const totalPriceEl = document.getElementById('totalPrice');
const deliveryDateEl = document.getElementById('deliveryDate');
const addressEl = document.getElementById('address');
const noteEl = document.getElementById('note');
const charCountEl = document.getElementById('charCount');
const paymentEls = document.getElementsByName('payment');
const paymentHidden = document.getElementById('paymentHidden');

const confirmDiv = document.getElementById('confirmDiv');
const summaryList = document.getElementById('summaryList');
const btnCancelConfirm = document.getElementById('btnCancelConfirm');
const btnConfirmOrder = document.getElementById('btnConfirmOrder');
const successMessage = document.getElementById('successMessage');

// Hàm tiện ích hiển thị/xóa lỗi (giống bài trước)
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
function clearNeutral(inputEl) {
    inputEl.classList.remove('is-invalid', 'is-valid');
}

// ================= 1. TÍNH TỔNG TIỀN TỰ ĐỘNG =================
function calculateTotal() {
    const productKey = productEl.value;
    const quantity = parseInt(quantityEl.value);
    
    if (productKey && !isNaN(quantity) && quantity > 0) {
        const total = prices[productKey] * quantity;
        totalPriceEl.innerText = total.toLocaleString("vi-VN") + " VNĐ";
    } else {
        totalPriceEl.innerText = "0 VNĐ";
    }
}
productEl.addEventListener('change', calculateTotal);
quantityEl.addEventListener('input', calculateTotal);

// ================= 2. ĐẾM KÝ TỰ REALTIME (GHI CHÚ) =================
noteEl.addEventListener('input', function() {
    const currentLength = this.value.length;
    charCountEl.innerText = `${currentLength}/200`;

    if (currentLength > 200) {
        charCountEl.classList.remove('text-muted');
        charCountEl.classList.add('text-danger');
        showError(noteEl, 'noteError', 'Ghi chú không được vượt quá 200 ký tự.');
    } else {
        charCountEl.classList.remove('text-danger');
        charCountEl.classList.add('text-muted');
        clearError(noteEl, 'noteError');
    }
});

// ================= 3. VALIDATE CÁC TRƯỜNG =================
function validateProduct() {
    if (productEl.value === '') {
        showError(productEl, 'productError', 'Vui lòng chọn sản phẩm.');
        return false;
    }
    clearError(productEl, 'productError');
    return true;
}

function validateQuantity() {
    const qty = parseInt(quantityEl.value);
    if (isNaN(qty) || qty < 1 || qty > 99) {
        showError(quantityEl, 'quantityError', 'Số lượng phải từ 1 đến 99.');
        return false;
    }
    clearError(quantityEl, 'quantityError');
    return true;
}

function validateDate() {
    const dateVal = deliveryDateEl.value;
    if (!dateVal) {
        showError(deliveryDateEl, 'deliveryDateError', 'Vui lòng chọn ngày giao hàng.');
        return false;
    }

    const selectedDate = new Date(dateVal);
    selectedDate.setHours(0,0,0,0); // Đưa về mốc 0h để so sánh chính xác ngày

    const today = new Date();
    today.setHours(0,0,0,0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30); // Cộng thêm 30 ngày

    if (selectedDate < today) {
        showError(deliveryDateEl, 'deliveryDateError', 'Ngày giao không được là ngày trong quá khứ.');
        return false;
    } else if (selectedDate > maxDate) {
        showError(deliveryDateEl, 'deliveryDateError', 'Ngày giao không được quá 30 ngày kể từ hôm nay.');
        return false;
    }

    clearError(deliveryDateEl, 'deliveryDateError');
    return true;
}

function validateAddress() {
    const val = addressEl.value.trim();
    if (val === '') {
        showError(addressEl, 'addressError', 'Địa chỉ giao hàng không được để trống.');
        return false;
    } else if (val.length < 10) {
        showError(addressEl, 'addressError', 'Địa chỉ phải từ 10 ký tự trở lên.');
        return false;
    }
    clearError(addressEl, 'addressError');
    return true;
}

function validateNote() {
    // Nếu có nhập thì không được quá 200
    if (noteEl.value.length > 200) return false; 
    return true; // Không bắt buộc nên nếu trống hoặc <= 200 là hợp lệ
}

function validatePayment() {
    let isChecked = false;
    for (let p of paymentEls) {
        if (p.checked) isChecked = true;
    }
    if (!isChecked) {
        showError(paymentHidden, 'paymentError', 'Vui lòng chọn phương thức thanh toán.');
        return false;
    }
    clearError(paymentHidden, 'paymentError');
    return true;
}

// Gắn sự kiện blur & input (xóa lỗi)
[productEl, quantityEl, deliveryDateEl, addressEl].forEach(el => {
    el.addEventListener('blur', () => {
        if(el.id === 'product') validateProduct();
        if(el.id === 'quantity') validateQuantity();
        if(el.id === 'deliveryDate') validateDate();
        if(el.id === 'address') validateAddress();
    });
    el.addEventListener('input', function() {
        clearNeutral(this);
        document.getElementById(this.id + 'Error').innerText = '';
    });
});

for (let p of paymentEls) {
    p.addEventListener('change', validatePayment);
    p.addEventListener('input', () => { clearNeutral(paymentHidden); document.getElementById('paymentError').innerText = ''; });
}


// ================= 4. XỬ LÝ SUBMIT & XÁC NHẬN ĐƠN HÀNG =================
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let v1 = validateProduct();
    let v2 = validateQuantity();
    let v3 = validateDate();
    let v4 = validateAddress();
    let v5 = validateNote();
    let v6 = validatePayment();

    if (v1 & v2 & v3 & v4 & v5 & v6) {
        // Lấy thông tin tóm tắt
        const productName = productEl.options[productEl.selectedIndex].text;
        const total = totalPriceEl.innerText;
        
        // Hiển thị tóm tắt ra div Xác nhận
        summaryList.innerHTML = `
            <li class="list-group-item"><strong>Sản phẩm:</strong> ${productName}</li>
            <li class="list-group-item"><strong>Số lượng:</strong> ${quantityEl.value}</li>
            <li class="list-group-item"><strong>Ngày giao:</strong> ${deliveryDateEl.value}</li>
            <li class="list-group-item text-danger"><strong>Tổng tiền:</strong> ${total}</li>
        `;
        
        // Ẩn form, hiện modal/div xác nhận
        form.classList.add('d-none');
        confirmDiv.classList.remove('d-none');
    }
});

// Nút Hủy xác nhận -> Quay lại form
btnCancelConfirm.addEventListener('click', () => {
    confirmDiv.classList.add('d-none');
    form.classList.remove('d-none');
});

// Nút Xác nhận -> Báo thành công
btnConfirmOrder.addEventListener('click', () => {
    confirmDiv.classList.add('d-none');
    successMessage.classList.remove('d-none');
});