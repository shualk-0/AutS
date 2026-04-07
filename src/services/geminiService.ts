const DEEPSEEK_CONFIG = {
  apiKey: "1123b457-ced6-4f8c-8d73-4e66502464d1",
  base_url: "https://ark.cn-beijing.volces.com/api/v3",
  model: "ep-20260405155245-wnxh7"
};

export const chatWithAI = async (history: { role: "user" | "model"; parts: { text: string }[] }[]) => {
  const systemInstruction = "你是一个专业的天文学家和教育者，名字叫 AUTS AI。你正在一个沉浸式 3D 天文学习平台上协助用户。你的回答应该专业、有趣且富有启发性。请使用简体中文回答。你可以解释恒星、行星、星系以及天体物理学知识。";
  
  const messages = [
    { role: "system", content: systemInstruction },
    ...history.map(h => ({
      role: h.role === "model" ? "assistant" : "user",
      content: h.parts[0].text
    }))
  ];

  const response = await fetch(`${DEEPSEEK_CONFIG.base_url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: DEEPSEEK_CONFIG.model,
      messages: messages
    })
  });

  if (!response.ok) {
    return "抱歉，目前的宇宙连接较弱，请稍后再试。";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "抱歉，我无法生成回复。";
};
