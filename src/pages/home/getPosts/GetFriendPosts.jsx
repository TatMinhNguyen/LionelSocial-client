import React, { useEffect, useRef, useState } from 'react'
import GetAllPosts from '../../../components/post/GetAllPosts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getFriendsPosts } from '../../../api/post/post';

const GetFriendPosts = () => {
    const user = useSelector((state) => state.auth.login?.currentUser)
    const posts = useSelector((state) => state.post.friendsPosts)
    const profile = useSelector((state) => state?.auth?.profile)
    
    // eslint-disable-next-line
    const [params, setParams] = useState({
      page: 1,
      limit: 10,
    })
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleGetListPosts = async() => {
      try {
        await getFriendsPosts(user?.token, dispatch, params, navigate)
      } catch (error) {
        console.error('Errors:', error);
      }
    }
  
    const loadMoreRef = useRef(null);
  
    const handleScroll = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setParams((prevParams) => ({
          ...prevParams,
          limit: prevParams.limit + 10, // Tăng số lượng bài viết mỗi khi cuộn tới cuối trang
        }));
      }
    };
    
    useEffect(() => {
      if (!loadMoreRef.current) return;
    
      const observer = new IntersectionObserver((entries) => {
        handleScroll(entries); // Truyền entries vào handleScroll
      });
    
      observer.observe(loadMoreRef.current);
    
      return () => observer.disconnect(); // Ngắt kết nối observer khi component bị unmount
    }, []); // Không cần phụ thuộc vào `posts`  
    
  
    /* eslint-disable */
    useEffect(() => {
      if (!user) {
        navigate("/login");
      }
      if(user?.token) {
        handleGetListPosts();
      }
    }, [params, dispatch]);
  
  return (
    <div>
        <div className='mt-2'>
            <GetAllPosts
                posts = {posts}
                user = {user}
                params = {params}
                profile = {profile}
            />
        </div>
        <div ref={loadMoreRef} style={{ height: '20px' }} />        
    </div>
  )
}

export default GetFriendPosts