import React from 'react'
import { Button } from 'react-bootstrap'
import { PostsDocument, usePostsQuery } from '../generated/graphql'
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
                points={post.points}
                voteStatus={post.voteStatus}
            />
        ))}
        {data?.posts.hasMore &&
        <Button variant="outline-primary"  className="mt-4" onClick={() => {
            fetchMore({
                variables: {
                    limit: variables?.limit,
                    cursor: data?.posts.posts[data.posts.posts.length - 1].id
                },
                query: PostsDocument,
                //@ts-ignore
                updateQuery: (prev, {fetchMoreResult}) => {
                    return {
                        __typename: prev.__typename,
                        posts: {
                            hasMore: fetchMoreResult?.posts.hasMore,
                            posts: [...prev.posts.posts, ...(fetchMoreResult?.posts.posts || [])]
                        }
                    }
                }
            })
        }}>More posts</Button>}
        
        </div>
    )
}

export default Posts
