import { Partners } from './entities/partners.entity';
import { parseMaybeJson } from 'src/utils/parse.json';

export class PartnersMapper {
  static toResponse(partners: Partners): any {
    return {
      partner: {
        id: partners.id,
        createdAt: partners.createdAt,
        updatedAt: partners.updatedAt,
        partnerName: partners.partnerName,
        partnerStatus: partners.partnerStatus,
        email: partners.email,
        authSecret: partners.authSecret,
        authSecretStatus: partners.authSecretStatus,
        authSecretExpiresAt: partners.authSecretExpiresAt,
        customFields: parseMaybeJson(partners.customFields),
      },
    };
  }
}
