import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../role.enum';
import { Order } from 'src/orders/entities/order.entity';
import { Codes } from 'src/auth/entities/confirmation-code.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'nvarchar',
    default: Role.Customer,
  })
  role: Role;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Codes, (code) => code.user)
  codes: Codes[];
}
