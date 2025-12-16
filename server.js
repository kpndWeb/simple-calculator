const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});