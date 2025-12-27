import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../order-status.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  description: string;

  @Column()
  email: string;

  @Column()
  orderNumber: string;

  @Column({
    type: 'varchar',
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({
    type: 'varchar',
    default: OrderStatus.Pending,
  })
  technician: string;

  @Column({ type: 'text' })
  serviceType: string;

  // @Column({ type: 'nvarchar', length: 'MAX' })
  // address: string;

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
    nullable: true,
  })
  user?: User;
}
