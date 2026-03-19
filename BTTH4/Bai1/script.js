// 1. Khởi tạo mảng lưu trữ sinh viên
let students = [];
let filteredStudents = []; // Mảng hiển thị sau khi lọc/tìm kiếm
let sortDirection = ''; // 'asc', 'desc', hoặc rỗng

// 2. Lấy các phần tử DOM cần thiết
const hoTenInput = document.getElementById('hoTen');
const diemInput = document.getElementById('diem');
const btnAdd = document.getElementById('btnAdd');
const dataTable = document.getElementById('dataTable');
const txtTongSinhVien = document.getElementById('tongSinhVien');
const txtDiemTrungBinh = document.getElementById('diemTrungBinh');

const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const sortDiemBtn = document.getElementById('sortDiem');
const sortIcon = document.getElementById('sortIcon');

// 3. Hàm xử lý thêm sinh viên
function addStudent() {
  const hoTen = hoTenInput.value.trim();
  const diem = parseFloat(diemInput.value);

  if (hoTen === '') {
    alert('Vui lòng nhập họ tên sinh viên!');
    return;
  }
  if (isNaN(diem) || diem < 0 || diem > 10) {
    alert('Điểm không hợp lệ! Vui lòng nhập số từ 0 đến 10.');
    return;
  }

  let xepLoai = '';
  if (diem >= 8.5) xepLoai = 'Giỏi';
  else if (diem >= 7.0) xepLoai = 'Khá';
  else if (diem >= 5.0) xepLoai = 'Trung bình';
  else xepLoai = 'Yếu';

  // Thêm ID duy nhất (Date.now()) để phân biệt sinh viên khi xóa
  students.push({ id: Date.now(), hoTen, diem, xepLoai });

  hoTenInput.value = '';
  diemInput.value = '';
  hoTenInput.focus();

  applyFilters(); // Áp dụng lại bộ lọc hiện tại và vẽ bảng
}

btnAdd.addEventListener('click', addStudent);

diemInput.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    addStudent();
  }
});

// 4. Hàm xử lý trung tâm: Tìm kiếm, Lọc, Sắp xếp
function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  // Bước 1: Lọc dữ liệu
  filteredStudents = students.filter(sv => {
    const matchName = sv.hoTen.toLowerCase().includes(searchText);
    const matchXepLoai = filterValue === 'Tất cả' || sv.xepLoai === filterValue;
    return matchName && matchXepLoai;
  });

  // Bước 2: Sắp xếp dữ liệu
  if (sortDirection === 'asc') {
    filteredStudents.sort((a, b) => a.diem - b.diem);
    sortIcon.innerText = '▲';
  } else if (sortDirection === 'desc') {
    filteredStudents.sort((a, b) => b.diem - a.diem);
    sortIcon.innerText = '▼';
  } else {
    sortIcon.innerText = ''; // Không sắp xếp
  }

  // Bước 3: Vẽ lại bảng dựa trên dữ liệu đã lọc
  renderTable();
}

// 5. Gắn sự kiện cho Bộ lọc, Tìm kiếm và Sắp xếp
searchInput.addEventListener('input', applyFilters); // Tìm realtime
filterSelect.addEventListener('change', applyFilters);

sortDiemBtn.addEventListener('click', () => {
  // Thay đổi trạng thái: rỗng -> asc -> desc -> rỗng...
  if (sortDirection === '') sortDirection = 'asc';
  else if (sortDirection === 'asc') sortDirection = 'desc';
  else sortDirection = '';
  
  applyFilters();
});

// 6. Hàm vẽ lại bảng dựa trên mảng filteredStudents
function renderTable() {
  dataTable.innerHTML = '';
  let tongDiem = 0;

  // Nếu không có kết quả phù hợp
  if (filteredStudents.length === 0 && students.length > 0) {
    dataTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Không có kết quả</td></tr>`;
  }

  filteredStudents.forEach((sv, index) => {
    tongDiem += sv.diem;
    const tr = document.createElement('tr');
    
    // Gắn id vào data-id thay vì dùng index
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${sv.hoTen}</td>
      <td>${sv.diem.toFixed(1)}</td>
      <td><strong>${sv.xepLoai}</strong></td>
      <td>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${sv.id}">Xóa</button>
      </td>
    `;
    dataTable.appendChild(tr);
  });

  // Thống kê dựa trên mảng đã lọc hoặc mảng gốc tùy ý (thường thống kê mảng hiển thị)
  txtTongSinhVien.innerText = `Tổng số sinh viên: ${filteredStudents.length}`;
  
  if (filteredStudents.length > 0) {
    const dtb = tongDiem / filteredStudents.length;
    txtDiemTrungBinh.innerText = `Điểm trung bình: ${dtb.toFixed(2)}`;
  } else {
    txtDiemTrungBinh.innerText = `Điểm trung bình: 0.0`;
  }
}

// 7. Xử lý sự kiện Xóa
dataTable.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-btn')) {
    const idToDelete = parseInt(event.target.getAttribute('data-id'));
    
    // Tìm sinh viên trong mảng gốc dựa trên ID
    const studentIndex = students.findIndex(sv => sv.id === idToDelete);
    
    if (studentIndex !== -1) {
      if(confirm(`Bạn có chắc muốn xóa sinh viên ${students[studentIndex].hoTen}?`)) {
          students.splice(studentIndex, 1); // Xóa khỏi mảng gốc
          applyFilters(); // Cập nhật lại giao diện
      }
    }
  }
});