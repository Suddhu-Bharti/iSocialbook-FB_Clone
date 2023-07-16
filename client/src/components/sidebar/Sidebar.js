import "./sidebar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { Users } from "../../dummyData";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../apiCalls";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // console.log("logout...")
    logout(dispatch);
    navigate("/login");
  };
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <ChatOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <GroupOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <Link to="/messenger" className="link">
            <li className="sidebarListItem">
              <SmsOutlinedIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Messenger</span>
            </li>
          </Link>
          <li className="sidebarListItem">
            <HelpOutlineOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutlineOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <EventOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <SchoolOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
          <li className="sidebarListItem" onClick={handleLogout}>
            <LogoutOutlinedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Logout</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {Users.map((user) => (
            <li className="sidebarFriend" key={user.id}>
              <img
                src={PF + user.profilePic}
                alt=""
                className="sidebarFriendImg"
              />
              <span className="sidebarFriendName">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
