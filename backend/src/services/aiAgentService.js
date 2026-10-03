import { ENV } from '../config/env.js';

export async function queryLocalAgent({ prompt, systemPrompt, context = {} }) {
  const baseUrl = ENV.LOCAL_AI_BASE_URL;
  const model = ENV.LOCAL_AI_MODEL;
  const timeoutMs = ENV.LOCAL_AI_TIMEOUT;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fullSystemPrompt = systemPrompt || 
    `You are the OpenPath Career AI Mentor. OpenPath uses a 5-factor transparent matching algorithm (Skills 40%, Academic 20%, Location 20%, Industry 10%, Experience 10%). Provide encouraging, direct, and actionable advice to bridge skill gaps.`;

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: `${fullSystemPrompt}\nContext: ${JSON.stringify(context)}` },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Local model server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      reply: data.message?.content || data.response || 'No response generated.',
      model
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      success: false,
      error: err.name === 'AbortError' 
        ? 'Local AI request timed out. Please check your local runner.' 
        : `Could not reach local AI service at ${baseUrl}. Ensure Ollama or your local runner is running.`
    };
  }
}