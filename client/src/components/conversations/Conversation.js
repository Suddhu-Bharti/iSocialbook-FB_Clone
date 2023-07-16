import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get("/users/" + friendId);
        // console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        src={
          user.profilePic
            ? PF + user.profilePic
            : "https://www.spotteron.net/images/icons/user60.png"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">{user.username}</span>
    </div>
  );
};

export default Conversation;
