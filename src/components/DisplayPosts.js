import { useEffect, useState } from 'react'
import { listPosts } from '../graphql/queries'
import { onCreatePost } from '../graphql/subscriptions'
import { API, graphqlOperation } from 'aws-amplify'
import DeletePost from './DeletePost'
import EditPost from './EditPost'

export default function DisplayPosts () {
  const [posts, setPosts] = useState([])

  const getPosts = async () => {
    const { data: { listPosts: { items: posts } } } = await API.graphql(graphqlOperation(listPosts))
    return posts
  }

  useEffect(() => {
    getPosts().then(allPosts => {
      setPosts(allPosts)
      console.log('Data received!', allPosts)
    })

    const createPostListener = API.graphql(graphqlOperation(onCreatePost))
      .subscribe({
        next: ({ value: { data: { onCreatePost: newPost } } }) => {
          setPosts((posts) => [newPost, ...posts.filter(post => post.id !== newPost.id)])
        }
      })

    return () => {
      createPostListener.unsubscribe()
    }

  }, [])

  const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: "1px dotted #ccc",
    margin: '14px'
  }

  return (
    <div>
      {posts.map(({ id, postTitle, postBody, createdAt, postOwnerUsername }) =>
        <div key={id} className='posts' style={rowStyle}>
          <h1>{postTitle}</h1>
          <span style={{ fontStyle: 'italic', color: '#0ca5e297' }}>
            Wrote by: {postOwnerUsername}
            <time> on {new Date(createdAt).toDateString()}</time>
          </span>
          <p>{postBody}</p>
          <br />
          <span>
            <DeletePost />
            <EditPost />
          </span>
        </div>)}
    </div>
  )
}

// description: String
// comments: [Comment] @connection(name: "PostComments") #relations
// likes
