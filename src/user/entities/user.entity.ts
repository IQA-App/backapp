import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'nvarchar',
    default: Role.User,
  })
  role: Role;
}
