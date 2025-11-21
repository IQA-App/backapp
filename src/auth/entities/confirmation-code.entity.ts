import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CodeStatus } from '../code-status.enum';

@Entity({ name: 'codes' })
export class Codes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  // @Column({ type: 'datetime2'})
  // expiresAt: Date;

  @Column()
  email: string;

  @Column({
    type: 'nvarchar',
    default: CodeStatus.Pending,
  })
  status: CodeStatus;

  @ManyToOne(() => User, (user) => user.codes, { eager: false })
  user: User;
}
