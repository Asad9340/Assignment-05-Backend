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

type TGeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const SYSTEM_PROMPT =
  'You are Planora Assistant. Help users discover events, suggest activities based on interests, budget, location, and time, and answer general event-planning questions. Keep responses concise, friendly, and practical.';

const normalizeModelName = (model: string) =>
  model.trim().replace(/^models\//i, '');

const modelFallbacks = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
];

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

const requestGemini = async (
  apiKey: string,
  modelName: string,
  messages: TChatMessage[],
) => {
  const response = await fetch(
    `${envVars.GEMINI.API_URL}/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: messages.map(message => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    },
  );

  const rawBody = await response.text();

  if (!response.ok) {
    return {
      ok: false as const,
      statusCode: response.status,
      modelName,
      rawBody,
    };
  }

  const completion = JSON.parse(rawBody) as TGeminiResponse;

  return {
    ok: true as const,
    modelName,
    completion,
  };
};

const getChatReply = async (payload: TChatRequestPayload) => {
  const apiKey = envVars.GEMINI.API_KEY;

  if (!apiKey) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Chatbot service is not configured. Missing GEMINI_API_KEY.',
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

  const configuredModel = normalizeModelName(envVars.GEMINI.MODEL);
  const modelsToTry = [
    configuredModel,
    ...modelFallbacks.filter(model => model !== configuredModel),
  ];

  let lastError:
    | {
        statusCode: number;
        rawBody: string;
        modelName: string;
      }
    | undefined;

  let completion: TGeminiResponse | null = null;

  for (const modelName of modelsToTry) {
    const result = await requestGemini(apiKey, modelName, messages);

    if (result.ok) {
      completion = result.completion;
      break;
    }

    lastError = {
      statusCode: result.statusCode,
      rawBody: result.rawBody,
      modelName: result.modelName,
    };

    if (result.statusCode !== status.NOT_FOUND) {
      break;
    }
  }

  if (!completion) {
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
      `Gemini request failed for model ${lastError?.modelName || configuredModel} with status ${lastError?.statusCode || 'unknown'}: ${lastError?.rawBody || 'Unknown error'}`,
    );
  }

  const reply = completion.candidates?.[0]?.content?.parts
    ?.map(part => part.text || '')
    .join('')
    .trim();

  if (!reply) {
    throw new AppError(
      status.BAD_GATEWAY,
      'Gemini returned an empty response.',
    );
  }

  return {
    reply,
  };
};

export const ChatbotService = {
  getChatReply,
};
