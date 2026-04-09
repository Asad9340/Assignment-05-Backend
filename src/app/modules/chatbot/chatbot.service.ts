import status from 'http-status';
import AppError from '../../errorHelpers/AppError';
import { envVars } from '../../config/env.config';
import { prisma } from '../../lib/prisma';
import { EventStatus, EventVisibility } from '../../../generated/prisma/enums';

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
  'You are Planora Assistant. You must answer using only provided Planora event database context. Never invent events, prices, dates, links, or venues. If requested data is unavailable in the provided context, say that clearly and ask the user to refine search criteria.';

type TEventContextItem = {
  id: string;
  title: string;
  description: string;
  eventDateTime: Date;
  venue: string | null;
  eventLink: string | null;
  feeType: string;
  registrationFee: number;
  visibility: string;
  ownerName: string;
};

const buildSearchTerms = (message: string) => {
  const normalized = message.trim().toLowerCase();
  const parts = normalized
    .split(/[^a-z0-9]+/)
    .map(part => part.trim())
    .filter(part => part.length >= 3);

  return Array.from(new Set([normalized, ...parts])).slice(0, 8);
};

const fetchTopMatchingEvents = async (message: string) => {
  const searchTerms = buildSearchTerms(message);
  const now = new Date();

  const searchFilters = searchTerms.flatMap(term => [
    { title: { contains: term, mode: 'insensitive' as const } },
    { description: { contains: term, mode: 'insensitive' as const } },
    { venue: { contains: term, mode: 'insensitive' as const } },
    { owner: { name: { contains: term, mode: 'insensitive' as const } } },
  ]);

  const matchingEvents = await prisma.event.findMany({
    where: {
      isDeleted: false,
      status: EventStatus.ACTIVE,
      visibility: EventVisibility.PUBLIC,
      eventDateTime: {
        gte: now,
      },
      ...(searchFilters.length > 0 ? { OR: searchFilters } : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      eventDateTime: true,
      venue: true,
      eventLink: true,
      feeType: true,
      registrationFee: true,
      visibility: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ eventDateTime: 'asc' }, { createdAt: 'desc' }],
    take: 6,
  });

  if (matchingEvents.length > 0) {
    return matchingEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      eventDateTime: event.eventDateTime,
      venue: event.venue,
      eventLink: event.eventLink,
      feeType: event.feeType,
      registrationFee: event.registrationFee,
      visibility: event.visibility,
      ownerName: event.owner.name,
    }));
  }

  const upcomingEvents = await prisma.event.findMany({
    where: {
      isDeleted: false,
      status: EventStatus.ACTIVE,
      visibility: EventVisibility.PUBLIC,
      eventDateTime: {
        gte: now,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      eventDateTime: true,
      venue: true,
      eventLink: true,
      feeType: true,
      registrationFee: true,
      visibility: true,
      owner: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ eventDateTime: 'asc' }, { createdAt: 'desc' }],
    take: 6,
  });

  return upcomingEvents.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    eventDateTime: event.eventDateTime,
    venue: event.venue,
    eventLink: event.eventLink,
    feeType: event.feeType,
    registrationFee: event.registrationFee,
    visibility: event.visibility,
    ownerName: event.owner.name,
  }));
};

const buildEventContext = (events: TEventContextItem[]) => {
  if (events.length === 0) {
    return [
      'EVENT_DATA:',
      'No matching active public events are currently available in Planora database.',
      '',
      'RULES:',
      '- Say that no events are available right now.',
      '- Ask user to try another keyword or check later.',
      '- Do not invent any event.',
    ].join('\n');
  }

  const eventLines = events.map(event => {
    const feeLabel =
      event.feeType === 'PAID' ? `${event.registrationFee}` : 'Free';

    return `- ID: ${event.id}\n  Title: ${event.title}\n  DateTime: ${event.eventDateTime.toISOString()}\n  Venue: ${event.venue || 'N/A'}\n  Fee: ${feeLabel}\n  Organizer: ${event.ownerName}\n  Link: ${event.eventLink || 'N/A'}\n  Summary: ${event.description.slice(0, 220)}`;
  });

  return [
    'EVENT_DATA:',
    ...eventLines,
    '',
    'RULES:',
    '- Answer using only EVENT_DATA above.',
    '- If user asks details not present, say not available in current Planora data.',
    '- Prefer recommending from listed IDs and include date, venue, and link when available.',
  ].join('\n');
};

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
  eventContext: string,
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
          content: `${SYSTEM_PROMPT}\n\n${eventContext}`,
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
  const eventMatches = await fetchTopMatchingEvents(payload.message);
  const eventContext = buildEventContext(eventMatches);

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
      eventContext,
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
