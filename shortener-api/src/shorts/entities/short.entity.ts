import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shorts')
export class Short {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  url: string;

  @Column()
  ownerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
