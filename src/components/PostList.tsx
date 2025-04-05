import React, { use, useEffect, useState } from 'react';
import { Post } from '../types/Post';
import PostItem from './PostItem';
import { apiUrl } from '../utils/apiUrl';
import { User } from '../types/User';
import './PostList.scss';
import AddPostForm from './AddPostForm';
import { NewPost } from '../types/NewPost';

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAddingNewPost, setIsAddingNewPost] = useState(false);
  const [isPostAdded, setIsPostAdded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [openPostId, setOpenPostId] = useState<null | number>(null);
  const [showForm, setShowForm] = useState(false);

  const handlePostOpen = (id: number) => {
    if (openPostId === id) {
      setOpenPostId(null);
    } else {
      setOpenPostId(id);
    }
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
    setOpenPostId(null);
  };

  const addNewPost = async (newPost: NewPost) => {
    try {
      setIsAddingNewPost(true);
      const response = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        body: JSON.stringify({
          title: newPost.title,
          body: newPost.body,
          userId: newPost.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const newPostData: { id: number } = await response.json();

      if (newPostData.id) {
        setPosts((prev) => [{ ...newPost, ...newPostData }, ...prev]);
        setIsPostAdded(true);
        setTimeout(() => {
          setIsPostAdded(false);
        }, 4000);

        setShowForm(false);
      } else {
        throw new Error(`There was errow while adding news post - try again.`);
      }
    } catch (error) {
      throw new Error(`There was error while adding new post: ${error}`);
    } finally {
      setIsAddingNewPost(false);
    }
  };

  const handleAddNewPost = (newPost: NewPost) => {
    addNewPost(newPost);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const response = await fetch(`${apiUrl}/posts`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();

        setPosts(data);
      } catch (error) {
        throw new Error(`There was error while fetching posts: ${error}`);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setIsLoadingUsers(true);

        const response = await fetch(`${apiUrl}/users`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();

        setUsers(data);
      } catch (error) {
        throw new Error(`There was error while fetching users: ${error}`);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <div className='blog'>
      <h1 className='headline'>Blog</h1>
      <button onClick={handleShowForm} className='add-new'>
        {showForm ? 'Hide form' : 'Add new post'}
      </button>
      {isAddingNewPost && <p>New post is being added...</p>}

      {showForm && <AddPostForm users={users} onAddPost={handleAddNewPost} />}

      {isPostAdded && <p>New post successfully added!</p>}

      {isLoadingPosts && isLoadingUsers ? (
        <p>Loading posts...</p>
      ) : (
        <ul className='posts'>
          {posts.map((post) => {
            const user = users?.find((user) => user.id === post.userId);
            return <PostItem post={post} key={post.id} user={user} openPostId={openPostId} onPostOpen={handlePostOpen} />;
          })}
        </ul>
      )}
    </div>
  );
};

export default PostList;
