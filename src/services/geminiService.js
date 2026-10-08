// src/services/geminiService.js

const mockResponses = {
  cnic: "To apply for a new CNIC or renewal, visit the official NADRA online portal (Pak-ID) or your nearest NADRA Registration Center. Requirements include your original identity card, family details, and biometric verification.",
  passport: "For passport renewal, apply through the Directorate General of Immigration & Passports online portal. Select normal or urgent processing, pay the fee online, and schedule your appointment.",
  tax: "To file income tax returns, register on the FBR Iris portal using your CNIC. Complete your wealth statement and submit Form 114 to verify active taxpayer status (ATL)."
};

export const askGeminiAssistant = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "API Key missing. Please configure VITE_GEMINI_API_KEY in your .env file.";
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API Error (${response.status}). Using resilient fallback answer.`);
      
      // Fallback matching logic for 503 or 429 errors
      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes("cnic") || lowerPrompt.includes("identity")) return mockResponses.cnic;
      if (lowerPrompt.includes("passport")) return mockResponses.passport;
      if (lowerPrompt.includes("tax") || lowerPrompt.includes("fbr")) return mockResponses.tax;

      return "Service is temporarily experiencing high server demand. Please check official government portals or try searching again shortly.";
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Network or Fetch Error:", error);
    return "Unable to connect to service. Please check your internet connection.";
  }
};