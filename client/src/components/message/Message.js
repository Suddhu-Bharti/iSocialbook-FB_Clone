import { useEffect, useState } from "react";
import "./message.css";
import { format } from "timeago.js";
import axios from "axios";

const Message = ({ message, own, currentUser, receiverId }) => {
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("/users/" + receiverId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [receiverId]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={own ? PF + currentUser.profilePic : PF + user.profilePic}
          alt="profilePic"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
