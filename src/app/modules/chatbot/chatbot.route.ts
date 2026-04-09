import { Router } from 'express';
import { ChatbotController } from './chatbot.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { chatbotMessageValidationSchema } from './chatbot.validation';
import { chatbotRateLimit } from '../../middleware/chatbotRateLimit';

const router = Router();

router.post(
  '/message',
  chatbotRateLimit,
  validateRequest(chatbotMessageValidationSchema),
  ChatbotController.sendMessage,
);

export const ChatbotRoutes = router;
