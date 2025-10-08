import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config(); // Load .env file

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static("public")); // Serve HTML, CSS, JS from public folder

// API route to fetch movies (hides your API key)
app.get("/api/movies", async (req, res) => {
  const query = req.query.s;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${process.env.OMDB_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
