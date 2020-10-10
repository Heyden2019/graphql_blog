import { FORGET_PASSWORD_PREFIX } from './../constants';
import { sendEmail } from './../utils/sendEmail';
import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, Root, FieldResolver} from "type-graphql";
import { myContext } from "src/types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {COOKIE_NAME} from "../constants";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import {errorResponseCreator} from "../utils/errorResponseCreator";
import {validateRegister} from "../utils/validateRegister";
import { v4 } from 'uuid';

@ObjectType()
class Error {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [Error], {nullable: true})
    errors?: Array<Error>

    @Field(() => User, {nullable: true})
    user?: User
}



@Resolver(User)
export class UserResolver {

    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() {req}: myContext) {
        if (req.session.userId === user.id) {
            return user.email
        }
        return ""
    }

    @Mutation(() => UserResponse)
    async changePassword (
        @Arg("newPassword") newPassword: string,
        @Arg("token") token: string,
        @Ctx() {redis, req}: myContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return errorResponseCreator("newPassword", "Password's length must be longer")
        }

        const userId = await redis.get(FORGET_PASSWORD_PREFIX + token)
        if (!userId) {
            return errorResponseCreator("token", "token expired")
        }

        const user = await User.findOne(parseInt(userId))
        if (!user) {
            return errorResponseCreator("token", "User no longer exists")
        }
        user.password = await argon2.hash(newPassword)
        await user.save()
        await redis.del(FORGET_PASSWORD_PREFIX + token)

        //login after change password
        req.session.userId = user.id

        return {user}
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email:string,
        @Ctx() {redis}: myContext
    ) {
        const user = await User.findOne({where: {email}})
        if (!user) {
            return false
        }

        const token = v4()
        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000*60*60*24
        )
        await sendEmail(
            email,
            `<a href=${process.env.BASE_URL}/change-password/${token}>Change password</a>`
        )

        return true
    }

    @Query(() => [User], {nullable: true})
    async getUsers(): Promise<Array<User> | null> {
        return await User.find({relations: ["posts"]})
    }

    @Query( () => User, {nullable: true})
    async me(
        @Ctx() {req}: myContext
    ): Promise<User | undefined> {
        if (!req.session.userId) {
            return  undefined
        }
        return await User.findOne(req.session.userId)
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {req}: myContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options)
        if (errors) return errors
        const hashedPassword = await argon2.hash(options.password)
        const user = User.create({
            ...options,
            password: hashedPassword
        })
        try {
            await user.save()
        } catch (e) {
            if (e.code === "23505") {
                if (e.detail.includes("username")) {
                    return errorResponseCreator("username", `Username '${options.username}' is already taken`)
                }
                if (e.detail.includes("email")) {
                    return errorResponseCreator("email", `Email '${options.email}' is already taken`)
                }
                console.log(e)
            }
            return errorResponseCreator("???", `uncatched error`)
        }
        req.session.userId = user.id
        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() {req}: myContext
    ): Promise<UserResponse> {
        const user = await User.findOne(usernameOrEmail.includes("@") ? {email: usernameOrEmail} : {username : usernameOrEmail})
        if (!user) {
            return errorResponseCreator("usernameOrEmail", `User ${usernameOrEmail} doesn't exist`)
        }
        const valid = await argon2.verify(user.password, password)
        if (!valid) {
            return errorResponseCreator("password", "Incorrect password")
        }
        req.session.userId = user.id
        return {user}
    }

    @Mutation(() => Boolean)
    logout( @Ctx() {req, res}: myContext ) {
        return  new Promise( resolve => {
            res.clearCookie(COOKIE_NAME)
            req.session.destroy((err) => {
                if (err) {
                    console.log(err)
                    resolve(false)
                    return;
                }
                resolve(true)
            })
        })
    }
}