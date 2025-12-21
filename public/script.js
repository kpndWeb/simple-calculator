const display = document.getElementById('display');

// Theme system
const themeToggle = document.getElementById('themeToggle');

// Get user preference (localStorage > system > default light)
function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Apply theme
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update icon
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Initialize
const initialTheme = getPreferredTheme();
setTheme(initialTheme);

// Toggle on click
themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' 
    ? 'light' 
    : 'dark';
  setTheme(newTheme);
});

// Optional: Watch system changes (advanced)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

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

// function for calculation
async function calculate() {
    try {
        const originalExpr = display.value;
        const expr = originalExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

        const result = Function(`"use strict"; return (${expr})`)();
        const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

        display.value = formattedResult;

        // Log to backend (non-blocking)
        logCalculation(originalExpr, formattedResult).catch(console.warn);
    } catch (e) {
        display.value = 'Error';
        setTimeout(clearDisplay, 1500);
    }
}

// function for logging history
async function logCalculation(expression, result) {
    try {
        const response = await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression, result }),
        });

        if (!response.ok) {
            console.warn('⚠️ Failed to log calculation:', await response.text());
        }
    } catch (err) {
            console.warn('⚠️ Log request failed:', err.message);
    }
}

// HISTORY PANEL
const toggleBtn = document.getElementById('toggleHistory');
const closeBtn = document.getElementById('closeHistory');
const drawer = document.getElementById('historyDrawer');
const historyList = document.getElementById('historyList');

// Toggle drawer
toggleBtn.addEventListener('click', () => drawer.classList.add('open'));
closeBtn.addEventListener('click', () => drawer.classList.remove('open'));

// Fetch & display history
async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const { history } = await res.json();

    if (history.length === 0) {
      historyList.innerHTML = '<p class="history-empty">No calculations yet.</p>';
      return;
    }

    historyList.innerHTML = history.map(item => `
      <div class="history-item" data-expr="${item.expression}">
        <div class="expr">${item.expression.replace(/\*/g, '×').replace(/\//g, '÷')}</div>
        <div class="result">= ${item.result}</div>
        <div class="time">${item.created_at}</div>
      </div>
    `).join('');

    // Make items clickable
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const expr = item.getAttribute('data-expr');
        display.value = expr;
        drawer.classList.remove('open');
      });
    });
  } catch (err) {
    console.warn('Failed to load history:', err);
    historyList.innerHTML = '<p class="history-empty">⚠️ Could not load history.</p>';
  }
}

// Auto-load on startup & after each calculation
document.addEventListener('DOMContentLoaded', loadHistory);

// Enhance calculate() to refresh history
const originalCalculate = calculate;
calculate = function() {
  originalCalculate();
  setTimeout(loadHistory, 300);
};

// Clear History Button
document.getElementById('clearHistory').addEventListener('click', async () => {
  // ✅ Confirm first — prevent accidental loss
  if (!confirm('⚠️ Clear all calculation history? This cannot be undone.')) {
    return;
  }

  try {
    const res = await fetch('/api/history/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      // 🎉 Success: reload history (will show "No calculations")
      loadHistory();
      // Optional: show toast (for now, rely on UI update)
    } else {
      const { error } = await res.json();
      alert(`❌ Failed to clear: ${error}`);
    }
  } catch (err) {
    console.error('Clear request failed:', err);
    alert('❌ Network error. Is the server running?');
  }
});

    // kryboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendToDisplay(e.key);
    else if (e.key === '.') appendToDisplay('.');
    else if (['+', '-', '*', '/'].includes(e.key)) appendToDisplay(e.key);
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clearDisplay();
    else if (e.key === 'Backspace') backspace();
});