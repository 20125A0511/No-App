// This file would typically contain actual Gemini API integration
// For now, we're just simulating responses

const API_KEY = "AIzaSyDWfm-T8zyH9kifAEJVCEGBhgd6_fEb6Ng";

// Backup responses in case API fails
const FALLBACK_RESPONSES = [
  "F*CK NO! Not even if you paid me in diamonds and dirty pictures!",
  "HELL TO THE NO! I'd rather lick a public toilet seat!",
  "ARE YOU OUT OF YOUR DAMN MIND? That's a hard NO with extra NO sauce!",
  "I'D RATHER WALK NAKED THROUGH A CACTUS FIELD THAN SAY YES TO THAT BULLSH*T!"
];

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    console.log("Calling Gemini API for:", prompt);
    
    // Using the correct working endpoint
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
    
    // Call the actual Gemini API
    const response = await fetch(`${apiUrl}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Respond to this question: "${prompt}" with a funny, naughty, adult-oriented way of saying NO. Be creative, use strong language if needed, and make it humorous but always say NO to the request/question. Keep it under 100 characters if possible.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 100,
        },
      }),
    });

    const data = await response.json();
    console.log("API response:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Check if we got a valid response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && 
        data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error('API returned error:', data.error);
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    } else {
      console.error('Unexpected API response structure:', data);
      // If API returns unexpected structure, use a fallback
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    // In case of error, use a fallback response
    return "F*CK NO! And something's broken on my end too!";
  }
}; 