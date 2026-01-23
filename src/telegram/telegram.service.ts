import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
// import { CreateTelegramPartnerDataDto }
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramPartnerData } from 'src/partners/entities/telegram-partnerData.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TelegramService {
  private readonly bot: any;
  private logger = new Logger(TelegramService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(TelegramPartnerData)
    private readonly telegramRepository: Repository<TelegramPartnerData>,
  ) {
    const TELEGRAM_TOKEN = this.configService.get('TELEGRAM_TOKEN');

    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

    // use bot just once
    this.bot.on('message', (msg) => this.onReceiveMessage(msg));

    // use bot in chanells
    this.bot.on('channel_post', (msg) => {
      this.logger.log(`Channel message: ${msg.chat.id}`);
    });
  }

  onReceiveMessage = async (msg: any) => {
    if (!msg.from) {
      return;
    }

    this.logger.debug(`Telegram chat ID: ${msg.chat.id}`);

    console.log('--telegram data--', msg);
    try {
      const result = await this.saveTelegramPartnerData(
        await msg.from.id,
        await msg.from.first_name,
        await msg.from.username,
        await msg.text,
      );
      if (result) {
        this.logger.log(`This user ${msg.from.id} succefully processed`);
      }
    } catch (error) {
      this.logger.error(`Some error on processing message ${error.message}`);
    }
  };

  async sendMessage(chatId: string | number, text: string) {
    try {
      await this.bot.sendMessage(chatId, text);
    } catch (error) {
      this.logger.error(`Can not send a message: ${error.message}`);
    }
  }

  async saveTelegramPartnerData(
    telegramChatId: string,
    firstName: string,
    username: string,
    providedSecret: string,
  ) {
    console.log('-- saving telegram user data --', {
      telegramChatId,
      firstName,
      username,
      secretWord: providedSecret,
    });

    //  need to add logic how to handle secrets
    if (providedSecret !== '/hz') {
      await this.sendMessage(telegramChatId, `Secret in not correct`);
      return;
    }

    const existTelegramUserData = await this.telegramRepository.findOne({
      where: {
        chatId: telegramChatId,
        firstName: firstName,
        username: username,
      },
    });

    if (existTelegramUserData) {
      await this.sendMessage(telegramChatId, `You already submit this`);
      return;
    }

    const telegramUserData = await this.telegramRepository.save({
      chatId: telegramChatId,
      firstName: firstName,
      username: username,
    });

    await this.sendMessage(
      telegramChatId,
      `Chat bot is greeting you! Now you can receive notifications from this chat bot!`,
    );

    return telegramUserData;
  }

  async saveAuthSecret() {} //  possibly resolve in partners.service
}
