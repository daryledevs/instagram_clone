import React, { useState, useEffect } from 'react';
import api from '../config/api';
import GridPost from '../components/GridPost';
import { useAppSelector } from '../redux/hooks/hooks';

function Explore() {
  const user = useAppSelector((state) => state.user);
  const [feedApi, setFeedApi] = useState<any>({ feed: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [hover, setHover] = useState<any>({ post_id: null });

  useEffect(() => {
    const exploreApi = async () => {
      try {
        const response = await api.get(`/feeds/explore/${user.user_id}`);
        const apiData = response.data;
        setFeedApi({ feed: apiData.feed });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    exploreApi();
  }, []);  

  if(loading) return <></>;

  return (
    <div className="explore__container">
      <div className="explore__parent">
        {feedApi.feed &&
          feedApi.feed.length &&
          GridPost({
            posts: {
              post: feedApi.feed,
            },
            hover,
            setHover
          })}
      </div>
    </div>
  );
}

export default Explore
