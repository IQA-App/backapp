import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthSecretStatus } from '../authCode-status.enum';
import { PartnerStatus } from '../partner-status.enum';
import { TelegramPartnerData } from './telegram-partnerData.entity';

@Entity({ name: 'partners' })
export class Partners {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  partnerName: string;

  @Column({ type: 'varchar', default: PartnerStatus.Pending })
  partnerStatus: PartnerStatus;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  authSecret: string | null;

  // @Column({
  //   type: 'varchar',
  //   enum: AuthCodeStatus,
  //   default: AuthCodeStatus.Pending,
  // })
  // authSecretStatus: AuthCodeStatus;

  @Column({ type: 'varchar', default: AuthSecretStatus.Pending })
  authSecretStatus: AuthSecretStatus;

  @Column({ type: 'datetime', nullable: true })
  authSecretExpiresAt: Date | null;

  @Column({ type: 'text' })
  customFields: string;

  // one partner one telegramData
  @OneToOne(() => TelegramPartnerData, (telegramData) => telegramData.partner, {
    nullable: true, // allow partner exists w/o  telegramdata
    cascade: true, // allow save telegramdata automatically when save partner
    onDelete: 'SET NULL', // if telegram data deleted, partner remains exist but field will be null
  })
  @JoinColumn({ name: 'telegram_partner_data_id' }) // internal key
  telegramPartnerData: TelegramPartnerData | null;
}
