import { UpdateDateColumn, CreateDateColumn, Column, PrimaryGeneratedColumn, Entity, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import {Field, ObjectType, Int} from "type-graphql";
import { User } from './User';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class Post extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    creatorId: number

    @Field(() => Int, {nullable: true})
    voteStatus: number | null

    @Field(() => User)
    @ManyToOne(() => User, user => user.posts )
    creator: User

    @Field()
    @Column({type: 'text'})
    title!: string;

    @Field()
    @Column({type: 'text'})
    text!: string;

    @Field()
    @Column({type: 'int', default: 0})
    points!: number;
    
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Updoot, updoot => updoot.post )
    updoots: Updoot[]
}