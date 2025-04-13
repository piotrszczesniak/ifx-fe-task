import { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '../utils/apiUrl';
import { GetPost } from '../types/Post';
import { ApiEndpoints } from '../types/ApiEndpoints';
import { User } from '../types/User';

type GetEndpointTypeMap = {
  [ApiEndpoints.posts]: GetPost[];
  [ApiEndpoints.users]: User[];
};

export const useGetData = <T extends keyof GetEndpointTypeMap>(endpoint: T) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Error['message'] | number | null>(null);
  const [data, setData] = useState<GetEndpointTypeMap[T]>([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(null);
      const response = await fetch(`${apiUrl}/${endpoint}`);

      if (!response.ok) {
        setIsError(response.status);
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      setData(data);
    } catch (error) {
      setIsError((error as Error).message);
      throw new Error(`There was error while fetching data : ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { fetchData, data, isLoading, isError };
};
