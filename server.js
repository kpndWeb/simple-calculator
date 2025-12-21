require('dotenv').config();
const db = require('./db');
const express = require('express');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  require('./db/migrate').migrate();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// doing calculations
app.get('/api/calculate', (req, res) => {
  const { a, b, op } = req.query;
  let result;

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({ error: 'Invalid numbers' });
  }

  switch (op) {
    case '+': result = numA + numB; break;
    case '-': result = numA - numB; break;
    case '*': result = numA * numB; break;
    case '/': 
      if (numB === 0) return res.status(400).json({ error: 'Division by zero' });
      result = numA / numB; 
      break;
    default: return res.status(400).json({ error: 'Invalid operator' });
  }

  res.json({ result });
});

// store calculations
app.post('/api/log', express.json(), async (req, res) => {
  const { expression, result } = req.body;

  if (!expression || result === undefined) {
    return res.status(400).json({ error: 'Missing expression or result' });
  }

  try {
    const query = `
      INSERT INTO calculations (expression, result)
      VALUES ($1, $2)
      RETURNING id, created_at;
    `;
    const values = [expression, parseFloat(result)];
    
    const { rows } = await db.query(query, values);
    res.status(201).json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error('DB log error:', err);
    res.status(500).json({ error: 'Failed to log calculation' });
  }
});

// fetch recent calculations
app.get('/api/history', async (req, res) => {
  try {
    const query = `
      SELECT id, expression, result, created_at
      FROM calculations
      ORDER BY created_at DESC
      LIMIT 20;
    `;
    const { rows } = await db.query(query);
    
    // Format timestamp for frontend ("2025-12-19 14:30")
    const history = rows.map(row => ({
      ...row,
      created_at: new Date(row.created_at).toLocaleString('en-GB', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '')
    }));

    res.json({ history });
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// delete all calculation history
app.post('/api/history/clear', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM calculations');
    console.log(`🗑️ Cleared ${result.rowCount} calculation(s)`);
    res.json({ success: true, deleted: result.rowCount });
  } catch (err) {
    console.error('Clear history error:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// When fails server
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});