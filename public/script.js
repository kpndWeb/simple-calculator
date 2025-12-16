const display = document.getElementById('display');
let clickEqual = false;

function ATD(value) {
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/'];

    if (operators.includes(value) && operators.includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value; // prevent double operators
    } else if (display.value === '0' && value !== '.') {
        display.value = value; // prevent leading zero
    } else {
        display.value += value;
    }
}

function appendToDisplay(value) {
    if (clickEqual) {
        clearDisplay();
        ATD(value);
        clickEqual = false;
    } else {
        ATD(value);
    }
}

function clearDisplay() {
    display.value = '0';
}

function backspace() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function calculate() {
    try {
        const expr = display.value
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

        const result = Function(`"use strict"; return (${expr})`)();

        display.value = Number.isInteger(result) ? result: parseFloat(result.toFixed(10));
    } catch (e) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
    clickEqual = true;
}

    // kryboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendToDisplay(e.key);
    else if (e.key === '.') appendToDisplay('.');
    else if (['+', '-', '*', '/'].includes(e.key)) appendToDisplay(e.key);
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clearDisplay();
    else if (e.key === 'Backspace') backspace();
});