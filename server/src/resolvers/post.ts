import { Updoot } from './../entities/Updoot';
import { isAuth } from './../middleware/isAuth';
import { myContext } from '../types';
import {Arg, Mutation, Query, Resolver, Field, Ctx, UseMiddleware, InputType, Int, FieldResolver, Root, ObjectType} from "type-graphql";
import {Post} from "../entities/Post";
import { LessThan, LessThanOrEqual } from 'typeorm';

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]
    @Field()
    hasMore: boolean
}

@Resolver(Post)
export class PostResolver {

    @FieldResolver(() => String)
    textSnippet(@Root() post: Post) {
        return post.text.slice(0, 50)
    }

    @FieldResolver(() => Int, {nullable: true})
    async voteStatus(
        @Root() post: Post,
        @Ctx() {req, voteStatusLoader}: myContext
    ) {
        if (!req.session.userId) return null
        const updoot = await voteStatusLoader.load({postId: post.id, userId: req.session.userId})
        return updoot?.value || null
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: myContext
    ) {
        const userId = req.session.userId
        const isUpdoot = value !== -1
        const realValue = isUpdoot ? 1 : -1
        const updoot = await Updoot.findOne({where: {userId, postId}})
        if (updoot && updoot.value !== realValue ) {
            updoot.value = realValue
            await updoot.save()
            await Post.update(postId, {points: ()=> `points + ${2 * realValue}`})
        } else if (!updoot) {
            await Updoot.insert({userId, postId, value: realValue})
            await Post.update(postId, {points: ()=> `points + ${realValue}`})
        }
        return true
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int, {defaultValue: 5}) limit: number,
        @Arg("cursor", () => Int, {defaultValue: 0}) cursor: number
    ): Promise<PaginatedPosts>  {
        const realLimit = Math.min(10, limit)
        const posts = await Post.find({
            relations: ['creator'],
            where: cursor ? {id: LessThan(cursor)} : {},
            take: realLimit + 1,
            order: {createdAt: "DESC"},
        })
        return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimit + 1 }
    }

    @Query(() => Post, {nullable: true})
    async post( @Arg('id', () => Int) id: number): Promise<Post | undefined >  {
        return await Post.findOne(id, {relations: ['creator']})
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost( 
         @Arg('postInput') postInput: PostInput,
         @Ctx() {req}: myContext
    ): Promise<Post> {
        return await Post.create({
            ...postInput,
            creatorId: req.session.userId
        }).save()
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String) title: string,
    ): Promise<Post | null>  {
        let post = await Post.findOne(id)
        if (!post) {
            return null
        }
        if (typeof title !== "undefined") {
            post.title = title
            await post.save()
        }
        return post
    }

    @Mutation(() => Boolean)
    async deletePost( @Arg('id') id: number ): Promise<boolean> {
        try {
            await Post.delete(id)
        } catch (e) {
            return false
        }
        return true
    }
}