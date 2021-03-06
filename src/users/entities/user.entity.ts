import { Role } from 'src/auth/enums/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  role: Role;
}

export interface SanitizedUser extends Omit<User, 'password_hash'> {
  password_hash?: never;
}
