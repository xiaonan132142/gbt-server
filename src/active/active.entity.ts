import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Active {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column()
  userLogo: string;

  @Column()
  @ApiModelProperty()
  @IsInt()
  times: number;

  @Column()
  @ApiModelProperty()
  @IsInt()
  rank: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;
}
