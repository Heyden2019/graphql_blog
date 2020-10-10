import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import { Updoot } from './entities/Updoot';
import { Post } from './entities/Post';
import { User } from './entities/User';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {PostResolver} from "./resolvers/post";
import {UserResolver} from "./resolvers/user";
import Redis from 'ioredis';
import session from "express-session";
import connectRedis from "connect-redis";
import {__prod__, COOKIE_NAME} from "./constants";
import {myContext} from "./types";
import cors from "cors";
import { createConnection } from "typeorm";
import createVoteStatusLoader from './utils/createvoteStatusLoader';


const main = async () => {

    await createConnection({
        type: "postgres",
        url: process.env.DB_URL,
        logging: true,
        synchronize: true,
        entities: [User, Post, Updoot]
    })

    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis(process.env.REDIS_URL)

    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }))

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 3,
                sameSite: "lax",
                secure: __prod__,
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        }),
        // @ts-ignore
        context: ({req, res}): myContext => ({ req, res, redis, voteStatusLoader: createVoteStatusLoader() })
    })
    apolloServer.applyMiddleware({
        app,
        cors: false
    })
    app.listen(process.env.PORT, () => {
        console.log("Server started on port:", process.env.PORT)
    })
}

main().catch(e => {
    console.error(e)
})
