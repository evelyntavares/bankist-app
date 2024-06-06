'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 250, -700],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2024-06-03T12:01:20.894Z',
    '2024-06-05T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const calculateDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const formatTransactionDate = function (transactionDate, locale = 'en-CA') {
  const now = new Date();
  const daysPassed = calculateDaysPassed(now, transactionDate);

  if (daysPassed === 0) {
    return 'Today';
  }
  if (daysPassed === 1) {
    return 'Yesterday';
  }
  if (daysPassed <= 3) {
    return `${daysPassed} days ago`;
  }

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Date(transactionDate).toLocaleString(locale, options);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayTransactions = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movements.forEach(function (transaction, index) {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';

    const transactionDate = account.movementsDates[index];
    const transactionDateFormatted = formatTransactionDate(
      new Date(transactionDate),
      account.locale
    );

    const transactionFormatted = formatCurrency(
      transaction,
      account.locale,
      account.currency
    );

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">${
      index + 1
    } ${transactionType}</div>
    <div class="movements__date">${transactionDateFormatted}</div>
        <div class="movements__value">${transactionFormatted}</div>
      </div>
      
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calculateDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, transaction) => accumulator + transaction,
    0
  );

  const balanceFormatted = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );

  labelBalance.textContent = `${balanceFormatted}`;
};

const updateSummaryTrasactions = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);

  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, movement) => accumulator + movement, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    account.locale,
    account.currency
  );

  const interestRate = account.interestRate / 100;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => deposit * interestRate)
    .filter(interest => interest >= 1)
    .reduce((accumulator, interest) => accumulator + interest, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .split(' ')
      .map(name => name[0])
      .join('')
      .toLowerCase();
  });
};

createUsernames(accounts);

const updateTransactionsUI = function (account) {
  displayTransactions(currentAccount);
  calculateDisplayBalance(currentAccount);
  updateSummaryTrasactions(currentAccount);
};

// Event handler
let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    const now = new Date();
    labelDate.textContent = now.toLocaleString(currentAccount.locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    updateTransactionsUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAccount &&
    amount <= currentAccount.balance &&
    receiverAccount.username !== currentAccount.username
  ) {
    const transactionDate = new Date().toISOString();

    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(transactionDate);

    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(transactionDate);
    updateTransactionsUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.ceil(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(movement => movement >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    const transactionDate = new Date().toISOString();
    currentAccount.movementsDates.push(transactionDate);

    updateTransactionsUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = `Log in to get started`;
});

let isSorted = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  isSorted = !isSorted;
  displayTransactions(currentAccount.movements, isSorted);
});
