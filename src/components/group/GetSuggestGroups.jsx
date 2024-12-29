import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { cancelJoinGroup, getSuggestGroup, joinGroup } from '../../api/group/group';
import { useSelector } from 'react-redux';

const GetSuggestGroups = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [groupStatus, setGroupStatus] = useState({}); // Trạng thái riêng cho từng nhóm

  const handleRequest = async (groupId) => {
    try {
      const res = await joinGroup(user?.token, groupId, navigate);

      if(res?.group?.type === false) {
        setGroupStatus(prevStatus => ({
          ...prevStatus,
          [groupId]: 'cancel'
        }));        
      }else {
        setGroupStatus(prevStatus => ({
          ...prevStatus,
          [groupId]: 'view'
        }));         
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelRequest = async (groupId) => {
    try {
      await cancelJoinGroup(user?.token, groupId, navigate);

      setGroupStatus(prevStatus => ({
        ...prevStatus,
        [groupId]: 'join'
      })); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSuggest = async () => {
    try {
      const res = await getSuggestGroup(user?.token, navigate);
      setSuggestions(res);

      // Cập nhật trạng thái cho từng nhóm
      const newStatus = {};
      res.forEach((group) => {
        if (group.members?.includes(user?.userId)) {
          newStatus[group._id] = 'view';
        } else if (group.pendingMembers?.includes(user?.userId)) {
          newStatus[group._id] = 'cancel';
        } else {
          newStatus[group._id] = 'join';
        }
      });
      setGroupStatus(newStatus);
    } catch (error) {
      console.log(error);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.token) {
      handleGetSuggest();
    }
  }, []);

  return (
    <div className='py-2 px-10 pt-16'>
      <h1 className='text-[18px] font-medium mb-2'>
        Suggestions
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {suggestions?.map((group) => (
          <div key={group._id} className="border bg-white rounded-lg pb-2 flex flex-col justify-between h-full">
            <img src={group.avatar} alt=''
              className="w-full h-[30vh] cursor-pointer object-cover rounded-t-md hover:opacity-90"
            />
            <div className='mt-2 px-3'>
              <h2 className="text-[17px] font-medium cursor-pointer hover:text-gray-700">
                {group.name}
              </h2>
              <p className="text-sm text-gray-500">{group.members?.length} members</p>
            </div>
            <div className="mt-4 px-3 flex flex-col space-y-1.5">
              {groupStatus[group._id] === 'view' ? (
                <button className="bg-blue-100 hover:bg-blue-200 text-customBlue font-medium py-2 px-4 rounded-lg"
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  View group
                </button>
              ) : groupStatus[group._id] === 'cancel' ? (
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg"
                  onClick={() => handleCancelRequest(group._id)}
                >
                  Cancel request
                </button>
              ) : (
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg"
                  onClick={() => handleRequest(group._id)}
                >
                  Join group
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetSuggestGroups;
