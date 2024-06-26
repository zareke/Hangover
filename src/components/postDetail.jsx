import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './postdetail.module.css';

const PostDetail = () => {
  const { postId } = useParams(); // Ensure postId is correctly extracted from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3508/post/${postId}`, {
          params: {
            limitComments: 5,
            offsetComments: 0,
          },
        });

        const [postInfo, commentsInfo] = response.data; // Adjust based on your API response structure
        setPost(postInfo[0]); // Assuming the post info is the first element in the array
        setComments(commentsInfo.collection); // Assuming comments are in the `collection` array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]); // Ensure postId is included in the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.description}>{post.description}</p>
      <img src={post.front_image} alt="Front Image" className={styles.image} />
      <img src={post.back_image} alt="Back Image" className={styles.image} />
      <div className={styles.creator}>
        <img src={post.creatoruser.profile_photo} alt="Profile" />
        <div className={styles.creatorInfo}>
          <h3>{post.creatoruser.username}</h3>
          <p>Follower Count: {post.creatoruser.follower_number}</p>
        </div>
      </div>
      <h3>Comments</h3>
      <ul className={styles.comments}>
        {comments.map((commentData) => {
          const comment = commentData.comment;
          return (
            <li key={comment.comment_id} className={styles.commentItem}>
              <p>{comment.content}</p>
              <p className={styles.commentAuthor}>Comment by: {comment.username}</p>
            </li>
          );
        })}
      </ul>
      {/* Pagination info for comments */}
      <div className={styles.pagination}>
        <p>Total Comments: {comments.length}</p>
        {/* Assuming commentsInfo.pagination is not needed to display */}
      </div>
    </div>
  );
};

export default PostDetail;
