import React, { useState, useEffect, useRef, useContext, useLayoutEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./postdetail.module.css";
import Button from "./Button";
import config from "../config";
import { Link } from "react-router-dom";
import Like from "../components/Like.jsx";
import { AuthContext } from "../AuthContext";
import { guardarHandler, eliminarGuardadoHandler } from "../universalhandlers.js";
import ShareButtons from "./botonCompartir.jsx";
import { Helmet } from "react-helmet";

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
  const [commentsAllowed, setCommentsAllowed] = useState(true);

   // Nuevos estados para talle y cantidad
   const [size, setSize] = useState(""); // Sin talle por defecto
   const [quantity, setQuantity] = useState(1); // Cantidad por defecto en 1
   const [errorMessage, setErrorMessage] = useState(""); // Para mensajes de error

  const { isLoggedIn, openModalNavBar } = useContext(AuthContext);


  // Función para agregar al carrito
    const agregarCarritoHandler = async () => {
    if (!size) {
      setErrorMessage("Debes seleccionar un talle antes de añadir al carrito.");
      return; // Detener la ejecución si no hay talle seleccionado
    }

    setErrorMessage(""); // Limpiar mensaje de error si todo está bien

    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${config.url}purchase/save`,
          {
            idPost: postId,
            total_price: post.price,
            quantity: quantity,
            size: size
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 201) {
          console.log("Add to shopping_cart successfully!");
        } else {
          console.error("Failed to add to shopping cart");
        }
      } catch (e) {
        console.error("Error adding to shopping_cart", e);
      }
    } else {
      openModalNavBar();
    }
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView();
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const checkLogin = () => {
    if (!isLoggedIn) {
      openModalNavBar();
    }
  };

  function getRelativeTime(timestamp) {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    const timeUnits = [
        { unit: 'año', seconds: 60 * 60 * 24 * 365 },
        { unit: 'mes', seconds: 60 * 60 * 24 * 30 },
        { unit: 'semana', seconds: 60 * 60 * 24 * 7 },
        { unit: 'día', seconds: 60 * 60 * 24 },
        { unit: 'hora', seconds: 60 * 60 },
        { unit: 'minuto', seconds: 60 },
    ];

    for (let { unit, seconds } of timeUnits) {
        const amount = Math.floor(diffInSeconds / seconds);
        if (amount >= 1) {
            return `${amount} ${unit}${amount > 1 ? 's' : ''}`;
        }
    }

    return 'justo ahora';
  }

  const newComment = async () => {
    if (!commentsAllowed) {
      console.log("Los comentarios están desactivados para este post.");
      return;
    }

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
            profile_photo: "URL_TO_YOUR_PROFILE_PHOTO",
            date: new Date().toISOString(),
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
        const request = `${config.url}post/${postId}`;
        const response = await axios.get(request, {
          params: {
            limitComments: 5,
            offsetComments: 0,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("userdata", response);
        const { post, comments, liked, saved, canComment } = response.data;
        setSaved(saved);
        setPost(post[0]);
        setComments(canComment ? comments.collection : []);
        setSelectedImage(post[0].front_image);
        setLoading(false);
        setIsChecked(liked);
        setCommentsAllowed(post[0].allow_comments);
        setCommentsVisible(canComment && post[0].allow_comments);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useLayoutEffect(() => {
    if (!loading && !error) {
      scrollToTop();
    }
  }, [loading, error]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  if (loading) return <div>Instalando virus...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

  const changeLikeState = async () => {
    if (isChecked) {
      dislikePost();
    } else {
      likePost();
    }
  };

  const likePost = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${config.url}post/${postId}/like`,
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
          `${config.url}post/${postId}/like`,
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

  // URL para compartir
  const designUrl = `${window.location.origin}/post/${postId}`;
  const previewImageUrl = post.front_image;
  const previewTitle = post.title;
  const previewDescription = post.description;
  
  return (
    <>
     <Helmet>
        <title>{post?.title}</title>
        <meta name="description" content={post?.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={post?.description} />
        <meta property="og:image" content={post?.front_image} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={post?.title} />
        <meta property="twitter:description" content={post?.description} />
        <meta property="twitter:image" content={post?.front_image} />

        <meta property="og:site_name" content="Hangover" /> FZ mira el mensaje que te mande hola fz holaaaafz 
        <meta property="og:locale" content="es_ES" />
      </Helmet>
      
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
            <ShareButtons 
                url={designUrl} 
                message={`¡Mira este diseño que encontré: ${previewTitle}!`} 
                image={previewImageUrl}
                title={previewTitle}
                description={previewDescription}
              />
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

              {/* Sección de talles y cantidad */}
              <div className={styles.sizeAndQuantity}>
                <label htmlFor="size">Talle:</label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={styles.talleSelect}
                >
                  <option value="" disabled>Selecciona un talle</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>

                <label htmlFor="quantity">Cantidad:</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  className={styles.quantityInput}
                />
              </div>

              <Button onClick={agregarCarritoHandler}>
                Añadir a la Bolsa
              </Button>
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} {/* Mostrar mensaje de error */}
            </div>
          </div>
          <p className={styles.description}>{post.description}</p>
          <Link to={"/user/" + post.creatoruser.id}>
            <div className={styles.creator}>
              <img
                src={post.creatoruser.profile_photo}
                alt="Profile"
                className={styles.creatorImage}
              />
              <div className={styles.creatorInfo}>
                <h3>{post.creatoruser.username}</h3>
                <p>{post.creatoruser.follower_number} seguidores</p>
              </div>
            </div>
          </Link>
          <div className={styles.commentsSection}>
            <h3 onClick={() => setCommentsVisible(!commentsVisible)}>
              Comentarios {commentsVisible ? "▲" : "▼"}
            </h3>
            {commentsAllowed ? (
              commentsVisible ? (
                <>
                  <div className={styles.scrollableComments}>
                    <ul className={styles.comments}>
                      {comments.map((commentData) => (
                        <li
                          key={commentData.comment.comment_id}
                          className={styles.commentItem}
                        >
                          <img
                            src={commentData.comment.profile_photo}
                            alt="Commenter"
                            className={styles.commenterImage}
                          />
                          <div>
                            <strong>{commentData.comment.username} {getRelativeTime(commentData.comment.date)}</strong>
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
                      <p className={styles.commentCount}>{comments.length} comentarios</p>
                      <div>
                        <Like
                          likePostFunc={changeLikeState}
                          isAlredyChecked={isChecked}
                          styles={styles.corason}
                        />
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
              ) : (
                <p>Haz clic en "Comentarios ▼" para ver los comentarios.</p>
              )
            ) : (
              
              
                    <>
                    <p>Los comentarios para este post están desactivados :(</p>
                    <div className={styles.commentTextArea}>
                    <div className={styles.detayes}>
                      <div>
                        <Like
                          likePostFunc={changeLikeState}
                          isAlredyChecked={isChecked}
                          styles={styles.corason}
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
    </>
  );
};

export default PostDetail;