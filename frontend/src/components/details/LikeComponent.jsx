import "./LikeComponent.css";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

export default function LikeComponent({ toggleLike, liked, likeCount }) {
  return (
    <div className="like-container">
      <span className="like-count">{likeCount}</span>
      <div onClick={toggleLike} className={`like-icon ${liked ? "liked" : ""}`}>
        {liked ? <FaHeart style={{ color: "#2E3A59" }} /> : <FaRegHeart />}
      </div>
    </div>
  );
}
