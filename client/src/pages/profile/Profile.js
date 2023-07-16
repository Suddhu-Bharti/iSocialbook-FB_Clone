// import { useParams } from "react-router"; // used to get userId from url

import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { AuthContext } from "../../context/AuthContext";
import { ChangePic } from "../../context/AuthActions";

const Profile = () => {
  // const params = useParams(); //give {}
  // console.log(params);

  const userId = useLocation().pathname.split("/")[2];
  const [user, setUser] = useState({});
  const [img, setImg] = useState(null);
  const [type, setType] = useState("");

  const { user: currentUser, dispatch } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/users/" + userId);
      // console.log(res.data);
      setUser(res.data);
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const handleChangeImg = async () => {
      if (type === "profile") {
        if (img) {
          const data = new FormData();
          const fileName = Date.now() + img.name;
          data.append("name", fileName);
          data.append("file", img);

          try {
            await axios.post("/upload", data);
            await axios.put("/users/" + user._id, {
              userId: currentUser._id,
              profilePic: fileName,
            });
            dispatch(ChangePic(fileName));
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        if (img) {
          const data = new FormData();
          const fileName = Date.now() + img.name;
          data.append("name", fileName);
          data.append("file", img);

          try {
            await axios.post("/upload", data);
            await axios.put("/users/" + user._id, {
              userId: currentUser._id,
              coverPic: fileName,
            });
            window.location.reload();
          } catch (err) {
            console.log(err);
          }
        }
      }
    };
    handleChangeImg();
  }, [img]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <div className="profileCoverImgContainer">
                <img
                  src={
                    user.coverPic
                      ? PF + user.coverPic
                      : "https://i.pinimg.com/originals/30/5c/5a/305c5a457807ba421ed67495c93198d3.jpg"
                  }
                  alt=""
                  className="profileCoverImg"
                />
                {currentUser._id === user._id && (
                  <div className="profileCoverImgEdit">
                    <label htmlFor="coverImg" className="coverEditIcon">
                      <AddPhotoAlternateOutlinedIcon fontSize="96px" />
                    </label>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      accept=".jpg, .png, .jpeg"
                      id="coverImg"
                      onChange={(e) => {
                        setImg(e.target.files[0]);
                        setType("cover");
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="profileUserImgContainer">
                <div className="profileUserImgWrapper">
                  <img
                    src={
                      user.profilePic
                        ? PF + user.profilePic
                        : "https://www.spotteron.net/images/icons/user60.png"
                    }
                    alt=""
                    className="profileUserImg"
                  />
                  {currentUser._id === user._id && (
                    <div className="profileUserImgEdit">
                      <label htmlFor="profileImg" className="profileEditIcon">
                        <AddPhotoAlternateOutlinedIcon fontSize="96px" />
                      </label>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        accept=".jpg, .png, .jpeg"
                        id="profileImg"
                        onChange={(e) => {
                          setImg(e.target.files[0]);
                          setType("profile");
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={user._id} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
