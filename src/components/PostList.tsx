import React, { use, useEffect, useState } from 'react';
import { GetPost, PostPost } from '../types/Post';
import PostItem from './PostItem';
import { User } from '../types/User';
import './PostList.scss';
import AddPostForm from './AddPostForm';
import { useGetData } from '../hooks/useGetData';
import { ApiEndpoints } from '../types/ApiEndpoints';
import { usePostData } from '../hooks/usePostData';

const PostList = () => {
  const [isPostAdded, setIsPostAdded] = useState(false);

  const [openPostId, setOpenPostId] = useState<null | GetPost['id']>(null);
  const [showForm, setShowForm] = useState(false);
  const [keyword, setKeyword] = useState<string | ''>('');
  const [authorId, setAuthorId] = useState<User['id'] | null>(null);

  const { data: posts, fetchData: getPosts, isLoading: isLoadingPosts } = useGetData(ApiEndpoints.posts);
  const { data: users, isLoading: isLoadingUsers } = useGetData(ApiEndpoints.users);

  const { fetchData: addPost, isLoading: isAddingNewPost } = usePostData(ApiEndpoints.posts);
  const [filteredPosts, setFilteredPosts] = useState<GetPost[]>(posts);

  const handlePostOpen = (id: GetPost['id']) => {
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

  const handleAddNewPost = async (newPostData: PostPost) => {
    try {
      await addPost(newPostData);
      setIsPostAdded(true);
      getPosts();
      setShowForm(false);
      setTimeout(() => {
        setIsPostAdded(false);
      }, 4000);
    } catch (error) {
      console.error('Failed to add new post:', error);
    }
  };

  useEffect(() => {
    let result = posts;

    if (keyword) {
      result = result.filter((post) => post.body.toLowerCase().includes(keyword?.toLowerCase()));
    }

    if (authorId !== null) {
      result = result.filter((post) => post.userId === authorId);
    }

    setFilteredPosts(result);
  }, [keyword, authorId, posts]);

  return (
    <div className='blog'>
      <h1 className='headline'>Blog</h1>
      <button onClick={handleShowForm} className='add-new'>
        {showForm ? 'Hide form' : 'Add new post'}
      </button>
      {isAddingNewPost && <p>New post is being added...</p>}

      {showForm && <AddPostForm users={users} onAddPost={handleAddNewPost} />}

      {isPostAdded && <p>New post successfully added!</p>}

      <div className='filters'>
        <h3 className='subheadline'>Filter by keyword (case insensitive):</h3>
        <div className='by-keyword'>
          <input
            value={keyword}
            onInput={(e) => setKeyword(e.currentTarget.value)}
            type='text'
            name=''
            placeholder='Search...'
            id='search'
          />
        </div>

        {users && (
          <>
            <h3 className='subheadline'>Filter by author:</h3>
            <div className='by-author'>
              {users.map((user) => {
                return (
                  <button key={user.id} className={`${authorId === user.id ? 'active' : ''}`} onClick={() => setAuthorId(user.id)}>
                    {user.username}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <>
          <h3 className='subheadline'>Clear filters:</h3>
          <button
            onClick={() => {
              setAuthorId(null);
              setKeyword('');
            }}
          >
            Show all
          </button>
        </>
      </div>

      {isLoadingPosts && isLoadingUsers ? (
        <p>Loading posts...</p>
      ) : (
        <ul className='posts'>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const user = users?.find((user) => user.id === post.userId);
              return <PostItem post={post} key={post.id} user={user} openPostId={openPostId} onPostOpen={handlePostOpen} />;
            })
          ) : (
            <p>No posts...</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default PostList;
