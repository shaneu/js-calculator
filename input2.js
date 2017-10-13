const display = document.querySelector('.display');
const mainContainer = document.querySelector('main');
const clearKey = document.getElementById('clear');
const numberRegEx = /\d+/;

let numA;
let numB;
let total;
let operator;
let lastOperator;
let repeatEqualsOperator;
let repeatEqualsOperand;

const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
const divide = (x, y) => {
  if (y === 0) {
    return 'Error: no division by zero';
  }
  return x / y;
};

const percent = x => x / 100;
const equals = (fn, ...args) => args.reduce((acc, cur) => fn(acc, cur));
const sign = x => (x ? -x : x);

const updateDisplay = value => (display.textContent = value);

const clearKeyToggle = () => (numA ? (clearKey.firstChild.nodeValue = 'C') : (clearKey.firstChild.nodeValue = 'AC'));

const clear = () => {
  if (numB) {
    numB = undefined;
  } else {
    numA = undefined;
  }

  updateDisplay('0');
  clearKeyToggle();
};

const allClear = () => {
  repeatEqualsOperator = undefined;
  repeatEqualsOperand = undefined;
  lastOperator = undefined;
};

const operationSelector = input => {
  let operation;
  switch (input) {
    case '+':
      operation = add;
      break;
    case '-':
      operation = subtract;
      break;
    case 'x':
      operation = multiply;
      break;
    case '÷':
      operation = divide;
      break;
    case '%':
      operation = percent;
      break;
    case '+/-':
      operation = sign;
      break;
    case 'C':
      operation = clear;
      break;
    case 'AC':
      operation = allClear;
      break;
    default:
      operation = equals;
      break;
  }
  return operation;
};

const numberStringConcater = (originalNumberStr, numberStrToAdd) => {
  let completedNumberStr;
  if (!originalNumberStr) {
    completedNumberStr = numberStrToAdd;
  } else {
    completedNumberStr = originalNumberStr + numberStrToAdd;
  }
  return completedNumberStr;
};

const numberHandler = number => {
  if (!numA && number === '0') {
    return;
  }

  if (operator) {
    if (number === '.') {
      if (!numB) {
        numB = '0.';
        updateDisplay(numB);
        clearKeyToggle();
        return;
      } else if (numB.includes('.')) {
        return;
      }
    }
    numB = numberStringConcater(numB, number);
    updateDisplay(numB);
  } else {
    if (number === '.') {
      if (!numA) {
        numA = '0.';
        updateDisplay(numA);
        clearKeyToggle();
        return;
      } else if (numA.includes('.')) {
        return;
      }
    }
    numA = numberStringConcater(numA, number);
    updateDisplay(numA);
  }
  clearKeyToggle();
};

const operationHandler = () => {
  if (operator === clear || operator === allClear) {
    operator();
    operator = undefined;
    return;
  }

  if (operator === sign || operator === percent) {
    if (numB) {
      numB = operator(+numB);
      updateDisplay(numB);
    } else {
      numA = operator(+numA);
      updateDisplay(numA);
    }
    return;
  }

  // For repeted equal presses
  if (operator === equals && operator === lastOperator) {
    total = equals(repeatEqualsOperator, +total, +repeatEqualsOperand);
    numA = total;
    updateDisplay(total);
    return;
  }
 
  if (operator === equals || lastOperator) {
    if (numB || operator === equals) {
      total = equals(lastOperator, +numA, +numB || +numA);
      updateDisplay(total);
      repeatEqualsOperand = numB || numA;
      numA = total;
      repeatEqualsOperator = lastOperator;
      numB = undefined;
    } else {
      updateDisplay(numA);
      lastOperator = operator;
      return;
    }
  }

  lastOperator = operator;
};

const captureInput = event => {
  const input = event.target.firstChild.nodeValue;
  if (numberRegEx.test(input) || input === '.') {
    numberHandler(input);
  } else if (numA) {
    operator = operationSelector(input);
    operationHandler(operator);
  }
};

mainContainer.addEventListener('click', captureInput);
