const express = require('express');
const fetch = require('node-fetch'); // or native fetch in Node 18+
require('dotenv').config();

const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static('../Movie search app')); // adjust path if needed

// API endpoint for movies
app.get('/api/movies', async (req, res) => {
  const query = req.query.s;
  const apiKey = process.env.OMDB_API_KEY;

  if (!query) return res.status(400).json({ Error: "No search query provided" });

  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
