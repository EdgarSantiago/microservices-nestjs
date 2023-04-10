import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  cpf: string;

  //  @Column()
  //  email: string;
  //
  //  @Column()
  //  name: string;
  //
  //  @Column()
  //  lastName: string;
  //
  //  @Column()
  //  atv: string;
  //
  //  @Column()
  //  missing: boolean;
  //
  //  @Column()
  //  wageValue: number;
  //
  //  @Column()
  //  paidWages: boolean;
  //
  //  @Column()
  //  enterTime: number;
  //
  //  @Column()
  //  leaveTime: number;
}
