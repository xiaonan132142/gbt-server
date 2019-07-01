import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true, default: 'guest' })
  userName: string;

  @Column()
  userLogo: string;

  @Column('text')
  @ApiModelProperty()
  @IsString()
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
