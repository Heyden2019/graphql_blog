import { Redis } from 'ioredis';
import {Request, Response} from "express";
import createVoteStatusLoader from './utils/createvoteStatusLoader';

export type myContext = {
    req:  Request & {session: Express.Session};
    res: Response;
    redis: Redis;
    voteStatusLoader: ReturnType<typeof createVoteStatusLoader>;
}