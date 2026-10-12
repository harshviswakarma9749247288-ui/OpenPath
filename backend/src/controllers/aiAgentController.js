import { queryLocalAgent, streamLocalAgent } from '../services/aiAgentService.js';

export async function handleAiChat(req, res) {
  const { prompt, context, messages } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'A text prompt is required.' });
  }

  const result = await queryLocalAgent({ prompt, context, messages });

  return res.status(200).json(result);
}

export async function handleAiStream(req, res) {
  const { prompt, context, messages } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'A text prompt is required.' });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // Initial handshake
  res.write(': connected\n\n');

  try {
    await streamLocalAgent({
      prompt,
      context,
      messages,
      onChunk: (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
    });

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
}