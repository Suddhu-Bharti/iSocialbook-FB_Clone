import { useEffect, useState } from "react";
import "./chatOnline.css";
import axios from "axios";

const ChatOnline = ({
  onlineUsers,
  currentUserId,
  setCurrentChat,
  conversations,
  setConversations,
  socket
}) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // get current user friends
  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get("/users/friends/" + currentUserId);
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [currentUserId]);

  // set online friends
  useEffect(() => {
    setOnlineFriends(
      friends.filter((f) => onlineUsers.some((u) => u.userId === f._id))
    );
  }, [friends, onlineUsers]);

  const handleOnlineUserClick = async (of) => {
    try {
      if (conversations.some((c) => c.members.includes(of._id))) {
        const res = await axios.get(
          `/conversations/find/${currentUserId}/${of._id}`
        );
        setCurrentChat(res.data);
      } else {
        const res = await axios.post("/conversations", {
          senderId: currentUserId,
          receiverId: of._id,
        });

        socket.current.emit("sendNewConversation", {
          data: res.data,
          receiverId: of._id,
        });

        setConversations((prev)=> [...prev, res.data]);
        setCurrentChat(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      <h3 className="chatOnlineTitle">Online Friends</h3>
      {onlineFriends.map((of) => (
        <div
          key={of._id}
          className="chatOnlineFriend"
          onClick={() => handleOnlineUserClick(of)}
        >
          <div className="chatOnlineImgContainer">
            <img
              src={
                of.profilePic
                  ? PF + of.profilePic
                  : "https://www.spotteron.net/images/icons/user60.png"
              }
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineFriendName">{of.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
