const express = require('express');
const path = require('path');
const logger = require('./logger');

const app = express();
const PORT = 3003;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function handleOperation(req, res, operation) {
  const num1 = parseFloat(req.query.num1);
  const num2 = req.query.num2 !== undefined ? parseFloat(req.query.num2) : undefined;

  if (isNaN(num1) || (req.query.num2 !== undefined && isNaN(num2))) {
    logger.error(`Invalid input: num1=${req.query.num1}, num2=${req.query.num2}`);
    return res.status(400).json({ error: 'Invalid numbers provided.' });
  }

  let result;
  switch (operation) {
    case 'add':
      result = num1 + num2;
      break;
    case 'subtract':
      result = num1 - num2;
      break;
    case 'multiply':
      result = num1 * num2;
      break;
    case 'divide':
      if (num2 === 0) return res.status(400).json({ error: 'Division by zero is not allowed.' });
      result = num1 / num2;
      break;
    case 'modulo':
      result = num1 % num2;
      break;
    case 'exponent':
      result = Math.pow(num1, num2);
      break;
    case 'sqrt':
      if (num1 < 0) return res.status(400).json({ error: 'Square root of negative number is not allowed.' });
      result = Math.sqrt(num1);
      break;
    default:
      return res.status(400).json({ error: 'Unsupported operation.' });
  }

  logger.info({
    operation,
    num1,
    num2,
    result,
    message: `Performed ${operation} on ${num1}` + (num2 !== undefined ? ` and ${num2}` : '')
  });

  res.json({ result });
}

app.get('/add', (req, res) => handleOperation(req, res, 'add'));
app.get('/subtract', (req, res) => handleOperation(req, res, 'subtract'));
app.get('/multiply', (req, res) => handleOperation(req, res, 'multiply'));
app.get('/divide', (req, res) => handleOperation(req, res, 'divide'));
app.get('/modulo', (req, res) => handleOperation(req, res, 'modulo'));
app.get('/exponent', (req, res) => handleOperation(req, res, 'exponent'));
app.get('/sqrt', (req, res) => handleOperation(req, res, 'sqrt'));

app.listen(PORT, () => {
  logger.info(`Calculator microservice running on http://localhost:${PORT}`);
});
