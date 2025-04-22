// backend/gemini.js
import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🔥 Generate Recipe for a Food Item
export async function generateRecipe(foodItem) {
  const axios = (await import('axios')).default;

  const prompt = `
    Give me a detailed recipe for "${foodItem}".
    Include ingredients list and step-by-step instructions.
    Respond strictly in clean JSON format like:
    {
      "dish": "<Dish Name>",
      "ingredients": ["Ingredient 1", "Ingredient 2", ...],
      "instructions": ["Step 1", "Step 2", ...]
    }
    No explanation. No markdown. Only raw JSON.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  } catch (err) {
    console.error('Gemini API Error:', err?.response?.data || err.message);
    throw err;
  }
}
