import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../order-status.enum';
import { Address } from './address.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  email: string;

  @Column({ unique: true })
  orderNumber: string;

  @Column({
    type: 'varchar',
    default: OrderStatus.Pending,
  })
  orderStatus: OrderStatus;

  @Column({
    type: 'varchar',
    default: OrderStatus.Pending,
  })
  assignedTo: string;

  @Column({ type: 'text' })
  customFields: string;

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
    nullable: true,
  })
  user?: User;

  @ManyToOne(() => Address, (address) => address.orders, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'address_id' })
  address?: Address;
}
