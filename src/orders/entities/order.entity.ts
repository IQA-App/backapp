import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../order-status.enum';
import { Address } from './address.entity';

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

  @Column({ unique: true })
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

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
    nullable: true,
  })
  user?: User;

  @ManyToOne(() => Address, (address) => address.orders, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
