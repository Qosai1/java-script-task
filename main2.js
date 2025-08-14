


<table id="myTable"></table>//in html




let table = document.getElementById('myTable');

// إنشاء الهيدر مرة وحدة
function ensureHeader() {
  if (!table.tHead) {
    const thead = table.createTHead();
    const headerRow = document.createElement('tr');
    const columns = ['Type', 'Amount', 'Category', 'Date', 'Notes'];
    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
  }
  if (!table.tBodies[0]) {
    table.appendChild(document.createElement('tbody'));
  }
}

// رسم الجدول من مصفوفة بيانات
function renderTable(data) {
  ensureHeader();
  const tbody = table.tBodies[0];

  // مسح الصفوف القديمة باستخدام children
  Array.from(tbody.children).forEach(tr => tr.remove());

  // إضافة الصفوف الجديدة
  data.forEach(tx => {
    const row = document.createElement('tr');
    [tx.type, tx.amount, tx.category, tx.date, tx.notes].forEach(val => {
      const td = document.createElement('td');
      td.textContent = val ?? '';
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
}

// إنشاء الجدول لأول مرة بكل الترانزاكشنز
function createTable() {
  renderTable(transactions);

  // تحديث قائمة الفئات
  const select = document.getElementById('category');
  const cats = new Set(transactions.map(tx => tx.category).filter(Boolean));
  cats.forEach(cat => {
    if (!Array.from(select.options).some(op => op.value === cat)) {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    }
  });
}

// البحث
document.getElementById('search').addEventListener('click', function () {
  let category = document.getElementById('category').value;
  let note     = document.getElementById('keyword').value;
  let fromDate = new Date(document.getElementById('fromDate').value).getTime();
  let toDate   = new Date(document.getElementById('toDate').value).getTime();

  let result = transactions.filter(tx => {
    let tDate = new Date(tx.date).getTime();
    if (category !== 'all' && tx.category !== category) return false;
    if (note && !String(tx.notes).includes(note)) return false;
    if (fromDate && tDate < fromDate) return false;
    if (toDate && tDate > toDate) return false;
    if (!tx.date) return false;
    return true;
  });

  // عرض النتائج
  renderTable(result);
});

// أول تشغيل
createTable();
