import React, { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const NewPost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const { designId } = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [allowComments, setAllowComments] = useState(false);
    const [isRemixable, setIsRemixable] = useState(false);
    const [visibility, setVisibility] = useState('Publico');

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${config.url}post/`,
                {
                    title: title,
                    description: description,
                    designId: designId,
                    allow_comments: allowComments,
                    remixable: isRemixable,
                    visibility: visibility
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 201) {
                console.log("Post created successfully!");
                // Optionally, you can redirect the user or clear the form
            } else {
                setErrorMessage("Failed to create post");
            }
        } catch (e) {
            console.error("Error creating post", e);
            setErrorMessage("Error creating post");
        }
    };

    return (
        <div>
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Titulo:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="content">Descripcoin:</label>
                    <textarea
                        id="content"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="allow_comments">Permitir comentarios</label>
                    <input
                        id="allow_comments"
                        type="checkbox"
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                    />
                    <label htmlFor="remixable">Remixable</label>
                    <input
                        id="remixable"
                        type="checkbox"
                        checked={isRemixable}
                        onChange={(e) => setIsRemixable(e.target.checked)}
                    />
                </div>
                <div>
                    <label htmlFor="public">Publico</label>
                    <input
                        id="public"
                        type="radio"
                        name="visibility"
                        value="Publico"
                        checked={visibility === 'Publico'}
                        onChange={() => setVisibility('Publico')}
                    />
                    <label htmlFor="unlisted">No listado</label>
                    <input
                        id="unlisted"
                        type="radio"
                        name="visibility"
                        value="No listado"
                        checked={visibility === 'No listado'}
                        onChange={() => setVisibility('No listado')}
                    />
                    <label htmlFor="private">Privado</label>
                    <input
                        id="private"
                        type="radio"
                        name="visibility"
                        value="Privado"
                        checked={visibility === 'Privado'}
                        onChange={() => setVisibility('Privado')}
                    />
                </div>
                {errorMessage && <p>{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default NewPost;