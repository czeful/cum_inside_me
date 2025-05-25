// src/services/ai.js

const OPENROUTER_API_KEY = "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"; // сюда подставь свой OpenRouter ключ

export async function generateSteps({ name, description, category }) {
  const prompt = `
Ты ассистент по целеполаганию. Помоги структурировать цель:
Название: ${name}
Категория: ${category}
Описание: ${description}

Дай список конкретных шагов (steps) для достижения этой цели, без вступления и пояснений, только список шагов по одному на строку.
  `;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      // OpenRouter требует этот заголовок
      "HTTP-Referer": "http://localhost:5173/", // или твой домен
      "X-Title": "AchievementManager"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo", // Можно указать другую модель (см. ниже)
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  return text.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
}
