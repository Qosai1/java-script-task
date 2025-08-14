let income=document.getElementById('income');
let expenses=document.getElementById('expenses');
let balance=document.getElementById('balance');
let table = document.createElement('table');

//get all transaction from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
let filter = JSON.parse(localStorage.getItem('filter') || '[]');


// create three users
const usersObject ={
    user1:{username: 'qosai', password: 'pass1' },
    user2:{username:'ali',password:'pass2'},
    user3:{users:'hamzah',password:'pass3'}
};
// get element from localStorege
income.textContent=localStorage.getItem('income')|| 0;
expenses.textContent=localStorage.getItem('expenses')|| 0;
balance.textContent=localStorage.getItem('balance')|| 0;


// User Authentication
function login(){
    let name=document.getElementById('username').value;
    let pass=document.getElementById('password').value;

    //if name is empty
    if(!name){
        document.getElementById('message').innerHTML='username is required';
    return;
    }
// if password is empty
    if(!pass){
        document.getElementById('message').innerHTML='password is required';
    return;
    }


    for(let key in usersObject){
        if(usersObject[key].username==name&&usersObject[key].password==pass){
            localStorage.setItem('lastuser',name);
           location.href='Dashboard.html';
        }else{
        document.getElementById('message').innerHTML='Invalid username or password';
        }
    } 
}
 function logout(){
    localStorage.clear();
    location.href='login.html';
}

    

// Display summary of income, expenses, and net balance dynamically.
function calc() {
    
    let selectedType = document.getElementById('type1').value;
    let amount = Number(document.getElementById('amount').value);
     let category = document.getElementById('categoryInput').value;
    let date= document.getElementById('date').value;
    let notes= document.getElementById('notes').value;

    if(!amount){
        document.getElementById('massamount').innerHTML='Amount is required'
        return;
    }
    if(!category){
        document.getElementById('massamount').innerHTML='category is required'
        return;
    }
     if(!date){
        document.getElementById('massamount').innerHTML='Date is required'
        return;
    }

    // if expenses large than income display alert
    if (  selectedType == 'expenses' && (amount + Number(localStorage.getItem('expenses') )) > Number(localStorage.getItem('income'))) {
        alert('You cannot add more because expenses are greater than income!');
        return;
    }

     if (selectedType == 'income') {
        let current = Number(localStorage.getItem('income')) || 0;
        let newIncome = current + amount;
        document.getElementById('income').textContent = newIncome;
        localStorage.setItem('income', newIncome);
    }
     
    if (selectedType == 'expenses') {
    let current = Number(document.getElementById('expenses').textContent) || 0;
    let newExpenses = current + amount;
    document.getElementById('expenses').textContent = newExpenses;
    localStorage.setItem('expenses', newExpenses);
}

    let totalIncome = Number(document.getElementById('income').textContent) || 0;
    let totalExpenses = Number(document.getElementById('expenses').textContent) || 0;
//calc net balance
    let netBalance = totalIncome - totalExpenses;
    document.getElementById('balance').textContent = netBalance;
    localStorage.setItem('balance', netBalance);

    //add transactions to localStorage
    transactions.push({
        type: selectedType,
        amount: amount,
        category: category,
        date: date,
        notes: notes
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
}

    // Transaction Table
function createTable() {
    let body = document.body;
    let header = document.createElement('tr');
    //create header table 
        let columns = ['Type', 'Amount', 'Category', 'Date', 'Notes'];
    for (let i = 0; i < columns.length; i++) {
        let th = document.createElement('th');
        th.textContent = columns[i];
        header.appendChild(th);
    }
    //insert the header to table
    table.appendChild(header);
    //add transaction to table 
    for (let i = 0; i < transactions.length; i++) {
    let row = document.createElement('tr');
    let transaction = transactions[i];
    let values = [transaction.type, transaction.amount, transaction.category, transaction.date, transaction.notes];

    for (let j = 0; j < values.length; j++) {
        let td = document.createElement('td');
        td.textContent = values[j];
        row.appendChild(td);
    }

    // select category
    let select = document.getElementById('category');
    let exists = Array.from(select.options).some(op => op.value === values[2]);///////////
    if (!exists) {
        let opt = document.createElement('option');
        if(values[2]){   // if the notes not empty add it 
        opt.value = values[2];
        opt.textContent = values[2];
        select.appendChild(opt);
    }
    }
    table.appendChild(row);
}

body.appendChild(table);

}
 createTable()
//search functionality
document.getElementById('search').addEventListener('click', function () {
  let category = document.getElementById('category').value; 
  let note = document.getElementById('keyword').value; 
  let fromDate = new Date(document.getElementById('fromDate').value).getTime() 
  let toDate = new Date(document.getElementById('toDate').value).getTime()

  
  const matches = [];
 for (let i = 0; i < transactions.length; i++) { 
    let transaction = transactions[i];
     let tDate = new Date(transaction.date).getTime();
      if (category !== 'all' && transaction.category !== category) 
        continue;
     if (note && !String(transaction.notes).includes(note)) 
        continue;
     
     if (fromDate && tDate < fromDate ) 
        continue; 
     if (toDate && tDate > toDate ) 
        continue;
      if(!tDate)
         continue;
    
    matches.push(transaction);
    localStorage.setItem('filter', JSON.stringify(matches));
  }
 
    Array.from(table.children).slice(1).forEach(tr => tr.remove());
  
  for (let i = 0; i < filter.length; i++) {
    const tr = document.createElement('tr');
    const values = [
      filter[i].type,
      filter[i].amount,
      filter[i].category,
      filter[i].date,
      filter[i].notes
    ];
    for (let j = 0; j < values.length; j++) {
      const td = document.createElement('td');
      td.textContent = values[j] ;
      tr.appendChild(td);
    }
   table.appendChild(tr);
  }
});

    //create random color
function getRandomColor() {
    return '#'+ Math.floor(Math.random()*16777215).toString(16);
}
//chart pie
function ExpensesChart(){
const barColors = [];
const category = [];
const amount = [];

for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];

    if (transaction.type === 'expenses') {
//if category exists add amount only
        let index = category.indexOf(transaction.category);////////////////////////////////
        if (index === -1) {
            category.push(transaction.category);
            amount.push(transaction.amount);
            //random color
            barColors.push(getRandomColor())
        } else {
            amount[index] += transaction.amount;
        }
    }
}

new Chart('myChart', {
  type: 'pie',
  data: {
    labels: category,
    datasets: [{
      backgroundColor: barColors,
      data: amount
    }]
  },
 
    options: {
    title: {
      display: true,
      text: 'Spending Trends'
    }
  }
});

}
  ExpensesChart()

//dark mode
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark')
     body.classList.add('dark');

  document.getElementById('btnDark').onclick = () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  };
   