import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ reply: "Method not allowed" });

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {  
          "Authorization": `Bearer ${process.env.HUGGING_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: message,
          parameters: { max_new_tokens: 200, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();
    const reply = data?.[0]?.generated_text?.trim() || "RAI bingung 😅";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 Error:", err);
    res.status(500).json({ reply: "⚠️ RAI gagal jawab 😭" });
  }
}
