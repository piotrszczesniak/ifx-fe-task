import { useState } from 'react';
import { ApiEndpoints } from '../types/ApiEndpoints';
import { GetPost, PostPost } from '../types/Post';
import { apiUrl } from '../utils/apiUrl';

type PostEndpointTypeMap = {
  [ApiEndpoints.posts]: PostPost;
};

export const usePostData = <T extends keyof PostEndpointTypeMap>(endpoint: T) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PostEndpointTypeMap[T][]>([]);

  const fetchData = async (newData: PostEndpointTypeMap[T]) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({
          title: newData.title,
          body: newData.body,
          userId: newData.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const newPostData: Pick<GetPost, 'id'> = await response.json();

      if (newPostData.id) {
        setData((prev) => [{ ...newData, ...newPostData }, ...prev]);
      } else {
        throw new Error(`There was errow while adding news post - try again.`);
      }
    } catch (error) {
      throw new Error(`There was error while adding new post: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, isLoading, data };
};
