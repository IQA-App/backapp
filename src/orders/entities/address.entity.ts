import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { BuildingType } from '../building-type.enum';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  houseNumber: string;

  @Column({ nullable: true })
  apartmentNumber: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  zipCode: string;

  @Column()
  state: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    enum: BuildingType,
  })
  buildingType: BuildingType;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order;
}
