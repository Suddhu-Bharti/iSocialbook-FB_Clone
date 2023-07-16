// import { Users } from "../../dummyData";
import React, { useContext, useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./post.css";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Post = ({ post }) => {
  //console.log(post);
  //const user = Users.filter((u) => u.id === post.userId);
  //console.log(user); // give array of matching object

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [postUser, setPostUser] = useState({});

  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsLiked(post.likes.includes(user._id));
  }, [user._id, post.likes]);

  const handleLike = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: user._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/users/" + post.userId);
      // console.log(res.data);
      setPostUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.userId}`} className="link">
              <img
                className="postProfileImg"
                src={
                  postUser.profilePic
                    ? PF + postUser.profilePic
                    : "https://www.spotteron.net/images/icons/user60.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{postUser.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src="/assets/like.png"
              alt=""
              onClick={handleLike}
            />
            <img
              className="likeIcon"
              src="/assets/heart.png"
              alt=""
              onClick={handleLike}
            />
            <span className="postLikeCounter">
              {post.likes.includes(user._id) && "You and"} {like} people like
              it.
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
