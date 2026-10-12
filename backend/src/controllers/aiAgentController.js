import { queryLocalAgent } from '../services/aiAgentService.js';

export async function handleAiChat(req, res) {
  const { prompt, context, messages } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'A text prompt is required.' });
  }

  const result = await queryLocalAgent({ prompt, context, messages });

  return res.status(200).json(result);
}