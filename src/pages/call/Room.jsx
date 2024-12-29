import React, { useEffect, useRef, useState } from 'react';
import NavBar from '../../components/navbar/NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import socket from '../../socket';
import Peer from 'peerjs';
import { getAChat } from '../../api/chat/chat';

const Room = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const chat = useSelector((state) => state.chat.chat);
  const { roomId } = useParams();

  const peerInstance = useRef();
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  // console.log(stream)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGetAChat = async () => {
    await getAChat(user?.token, roomId, dispatch);
  };

  const handleGoBack = () => {
    // Gửi sự kiện rời khỏi phòng
    socket.emit('leave-room', { roomId, peerId: peerInstance.current?.id });

    // Gửi sự kiện thông báo kết thúc cuộc gọi
    // socket.emit('end-call', { roomId });

    // Dừng stream video/audio
    stopStream();

    // Hủy Peer.js instance
    peerInstance.current?.destroy();

    // Điều hướng về trang trước
    navigate(-1);
  };

  const stopStream = () => {
    if (stream) {
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null)
    }
  };

   /* eslint-disable */
  useEffect(() => {
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);

        peerInstance.current = new Peer();
        peerInstance.current.on('open', (id) => {
          console.log('My peer ID:', id);
          socket.emit('join-room', { roomId, peerId: id });
        });

        peerInstance.current.on('call', (call) => {
          call.answer(mediaStream);
          call.on('stream', (remoteStream) => {
            setRemoteStreams((prevStreams) => {
              const isExist = prevStreams.some(
                (remote) => remote.peerId === call.peer
              );
        
              if (!isExist) {
                return [...prevStreams, { peerId: call.peer, stream: remoteStream }];
              }
        
              return prevStreams;
            });
          });
        });

        socket.on('end-call', () => {
          console.log('Call ended by the other user.');
          
          // Dừng stream video/audio
          stopStream();
        
          // Hủy Peer.js instance
          peerInstance.current?.destroy();
        
          // Điều hướng về trang trước
          navigate(-1);
        });        

        socket.on('user-connected', (newPeerId) => {
          console.log('User connected:', newPeerId);
          const call = peerInstance.current.call(newPeerId, mediaStream);
          call?.on('stream', (remoteStream) => {
            setRemoteStreams((prevStreams) => {
              // Kiểm tra nếu peerId đã tồn tại
              const isExist = prevStreams.some(
                (remote) => remote.peerId === newPeerId
              );
        
              if (!isExist) {
                return [...prevStreams, { peerId: newPeerId, stream: remoteStream }];
              }
        
              return prevStreams; // Nếu đã tồn tại, không thêm nữa
            });
          });
        });

        // Xử lý khi user rời phòng
        socket.on('user-disconnected', (peerId) => {
          console.log('User disconnected:', peerId);
          setRemoteStreams((prevStreams) => {
            const updatedStreams = prevStreams.filter((remote) => remote.peerId !== peerId);
            // console.log(updatedStreams)
            // Kiểm tra số lượng người còn lại (chỉ còn 1 người là chính mình)
            if (updatedStreams?.length === 0) {
              console.log('Only one user left. Ending the call.');
              stopStream();
              socket.emit('end-call', { roomId });
              // socket.emit('leave-room', { roomId, peerId: peerInstance.current?.id });
              
              peerInstance.current?.destroy();
              // navigate(-1); // Điều hướng về màn hình trước
            }
        
            return updatedStreams;
          });
        });               

        return () => {
          stopStream();
          // socket.emit('leave-room', { roomId, peerId: peerInstance.current?.id });
          peerInstance.current?.destroy();
        };
      } catch (error) {
        console.error('Failed to access media devices:', error);
      }
    };

    startMedia();
  }, [roomId]);

   /* eslint-disable */
  useEffect(() => {
    handleGetAChat();
  }, []);

  return (
    <div className='bg-gray-100 h-screen overflow-y-scroll'>
      <div className='fixed top-0 w-[calc(100vw-15px)] z-50'>
        <NavBar user={user} />
      </div>

      <div className='pt-[9.5vh] relative'>
        <div className='h-[88.5vh] mt-0.5 mx-4 bg-black shadow-md rounded-md border relative'>
          <div
            className='absolute right-0 top-0 m-3 rounded-full cursor-pointer z-50'
            onClick={handleGoBack}
            style={{ pointerEvents: 'auto' }}
          >
            <img
              src={require('../../assets/icons/phone.png')}
              alt='Cancel'
              className='w-10 h-10 hover:opacity-95'
            />
          </div>
        
          {/* <div
            className="absolute bottom-0 left-1/2 p-1.5 bg-red-600 mb-6 -ml-4 rounded-full cursor-pointer hover:bg-red-700 z-50"
            onClick={handleGoBack}
            style={{ pointerEvents: 'auto' }}
          >
            <img
              src={require('../../assets/icons/end-call.png')}
              alt="Cancel"
              className="w-7 h-7"
            />
          </div> */}

          {remoteStreams?.length <= 0 && (
            <div className='flex flex-col items-center justify-center h-full'>
              <img
                src={chat?.avatar}
                alt='Avatar'
                className='w-24 h-24 object-cover rounded-full'
              />
              <h1 className='text-white font-medium text-xl mt-3'>
                {chat?.name}
              </h1>
              <p className='text-gray-400 text-xs mt-2 font-medium'>
                Waiting for other to join...
              </p>
            </div>            
          )}

          <div className='absolute top-0 left-0 flex items-center mt-2 z-50'>
            <div className='w-10 h-10 ml-3'>
              <img
                className='h-full w-full object-cover rounded-full'
                src={chat?.avatar}
                alt=''
              />
            </div>
            <div className='ml-3'>
              <h1 className='font-medium text-[16px] text-white'>{chat?.name}</h1>
              <p className='text-white text-[15px]'>
                {remoteStreams?.length + 1} {remoteStreams?.length + 1 === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>

          {stream && (
            <ReactPlayer
              url={stream}
              playing={true}
              muted={true}
              width='15%'
              height='25.65%'
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                pointerEvents: 'none',
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                zIndex: '10',
                transform: 'scaleX(-1)',
              }}
            />
          )}

          {remoteStreams?.length > 0 && (
            <div className={`absolute grid ${remoteStreams?.length === 1 ? 'grid-cols-1' : remoteStreams?.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2 w-full h-full`}>
              {remoteStreams?.map((remoteStream, index) => {
                if (remoteStream.stream instanceof MediaStream) {
                  return (
                    <ReactPlayer
                      key={index}
                      url={remoteStream.stream}
                      playing={true}
                      muted={false}
                      width="100%"
                      height="100%"
                      style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>            
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
