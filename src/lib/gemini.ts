// This file would typically contain actual Gemini API integration
// For now, we're just simulating responses

// Use environment variable for API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Backup responses in case API fails
const FALLBACK_RESPONSES = [
  "FUCK NO! Not even if you paid me in diamonds and dirty pictures!",
  "HELL TO THE NO! I'd rather lick a public toilet seat!",
  "ARE YOU OUT OF YOUR DAMN MIND? That's a hard NO with extra NO sauce!",
  "I'D RATHER WALK NAKED THROUGH A CACTUS FIELD THAN SAY YES TO THAT BULLSHIT!"
];

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    console.log("Calling Gemini API for:", prompt);
    console.log("API Key available:", !!API_KEY);
    
    // Check if API key is available
    if (!API_KEY) {
      console.error('No Gemini API key found in environment variables');
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
    
    // Using the correct working endpoint
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Respond to this question: "${prompt}" with a funny, naughty, adult-oriented way of saying NO. Be creative, use strong language like "fuck," "shit," "ass" if needed. Make it humorous and offensive but always say NO to the request/question. Don't censor any words. Keep it under 100 characters if possible.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 100,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    console.log("Request body:", JSON.stringify(requestBody));
    
    // Call the actual Gemini API
    const response = await fetch(`${apiUrl}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response not OK:', response.status, errorText);
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }

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
      return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    }
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  }
}; 