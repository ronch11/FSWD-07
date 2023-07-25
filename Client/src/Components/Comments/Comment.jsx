import React from 'react'

function Comment({comment}) {
  return (
    <div>
      <p>Comment by {comment.author} | {comment.date}</p>
      <p>{comment.body}</p>
    </div>
  )
}

export default Comment
