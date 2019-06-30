import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsInt, IsBoolean } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Predict {
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
  @IsString()
  predictDate: string; //eg. 2019-07-11

  @Column('tinyint')
  @ApiModelProperty()
  @IsInt()
  predictResult: number; //预言结果 -1、1

  @Column({ type: 'tinyint', nullable: true })
  @ApiModelProperty()
  @IsInt()
  actualResult: number; //实际结果 -1、1

  @Column('int')
  @ApiModelProperty()
  @IsInt()
  predictValue: number; //预言花费积分

  @Column({ type: 'int', nullable: true })
  @ApiModelProperty()
  @IsInt()
  actualValue: number; //实际所得积分

  @Column('tinyint')
  @ApiModelProperty()
  @IsBoolean()
  isFinished: boolean; // 0、1

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;
}
