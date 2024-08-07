import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./postdetail.module.css";
import Button from "./Button";
import config from "../config";
import Like from "../components/Like.jsx";
import { AuthContext } from "../AuthContext";
import { guardarHandler, eliminarGuardadoHandler } from "../universalhandlers.js";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState("");
  const commentsEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { isLoggedIn, openModalNavBar } = useContext(AuthContext);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView();
  };

  const checkLogin = () => {
    if (!isLoggedIn) {
      openModalNavBar();
    }
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
            username: "YourUsername",
            content: newCommentContent,
          },
        },
      ]);
      setNewCommentContent("");
    } catch (e) {
      console.error("Error en post comment", e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && e.target.value.trim() !== "") {
      e.preventDefault();
      newComment();
    }
  };
 
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const request = `${config.url}/post/${postId}`;
        const response = await axios.get(request, {
          params: {
            limitComments: 5,
            offsetComments: 0,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        const postInfo = response.data[0];
        const commentsInfo = response.data[1];
        setSaved(response.data[3]);
        setPost(postInfo[0]);
        setComments(commentsInfo.collection);
        setSelectedImage(
          postInfo[0].front_image //seria postinfo mepa fijense la req
        );
        setLoading(false);
        setIsChecked(response.data[2])
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

  if (loading) return <div>Instalando virus...</div>; //Loading...
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;
const changeLikeState = async () =>{
  if(isChecked){
dislikePost()
  }else{
    likePost()
  }
}
  const likePost = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${config.url}/post/${postId}/like`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 201) {
          console.log("Post liked successfully!");
          setIsChecked(true);
        } else {
          console.error("Failed to like the post");
        }
      } catch (e) {
        console.error("Error liking post", e);
      }
    } else {
      openModalNavBar();
    }
  };
  const dislikePost = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${config.url}/post/${postId}/like`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          console.log("Post disliked successfully!");
          setIsChecked(false);
        } else {
          console.error("Failed to dislike the post");
        }
      } catch (e) {
        console.error("Error disliking post", e);
        if (e.response && e.response.data && e.response.data.error) {
          console.error("Server error:", e.response.data.error);
        }
      }
    } else {
      openModalNavBar();
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageSection}>
          <div className={styles.thumbnails}>
            <img
              src={post.front_image}
              alt="Thumbnail"
              className={styles.thumbnail}
              onMouseOver={() => setSelectedImage(post.front_image)}
            />
            <img
              src={post.back_image}
              alt="Thumbnail"
              onMouseOver={() => setSelectedImage(post.back_image)}
              className={styles.thumbnail}
            />
            <div className={styles.thumbnail}></div>
          </div>
          <div className={styles.mainImageContainer}>
            <img
              src={selectedImage}
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
              {saved ? (
                <Button
                  onClick={() => eliminarGuardadoHandler(postId, setSaved)}
                >
                  Guardado
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    guardarHandler(
                      postId,
                      setSaved,
                      isLoggedIn,
                      openModalNavBar
                    )
                  }
                >
                  Guardar
                </Button>
              )}
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
                        <button className={styles.replyButton}>
                          Responder
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div ref={commentsEndRef}></div>
                </div>
                <div className={styles.commentTextArea}>
                  <div className={styles.detayes}>
                    <p className={styles.commentCount}>3 comentarios</p>
                    <div>
                     
                       <Like likePostFunc={changeLikeState} isAlredyChecked={isChecked} styles={styles.corason}></Like>
                    </div>
                  </div>
                  <div className={styles.newComment}>
                    <img
                      src="https://randomuser.me/api/portraits/men/8.jpg"
                      alt="Profile"
                      className={styles.creatorImage}
                    />
                    <div className={styles.newCommentText}>
                      <textarea
                        onClick={checkLogin}
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
