import React from 'react'
import { Button } from 'react-bootstrap'
import { usePostsQuery } from '../generated/graphql'
import Post from './Post'

const Posts = () => {

    const {data, fetchMore, variables} = usePostsQuery()

    return (
        <div className="mb-4 d-flex justify-content-center flex-column">
        {data?.posts.posts.map((post) => (
            <Post 
                createdAt={post.createdAt}
                creator={post.creator.username}
                textSnippet={post.textSnippet}
                title={post.title}
                key={post.id}
                id={post.id}
            />
        ))}
        {data?.posts.hasMore &&
        <Button variant="outline-primary"  className="mt-4" onClick={() => {
            fetchMore({variables: {
                limit: variables?.limit,
                cursor: data?.posts.posts[data.posts.posts.length - 1].id
            }})
        }}>More posts</Button>}
        
        </div>
    )
}

export default Posts
