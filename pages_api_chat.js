import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';

const client = new Anthropic();

export default async function handler(req, res) {
  // Accepter seulement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  // Validation
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Préparer les messages pour Claude (format Anthropic)
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Appeler Claude
    const response = await client.messages.create({
      model: 'claude-opus-4-20250805',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: claudeMessages
    });

    // Extraire la réponse
    const assistantMessage = response.content[0]?.text || '';

    return res.status(200).json({
      success: true,
      message: assistantMessage,
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens
      }
    });
  } catch (error) {
    console.error('Claude API error:', error);

    // Gestion des erreurs spécifiques
    if (error.status === 401) {
      return res.status(500).json({ error: 'API key invalid' });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limited. Try again in a moment.' });
    }

    return res.status(500).json({ 
      error: 'Failed to get response from Claude',
      details: error.message 
    });
  }
}
