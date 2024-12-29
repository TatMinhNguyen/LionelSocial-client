import React, { useEffect } from 'react';

import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của Toastify

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import VerifyCode from './pages/register/verifyCode/VerifyCode';
import ForgotVerificationCode from './pages/register/verifyCode/ForgotVerificationCode';
import ForgotPassword from './pages/login/forgotPassword/ForgotPassword';
import Home from './pages/home/Home';
import GetAPost from './pages/home/getAPost/GetAPost';
import Profile from './pages/profile/Profile';
import UserPosts from './pages/profile/userPosts/UserPosts';
import Friends from './pages/friends/Friends';
import Messenger from './pages/messenger/Messenger';
import Search from './pages/search/Search';
import SearchPosts from './components/search/SearchPosts';
import SearchUsers from './components/search/SearchUsers';
import { useSelector } from 'react-redux';
import socket from './socket';
import MyFriends from './pages/myFriends/MyFriends';
import GetFriends from './components/myFriends/GetFriends';
import GetRequests from './components/myFriends/GetRequests';
import GetSuggestions from './components/myFriends/GetSuggestions';
import GetMessages from './components/messenger/GetMessages';
import GetNoConversation from './components/messenger/GetNoConversation';
import Group from './pages/group/Group';
import GetMyGroups from './components/group/GetMyGroups';
import GetSuggestGroups from './components/group/GetSuggestGroups';
import GetPostsGroup from './components/group/GetPostsGroup';
import GetViewGroup from './components/group/GetViewGroup';
import GetMembers from './components/group/GetMembers';
import ViewGroup from './components/group/ViewGroup';
import GetMembersRequest from './components/group/GetMembersRequest';
import GetPendingPosts from './components/group/GetPendingPosts';
import GetReportPosts from './components/group/GetReportPosts';
import Admin from './pages/admin/Admin';
import GetPostReported from './components/admin/GetPostReported';
import GetBannedUser from './components/admin/GetBannedUser';
import Room from './pages/call/Room';
import GetPosts from './pages/home/getPosts/GetAllPosts';
import GetFriendPosts from './pages/home/getPosts/GetFriendPosts';
import GetGroupReported from './components/admin/GetGroupReported';

function App() {
  const user = useSelector((state) => state.auth.login?.currentUser)

  useEffect(() => {
    if (user?.userId) {  // userId từ DB
      socket.emit('register', user.userId); 
      socket.emit('online')
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} >
          <Route path='' element={<GetPosts />} />
          <Route path="friends's-posts" element={<GetFriendPosts />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/set-verify-code" element={<VerifyCode />} />
        <Route path="/get-verify-code" element={<ForgotVerificationCode />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/get-post/:postId" element={<GetAPost />} />
        <Route path='/get-profile/:userId' element={<Profile/>}>
          <Route path='' element={<UserPosts />} />
          <Route path='friends' element={<Friends />} />
        </Route>
        <Route path='/messenger' element = {<Messenger/>}>
          <Route path='' element={<GetNoConversation />} />
          <Route path=':chatId' element={<GetMessages />} />
        </Route>
        <Route path='/room/:roomId' element={<Room/>}/>
        <Route path="/search" element={<Search />} >
          <Route path='posts' element={<SearchPosts/>}/>
          <Route path='users' element={<SearchUsers/>}/>
        </Route>
        <Route path='/friends' element = {<MyFriends/>}>
          <Route path='' element={<GetFriends />} />
          <Route path='requests' element={<GetRequests />} />
          <Route path='suggestions' element={<GetSuggestions />} />
        </Route>
        <Route path='/groups' element={<Group/>}>
          <Route path='' element={<GetMyGroups/>}/>
          <Route path='discover' element={<GetSuggestGroups/>}/>
        </Route>    
        <Route path='/groups/:groupId' element={<GetViewGroup/>}>
          <Route path='' element={<ViewGroup/>}>
            <Route path='' element={<GetPostsGroup/>}/>
            <Route path='members' element={<GetMembers/>}/>
          </Route>
          <Route path='member-requests' element={<GetMembersRequest/>}/>
          <Route path='pending-posts' element={<GetPendingPosts/>}/>
          <Route path='reported-posts' element={<GetReportPosts/>}/>
        </Route>  
        <Route path='/admin' element={<Admin/>}>
            <Route path='reported-posts' element={<GetPostReported/>}/>
            <Route path='reported-users' element={<GetBannedUser/>}/>
            <Route path='reported-groups' element={<GetGroupReported/>}/>
        </Route> 
      </Routes>
      {/* Toast Container */}
      <ToastContainer
        position="top-right" // Vị trí của thông báo
        autoClose={3000} // Thời gian tự đóng (ms)
        hideProgressBar={true} // Hiển thị thanh tiến trình
        newestOnTop={false} // Thông báo mới có ở trên không
        closeOnClick // Đóng khi click
        pauseOnHover // Dừng khi hover chuột
        draggable // Có thể kéo thông báo
      />
    </Router>
  );
}

export default App;
