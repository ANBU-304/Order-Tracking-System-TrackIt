export async function POST(request) {
  const { messages } = await request.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ✅ Server-side only - never exposed to client
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return Response.json(data);
}