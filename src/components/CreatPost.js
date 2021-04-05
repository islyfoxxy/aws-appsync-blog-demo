import { useReducer } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createPost } from '../graphql/mutations'

export default function CreatPost () {
  const initFormState = {
    postOwnerId: 'hureh4452f',
    postOwnerUsername: 'Alexa',
    postTitle: '',
    postBody: ''
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'reset':
        return action.payload
      default:
        return { ...state, [action.type]: action.payload }
    }
  }

  const [formState, dispatch] = useReducer(reducer, initFormState)

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const input = { ...formState, createdAt: new Date().toISOString() }

    console.log('input', input)

    await API.graphql(graphqlOperation(createPost, { input }))

    dispatch({ type: 'reset', payload: initFormState })
  }

  const handleChange = ({ currentTarget }) =>
    dispatch({ type: currentTarget.name, payload: currentTarget.value })

  return (
    <form className='add-post' onSubmit={handleSubmit}>
      <input style={{ font: '19px' }} type='text' placeholder='Title'
        value={formState.postTitle} name='postTitle' onChange={handleChange} required />
      <textarea type='text' rows='3' placeholder='New blog post here'
        value={formState.postBody} name='postBody' onChange={handleChange} required />
      <input type='submit' style={{ font: '19px' }} />
    </form>
  )
}
