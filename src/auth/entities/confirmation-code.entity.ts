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
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  email: string;

  @Column({
    type: 'nvarchar',
    default: CodeStatus.Pending,
  })
  status: CodeStatus;

  @ManyToOne(() => User, (user) => user.orders, { eager: false })
  user: User;
}
