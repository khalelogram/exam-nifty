import { Exclude } from "class-transformer";
import {Column, CreateDateColumn, Entity, DeleteDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity('userstestnifty')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({default: 'members'})
    roles: string; 

    @CreateDateColumn()
    date_created: Date;

    @Column("timestamp with time zone", {nullable: true})
    date_updated: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

