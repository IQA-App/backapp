import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  title: string;

  //   @Date()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.orders, { eager: false })
  user: User;
}
