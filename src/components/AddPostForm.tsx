import React, { useState } from 'react';
import { User } from '../types/User';
import './AddPostForm.scss';
import { NewPost } from '../types/NewPost';

type AddPostFormProps = {
  users: User[];
  onAddPost: (post: NewPost) => void;
};

const AddPostForm = ({ users, onAddPost }: AddPostFormProps) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState(false);
  const [userId, setUserId] = useState(users[0]?.id || 1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      setTitleError(true);
      return;
    }

    if (!body) {
      setBodyError(true);
      return;
    }

    onAddPost({
      title,
      body,
      userId,
    });

    setTitle('');
    setBody('');
    setUserId(users[0]?.id || 1);
  };

  return (
    <div className='add-new-post'>
      <h3 className='title'>Add new post:</h3>
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor='name'>
          Add post title
          <input type='text' name='' value={title} id='name' onChange={(e) => setTitle(e.target.value)} />
          {titleError && <div className='error'>This field is required</div>}
        </label>
        <label htmlFor='content'>
          Add post content
          <textarea rows={10} name='' value={body} id='content' onChange={(e) => setBody(e.target.value)} />
          {bodyError && <div className='error'>This field is required</div>}
        </label>
        <label htmlFor='users'>
          Select post author
          <select name='' value={userId} id='users' onChange={(e) => setUserId(Number(e.target.value))}>
            {users.map((user) => {
              return (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              );
            })}
          </select>
        </label>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default AddPostForm;
