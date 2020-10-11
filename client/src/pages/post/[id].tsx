import classNames from 'classnames'
import { useRouter } from 'next/router'
import React from 'react'
import { usePostQuery } from '../../generated/graphql'
import dateFormatter from '../../utils/dateFormatter'

const PostPage = () => {

    const router = useRouter()
    const id = parseInt(router.query.id as string) || -1
    const {data, loading, error} = usePostQuery({variables: {id}})

    if(loading) {
        return <div className="container">Loading...</div>
    }

    if(!data?.post) {
        return <div className="container">No post...</div>
    }

    if(error) {
        return <div className="container">Erroro...</div>
    }

    return (
        <div className="container">
            <h3 className="mt-4">{data?.post?.title}</h3>
            <p className="card-text"><small className="text-muted">{dateFormatter(data?.post?.createdAt as string)}</small></p>
            <p className={classNames({
                'red': data.post?.points < 0,
                'green': data.post?.points > 0
            })}>Rating: {data.post?.points}</p>
            <p>{data.post?.text}</p>
            <p>Author: {data.post?.creator.username}</p>
            {/* <p>Other posts{data.post?.text}</p> */}
        </div>

    )
}

export default PostPage
