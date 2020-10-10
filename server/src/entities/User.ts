
import {Field, ObjectType} from "type-graphql";
import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Entity, BaseEntity, OneToMany } from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt:Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Column({type: 'text'})
    password!: string;

    @Field(() => [Post], {nullable: true})
    @OneToMany(() => Post, post => post.creator )
    posts: Post[]
    
    @OneToMany(() => Updoot, updoot => updoot.user )
    updoots: Updoot[]
}