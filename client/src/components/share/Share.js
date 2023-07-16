import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Share = () => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [file, setFile] = useState(null);
  const desc = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    
    if(file){
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try{
        await axios.post("/upload", data);
      }catch(err){
        console.log(err)
      }
    }

    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfilePic"
            src={
              user.profilePic ? PF+user.profilePic :
              "https://www.spotteron.net/images/icons/user60.png"
            }
            alt=""
          />
          <input
            type="text"
            placeholder={`What's in your mind ${user.username} ?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="preview" className="shareImg" />
            <CancelIcon className="shareCancelImg" onClick={()=>setFile(null)}/>
          </div>
        )}
        <form className="shareBottom"  onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText" htmlFor="file">
                Photo or Video
              </span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <LabelOutlinedIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <RoomIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsOutlinedIcon
                htmlColor="goldenrod"
                className="shareIcon"
              />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
