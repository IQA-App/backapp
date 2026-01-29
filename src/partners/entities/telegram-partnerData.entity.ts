import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Partners } from './partners.entity';

@Entity({ name: 'telegramPartnerData' })
export class TelegramPartnerData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', unique: true })
  chatId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  username?: string;

  //   one telegramData one partner
  @OneToOne(() => Partners, (partner) => partner.telegramPartnerData)
  partner: Partners;
}
