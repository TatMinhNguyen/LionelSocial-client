import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getGroupPosts } from '../../api/group/group'
import GetAllPosts from '../post/GetAllPosts'
import CreatePost from '../post/CreatePost'

const GetPostsGroup = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const posts = useSelector((state) => state.group.posts)
  const profile = useSelector((state) => state?.auth?.profile)

  const {groupId} = useParams();

  const [showModal, setShowModal] = useState(false)

  // eslint-disable-next-line
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetListPosts = async() => {
    try {
      await getGroupPosts(user?.token, groupId, dispatch, params, navigate)
    } catch (error) {
      console.error('Errors:', error);
    }
  }

  /* eslint-disable */
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if(user?.token) {
      handleGetListPosts();
    }
  }, [params, dispatch]);  

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

  return (
    <>
      <div className='h-16 bg-white border border-white shadow rounded-md flex-1 flex items-center'>
        <Link className='ml-4 h-10 w-10' to={`/get-profile/${user?.userId}`}>
          <img className='h-full w-full object-cover rounded-full hover:opacity-90'
            src={profile?.profilePicture}
            alt="User Avatar" 
          />              
        </Link>
        <div className='flex-1 flex items-center ml-2 mr-4 cursor-pointer'
              onClick={() => setShowModal(true)}
        >
          <input
            placeholder='What is happening ?'
            className='w-full px-4 py-2 rounded-3xl mt-0 bg-gray-100 cursor-pointer
                      focus:outline-none focus:border-gray-100 focus:ring-1 focus:ring-gray-100'
            readOnly
          />
          <img className='h-12 w-12 ml-2'
            src={require("../../assets/icons/photo.png")}
            alt=''
          />
        </div>
      </div>    
      {showModal && (
        <CreatePost
          params = {params}
          user = {user}
          profile = {profile}
          groupId = {groupId}
          isCloseModal = {() => setShowModal(false)}
        />
      )}
      <div className='mt-2'>
        <GetAllPosts
          posts = {posts}
          user = {user}
          params = {params}
          profile = {profile}
          groupId = {groupId}
        />
      </div>
      <div ref={loadMoreRef} style={{ height: '20px' }} />
    </>

  )
}

export default GetPostsGroup