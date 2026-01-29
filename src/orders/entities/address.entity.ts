import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { BuildingType } from '../building-type.enum';

// all address props are optional
@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  houseNumber?: string;

  @Column({ nullable: true })
  apartmentNumber?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: BuildingType,
    nullable: true,
  })
  buildingType?: BuildingType;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];
}
