import React from 'react';
import { Post } from '../types/Post';
import { User } from '../types/User';
import './PostItem.scss';

type PostItemProps = {
  post: Post;
  user?: User;
  openPostId: number | null;
  onPostOpen: (id: number) => void;
};

const PostItem = ({ post, user, openPostId, onPostOpen }: PostItemProps) => {
  const isPostOpen = openPostId === post.id ? true : false;

  return (
    <li className={`post ${isPostOpen ? 'open' : ''}`}>
      <h3 className='title'>{post.title}</h3>
      {user && (
        <div className='author'>
          <span>author: </span>
          {user ? (
            <span>
              {user.username} {user.email}
            </span>
          ) : (
            <span>Unknown</span>
          )}
        </div>
      )}
      {isPostOpen && <article className='article'>{post.body}</article>}
      <button className='read-more' onClick={() => onPostOpen(post.id)}>
        {!isPostOpen ? 'Read more' : 'Read less'}
      </button>
    </li>
  );
};

export default PostItem;
