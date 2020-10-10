import { Updoot } from './../entities/Updoot';
import DataLoader from "dataloader"

const createVoteStatusLoader = () =>
    new DataLoader<{postId: number, userId: number}, Updoot | null>( async (keys) => {
        const updoot = await Updoot.findByIds(keys as any)
        const second = {} as any
        updoot.forEach(key => {
            second[`${key.postId}|${key.userId}`] = key
        })
        return keys.map(key => second[`${key.postId}|${key.userId}`] )
    })

    export default createVoteStatusLoader