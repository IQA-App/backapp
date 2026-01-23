import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partners } from './entities/partners.entity';
import { parseMaybeJson } from 'src/utils/parse.json';
import { TelegramService } from 'src/telegram/telegram.service';
import { ConfigService } from '@nestjs/config';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { generateRandomSixDigitString } from './generate-auth-secret';
import { PartnersMapper } from './partner.mapper';
import { UpdatePartnerDto } from './dto/update-partner.dto';

/*
partners mean who is going to use this app and then have customers
who will make orders.
partners will have access to telegram bot and receive notifications
for now only admin can CRUD partners
*/

@Injectable()
export class PartnerService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Partners)
    private readonly partnerRepository: Repository<Partners>,
    private readonly telegramService: TelegramService,
  ) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partners> {
    const generateAuthSecret = generateRandomSixDigitString();

    const existPartner = await this.partnerRepository.findOne({
      where: [
        { partnerName: createPartnerDto.partnerName },
        { email: createPartnerDto.email },
      ],
    });

    if (existPartner) {
      if (
        existPartner.partnerName === createPartnerDto.partnerName &&
        existPartner.email === createPartnerDto.email
      ) {
        throw new BadRequestException(
          'the partner with this name and email already exists',
        );
      }
      if (existPartner.partnerName === createPartnerDto.partnerName) {
        throw new BadRequestException(
          'the partner with this partner name already exists',
        );
      }
      if (existPartner.email === createPartnerDto.email) {
        throw new BadRequestException(
          'the partner with this email already exists',
        );
      }
    }

    const newPartner = await this.partnerRepository.save({
      partnerName: createPartnerDto.partnerName,
      email: createPartnerDto.email,
      customFields: createPartnerDto.customFields,
    });

    try {
      return await PartnersMapper.toResponse(newPartner);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findPartnerById(id: string): Promise<Partners> {
    const partner = await this.partnerRepository.findOne({
      where: { id: id },
    });

    if (!partner) {
      throw new NotFoundException('partner not found');
    }

    return PartnersMapper.toResponse(partner);
  }

  async findAllPartners(): Promise<any[]> {
    const partners = await this.partnerRepository.find();

    if (partners.length === 0) {
      throw new NotFoundException('partners not found');
    }

    return partners.map((partner) => PartnersMapper.toResponse(partner));
  }

  async updatePartnerById(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<any> {
    const partner = await this.partnerRepository.findOneBy({
      id,
    });

    if (!partner) {
      throw new NotFoundException('partner not found');
    }

    if (updatePartnerDto.partnerName) {
      const existPartner = await this.partnerRepository.findOneBy({
        partnerName: updatePartnerDto.partnerName,
      });

      if (existPartner && existPartner.id !== id) {
        throw new BadRequestException('this partner name already exists');
      }
      partner.partnerName = updatePartnerDto.partnerName;
    }

    if (updatePartnerDto.email) {
      const existPartner = await this.partnerRepository.findOneBy({
        email: updatePartnerDto.email,
      });
      if (existPartner && existPartner.id !== id) {
        throw new BadRequestException('this partner email alreadt exists');
      }
      partner.email = updatePartnerDto.email;
    }

    if (updatePartnerDto.customFields !== undefined) {
      partner.customFields =
        typeof updatePartnerDto.customFields !== 'string'
          ? JSON.stringify(updatePartnerDto.customFields)
          : updatePartnerDto.customFields;
    }

    try {
      return await this.partnerRepository.save(partner);
    } catch (error) {
      throw new Error(error);
    }

    return PartnersMapper.toResponse(partner);
  }

  async deletePartner(id: string) {
    const partner = await this.partnerRepository.findOneBy({ id });

    if (!partner) {
      throw new NotFoundException('partner not found');
    }

    try {
      await this.partnerRepository.delete(id);
    } catch (error) {
      throw new Error(error);
    }

    return { message: 'the partner was succesfully deleted' };
  }

  async updateAuthSecret() {} //   this should generate/update telegram auth secret

  //    need to create methods: update partner status, 
}
