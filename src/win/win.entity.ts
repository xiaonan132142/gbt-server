import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsInt } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Win {
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
  winTimes: number;

  @Column()
  @ApiModelProperty()
  @IsInt()
  predictTimes: number;

  @Column()
  @ApiModelProperty()
  @IsInt()
  winRatio: number;

  @Column()
  @ApiModelProperty()
  @IsInt()
  rank: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;
}
