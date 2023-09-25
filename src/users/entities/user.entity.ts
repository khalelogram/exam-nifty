import {Column, CreateDateColumn, Entity, DeleteDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @CreateDateColumn()
    date_created: Date;

    @Column("timestamp with time zone", {nullable: true})
    date_updated: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

