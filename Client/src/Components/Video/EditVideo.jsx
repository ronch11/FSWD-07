import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react';
import ApiContext from '../../ApiContext.jsx';
function EditVideo() {
    const api = useContext(ApiContext);
    const navigate = useNavigate();
    let {videoid} = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [visibility, setVisibility] = useState('');
    api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');

    useEffect(() => {
        api.get('/videos/details/' + videoid).then(response => {
            console.log(response);
            setTitle(response.data.title);
            setDescription(response.data.description);
            setTags(response.data.tags.join(','));
            setVisibility(response.data.visibility);
        }).catch(error => {
            console.log(error);
        });
    }, []);
    const updateVideo = async (e) => {
        e.preventDefault();
        const changes = {
            title,
            description,
            tags : tags.toLowerCase().replace(/\s+/g, '').split(','),
            visibility
        }
        api.put('/videos/update/' + videoid, changes).then(response => {
            console.log(response);
            navigate('/Profile');
        }).catch(error => {
            console.log(error);
        });
    }

  return (
    <div>
          <form onSubmit={updateVideo}>
            <label>
                Title:
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </label>

            <label>
                Description:
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </label>

            <label>
                Tags (comma separated):
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} />
            </label>

            <label>
                Visibility:
                <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="unlisted">Unlisted</option>
                </select>
            </label>

            <input type="submit" value="Submit" />
          </form>
      </div>
  )
}

export default EditVideo
