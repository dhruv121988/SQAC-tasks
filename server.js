import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = 3000;

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/movies', express.static(path.join(__dirname, 'Movie Search App', 'public')));
app.use('/currency', express.static(path.join(__dirname, 'Currency Converter')));
app.use('/admin', express.static(path.join(__dirname, 'Admin Dashboard')));

// Movie API
app.get('/api/movies', async (req, res) => {
  const query = req.query.s;
  if (!query) return res.status(400).json({ error: 'No search query provided' });

  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`);
    const data = await response.json();
    console.log("OMDB API response:", data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Currency API
app.get('/api/convert', async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) return res.status(400).json({ error: 'Missing query parameters' });

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${from}`);
    const data = await response.json();
    const rate = data.conversion_rates[to];
    res.json({ from, to, amount, rate, convertedAmount: (amount * rate).toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversion rate' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
