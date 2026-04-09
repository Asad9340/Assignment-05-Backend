import { Request, Response } from 'express';
import status from 'http-status';
import catchAsync from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ChatbotService } from './chatbot.service';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatbotService.getChatReply(req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Chatbot response generated successfully',
    data: result,
  });
});

export const ChatbotController = {
  sendMessage,
};
