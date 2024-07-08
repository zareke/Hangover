import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./postdetail.module.css";
import Button from "./Button";
import config from "../config";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState("");
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView();
  };

  const newComment = async () => {
    const content = newCommentContent;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${config.url}post/${postId}/comment`,
        {
          post_id: postId,
          content: content,
          parent_id: null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newComment = response.data;
      setComments((prevComments) => [
        ...prevComments,
        {
          comment: {
            comment_id: newComment.comment_id,
            username: "YourUsername", // You should replace this with the actual username
            content: newCommentContent,
            // Add other necessary comment properties here
          },
        },
      ]);
      setNewCommentContent(""); // Clear the textarea
    } catch (e) {
      console.error("Error en post comment", e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); //previene el salto de linea
      newComment();
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const request = `${config.url}post/${postId}`;
        const response = await axios.get(request, {
          params: {
            limitComments: 5,
            offsetComments: 0,
          },
        });
        const [postInfo, commentsInfo] = response.data;
        setPost(postInfo[0]);
        setComments(commentsInfo.collection);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageSection}>
          <div className={styles.thumbnails}>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvantageapparel.com%2FImages%2FProductImages%2FHigh%2F0270_Dark_Grey_front.png&f=1&nofb=1&ipt=c577db866b9922c1990e440ca550bff073c1e6a4852775e4173d6a57e0e98c34&ipo=images"
              alt="Thumbnail"
              className={styles.thumbnail}
            />
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvantageapparel.com%2FImages%2FProductImages%2FHigh%2F0270_Dark_Grey_front.png&f=1&nofb=1&ipt=c577db866b9922c1990e440ca550bff073c1e6a4852775e4173d6a57e0e98c34&ipo=images"
              alt="Thumbnail"
              className={styles.thumbnail}
            />
            <div className={styles.thumbnail}></div>
          </div>
          <div className={styles.mainImageContainer}>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvantageapparel.com%2FImages%2FProductImages%2FHigh%2F0270_Dark_Grey_front.png&f=1&nofb=1&ipt=c577db866b9922c1990e440ca550bff073c1e6a4852775e4173d6a57e0e98c34&ipo=images"
              alt="Front Image"
              className={styles.mainImage}
            />
            <Button className={styles.remixButton}>Remix</Button>
          </div>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.titleAndButtons}>
            <h2 className={styles.title}>{post.title}</h2>
            <div className={styles.actionButtons}>
              <Button>Guardar</Button>
              <Button>Añadir a la Bolsa</Button>
            </div>
          </div>
          <p className={styles.description}>{post.description}</p>
          <div className={styles.creator}>
            <img
              src="https://randomuser.me/api/portraits/men/8.jpg"
              alt="Profile"
              className={styles.creatorImage}
            />
            <div className={styles.creatorInfo}>
              <h3>{post.creatoruser.username}</h3>
              <p>{post.creatoruser.follower_number} seguidores</p>
            </div>
          </div>
          <div className={styles.commentsSection}>
            <h3 onClick={() => setCommentsVisible(!commentsVisible)}>
              Comentarios {commentsVisible ? "▲" : "▼"}
            </h3>
            {commentsVisible && (
              <>
                <div className={styles.scrollableComments}>
                  <ul className={styles.comments}>
                    {comments.map((commentData) => (
                      <li
                        key={commentData.comment.comment_id}
                        className={styles.commentItem}
                      >
                        <img
                          src="https://randomuser.me/api/portraits/men/8.jpg"
                          alt="Commenter"
                          className={styles.commenterImage}
                        />
                        <div>
                          <strong>{commentData.comment.username} 1sem.</strong>
                          <p>{commentData.comment.content}</p>
                        </div>
                        <button className={styles.replyButton}>Responder</button>
                      </li>
                    ))}
                  </ul>
                  <div ref={commentsEndRef}></div>
                </div>
                <div className={styles.commentTextArea}>
                  <p className={styles.commentCount}>3 comentarios</p>
                  <div className={styles.newComment}>
                    <img
                      src="https://randomuser.me/api/portraits/men/8.jpg"
                      alt="Profile"
                      className={styles.creatorImage}
                    />
                    <div className={styles.newCommentText}>
                      <textarea
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Comenta aqui..."
                      />
                      <img
                        onClick={newComment}
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic-00.iconduck.com%2Fassets.00%2Fsend-icon-2048x2020-jrvk5f1r.png&f=1&nofb=1&ipt=3c95031d77c15aa2faeb240e0df0b253cb279f3552087fad48513c0f1ffa0dde&ipo=images"
                        alt="Send"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;