import { queryLocalAgent } from '../services/aiAgentService.js';

export async function handleAiChat(req, res) {
  const { prompt, context } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'A text prompt is required.' });
  }

  const result = await queryLocalAgent({ prompt, context });

  if (!result.success) {
    return res.status(503).json(result);
  }

  return res.status(200).json(result);
}