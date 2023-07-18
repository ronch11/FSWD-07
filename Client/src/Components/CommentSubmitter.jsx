import React from 'react'
import { useState, useContext } from 'react'
import ApiContext from '../ApiContext';
function CommentSubmitter({videoid, addComment}) {
    const [body, setBody] = useState('');
    const api = useContext(ApiContext);
    const submitComment = async (e) => {
        e.preventDefault();
        const comment = {
            body
        }
        api.post('/comments/' + videoid, comment).then(response => {
            console.log(response);
            addComment(response.data);
            setBody('');
        }).catch(error => {
            console.log(error);
        });
    }
  return (
    <div>
        <form>
            <label>
                Comment:
                <textarea value={body} onChange={e => setBody(e.target.value)}></textarea>
            </label>
            <input type="submit" value="Submit" onClick={submitComment} />
        </form>
    </div>
  )
}

export default CommentSubmitter
