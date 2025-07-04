// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRecipe, getFinanceAdvice } from './gemini.js'; // ✅ NEW import here

dotenv.config();

const app = express();
const port = 3002;

// For ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from frontend/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the frontend/index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

function cleanJSON(text) {
  return text.replace(/```json|```/g, '').trim();
}

// ========================= GEMINI-BASED APIs =========================

// 🔥 Generate Recipe
app.post('/recipe', async (req, res) => {
  try {
    const { foodItem } = req.body;
    if (!foodItem) {
      return res.status(400).json({ error: 'foodItem is required' });
    }
    const result = await generateRecipe(foodItem);
    const cleanedResult = cleanJSON(result);
    res.json({ foodItem, recipe: JSON.parse(cleanedResult) });
  } catch (err) {
    console.error('Recipe Generation Error:', err.message);
    res.status(500).json({ error: 'Failed to generate recipe.' });
  }
});


// 🔥 Financial Budget Advice Endpoint
app.post('/budget-advice', async (req, res) => {
  try {
    const { annualIncome, monthlySpending } = req.body;
    if (!annualIncome || !monthlySpending) {
      return res.status(400).json({ error: 'annualIncome and monthlySpending are required.' });
    }

    console.log(annualIncome);
    console.log(monthlySpending);

    const rawResponse = await getFinanceAdvice(annualIncome, monthlySpending);
    const cleaned = cleanJSON(rawResponse);
    const parsed = JSON.parse(cleaned);

    console.log(rawResponse);

    res.json({
      income: annualIncome,
      spending: monthlySpending,
      advice: parsed
    });
  } catch (err) {
    console.error('Budget Advice Error:', err.message);
    res.status(500).json({ error: 'Failed to generate financial advice.' });
  }
});

// ========================= Server Listen =========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
