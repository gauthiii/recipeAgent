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


export async function getFinanceAdvice(income, spending) {
  const axios = (await import('axios')).default;

  const prompt = `
You are a responsible financial planning assistant. Based on the provided details:

- Annual Income: ${income} AUD
- Monthly Spending: ${spending} AUD

Please suggest:
1. A practical **daily spending limit** to manage regular expenses comfortably.
2. A reasonable **monthly investment amount** to promote financial growth, assuming no major debts.

Provide the result in **clean JSON** format like:
{
  "dailySpendingLimit": "<amount in AUD>",
  "recommendedMonthlyInvestment": "<amount in AUD>"
  "reason": "<2 line summary>"
}

Do not include any explanations or markdown. This is purely for **educational and illustrative purposes** and should not be considered financial advice.
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
