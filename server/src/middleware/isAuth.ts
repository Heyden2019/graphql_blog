import { myContext } from './../types';
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<myContext> = ({context}, next) => {
    if (!context.req.session.userId) {
        throw new Error("User is not authenticate")
    }
    return next()
}