import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalConvey, setArrivalConvey] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  const socket = useRef();
  
  const [receiverId, setReceiverId] = useState(
    currentChat?.members.find((m) => m !== user._id)
  );

  //connect to socket server
  useEffect(() => {
    socket.current = io("ws://localhost:9000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    socket.current.on("getNewConversation", (data) => {
      setArrivalConvey(data);
    });
  }, []);

  // console.log(socket);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.senderId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalConvey && setConversations((prev) => [...prev, arrivalConvey]);
  }, [arrivalConvey]);

  useEffect(() => {
    socket.current.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);

  // get online users
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getOnlineUsers", (users) => {
      // console.log(users);
      setOnlineUsers(users);
    });
  }, [user]);

  // console.log(onlineUsers);

  // Get conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user]);

  // Get messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
    setReceiverId(currentChat?.members.find((m) => m !== user._id));
  }, [currentChat]);

  // handling sending messages
  const handleSending = async (e) => {
    // console.log("sending...")
    e.preventDefault();
    const message = {
      senderId: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMenuInput"
              placeholder="Search for friends"
            />
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((msg) => (
                    <div key={msg._id} ref={scrollRef}>
                      <Message
                        currentUser={user}
                        receiverId={receiverId}
                        message={msg}
                        own={msg.senderId === user._id}
                      />
                    </div>
                  ))}
                </div>
                <form className="chatBoxBottom" onSubmit={handleSending}>
                  <textarea
                    className="chatMessageInput"
                    placeholder="Text message"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" type="submit">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="noConvTextContainer">
                <span className="noConvText">
                  Open a conversation to start a chat.
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              socket={socket}
              conversations={conversations}
              onlineUsers={onlineUsers}
              currentUserId={user._id}
              setCurrentChat={setCurrentChat}
              setConversations={setConversations}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
