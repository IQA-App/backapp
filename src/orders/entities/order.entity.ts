import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  //   @Date()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  customerEmail: string;

  @Column()
  request: string;
}
