import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { envVars } from '../../config/env.config';

type TChatRole = 'user' | 'assistant';

type TChatMessage = {
  role: TChatRole;
  content: string;
};

type TChatRequestPayload = {
  message: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
};

type TOpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const SYSTEM_PROMPT =
  'You are Planora Assistant. Help users discover events, suggest activities based on interests, budget, location, and time, and answer general event-planning questions. Keep responses concise, friendly, and practical.';

const buildQuotaFallbackReply = (userMessage: string) => {
  const prompt = userMessage.trim();

  return [
    'I am temporarily running in backup mode because the AI provider quota is exhausted.',
    '',
    `For your request: "${prompt || 'event suggestions'}"`,
    '',
    'Quick event ideas you can try now:',
    '1) Weekend Community Meetup: low-cost venue, open networking, simple refreshments.',
    '2) Skills Workshop: 60-90 minute focused session with practical takeaways.',
    '3) Micro Cultural Night: music, food corner, and audience participation activity.',
    '',
    'Planning checklist:',
    '- Set audience type and budget first.',
    '- Pick date/time and create a short event description.',
    '- Share on social + invite targeted groups.',
    '- Track registrations and send reminder 24h before event.',
  ].join('\n');
};

const normalizeOpenRouterContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map(item => {
      if (
        item &&
        typeof item === 'object' &&
        'type' in item &&
        'text' in item &&
        (item as { type?: unknown }).type === 'text'
      ) {
        return String((item as { text?: unknown }).text || '');
      }

      return '';
    })
    .join('');
};

const requestOpenRouter = async (
  apiKey: string,
  modelName: string,
  messages: TChatMessage[],
) => {
  const response = await fetch(envVars.OPENROUTER.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': envVars.FRONTEND_URL,
      'X-Title': 'Planora Chatbot',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages.map(message => ({
          role: message.role,
          content: message.content,
        })),
      ],
      temperature: 0.4,
      max_tokens: 220,
    }),
  });

  const rawBody = await response.text();

  if (!response.ok) {
    return {
      ok: false as const,
      statusCode: response.status,
      modelName,
      rawBody,
    };
  }

  const completion = JSON.parse(rawBody) as TOpenRouterResponse;
  const reply = normalizeOpenRouterContent(
    completion.choices?.[0]?.message?.content,
  ).trim();

  if (!reply) {
    return {
      ok: false as const,
      statusCode: status.BAD_GATEWAY,
      modelName,
      rawBody: 'OpenRouter returned empty response.',
    };
  }

  return {
    ok: true as const,
    modelName,
    reply,
  };
};

const getChatReply = async (payload: TChatRequestPayload) => {
  const openRouterApiKey = envVars.OPENROUTER.API_KEY;

  if (!openRouterApiKey) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Chatbot service is not configured. Missing OPENROUTER_API_KEY.',
    );
  }

  const history = (payload.history || []).slice(-8).map(item => ({
    role: item.role,
    content: item.content.trim(),
  }));

  const messages: TChatMessage[] = [
    ...history,
    { role: 'user', content: payload.message.trim() },
  ];

  let lastError:
    | {
        statusCode: number;
        rawBody: string;
        modelName: string;
      }
    | undefined;
  const openRouterModels = [
    envVars.OPENROUTER.MODEL,
    envVars.OPENROUTER.FALLBACK_MODEL,
  ].filter(Boolean);

  for (const modelName of openRouterModels) {
    const result = await requestOpenRouter(
      openRouterApiKey,
      modelName,
      messages,
    );

    if (result.ok) {
      return {
        reply: result.reply,
      };
    }

    lastError = {
      statusCode: result.statusCode,
      rawBody: result.rawBody,
      modelName: result.modelName,
    };
  }

  const rawError = (lastError?.rawBody || '').toUpperCase();
  const isQuotaError =
    lastError?.statusCode === status.TOO_MANY_REQUESTS ||
    rawError.includes('RESOURCE_EXHAUSTED') ||
    rawError.includes('QUOTA');

  if (isQuotaError) {
    return {
      reply: buildQuotaFallbackReply(payload.message),
    };
  }

  throw new AppError(
    status.BAD_GATEWAY,
    `OpenRouter request failed for model ${lastError?.modelName || envVars.OPENROUTER.MODEL} with status ${lastError?.statusCode || 'unknown'}: ${lastError?.rawBody || 'Unknown error'}`,
  );
};

export const ChatbotService = {
  getChatReply,
};
