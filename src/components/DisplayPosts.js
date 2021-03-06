import { useEffect, useState } from 'react'
import { listPosts } from '../graphql/queries'
import { API, graphqlOperation } from 'aws-amplify'

export default function DisplayPosts () {
  const [posts, setPosts] = useState([])

  const getPosts = async () => {
    const { data: { listPosts: { items: posts } } } = await API.graphql(graphqlOperation(listPosts))
    console.log(test)
    return posts
  }

  useEffect(() => {
    getPosts().then(allPosts => {
      setPosts(allPosts)
      console.log('Data received!', allPosts)
    })

  }, [])

  const rowStyle = {
    background: '#f4f4f4',
    padding: '10px',
    border: "1px dotted #ccc",
    margin: '14px'
  }

  return (
    <div>
      {posts.map(({ id, postTitle, posrtBody, createdAt, postOwnerUsername }) =>
        <div key={id} className='posts' style={rowStyle}>
          <h1>{postTitle}</h1>
          <span style={{ fontStyle: 'italic', color: '#0ca5e297' }}>Wrote by: {postOwnerUsername}
            <time > on {new Date(createdAt).toDateString()}</time>
          </span>
          <p>{posrtBody}</p>
        </div>)}
    </div>
  )
}

// id: ID!
// postOwnerId: String!
// postTitle: String!
// posrtBody: String!
// description: String
// comments: [Comment] @connection(name: "PostComments") #relations
// likes
