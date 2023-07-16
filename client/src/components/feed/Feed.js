// import { Posts } from "../../dummyData";
import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Feed = ({ userId, timeline }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = userId
        ? await axios.get(`/posts/all/${userId}`)
        : timeline ? await axios.get(`/posts/timeline/${user._id}`) : await axios.get("/posts/all/post") ;
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [userId, user, timeline]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!userId || userId === user._id) && <Share />}
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
