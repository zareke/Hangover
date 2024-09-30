import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ChatsView.css';
import config from '../config';
import Button from './Button';

const ChatView = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ownId, setOwnId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]); // Estado para manejar los amigos seleccionados
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [friendsError, setFriendsError] = useState(null);

    useEffect(() => {
        const fetchRecentChats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${config.url}chat/get/chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(response.data.chats);
                setLoading(false);
                setOwnId(response.data.ownId);
            } catch (err) {
                console.error('Error fetching recent chats:', err);
                setError('Error fetching recent chats');
                setLoading(false);
            }
        };

        fetchRecentChats();
    }, []);

    const openModal = async () => {
        setIsModalOpen(true);
        setFriendsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.url}user/friends`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response);
            setFriends(response.data);
            setFriendsLoading(false);
        } catch (err) {
            console.error('Error fetching friends:', err);
            setFriendsError('Error fetching friends');
            setFriendsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Función para seleccionar un amigo
    const selectFriend = (friend) => {
        if (!selectedFriends.includes(friend)) {
            setSelectedFriends([...selectedFriends, friend]);
        }
    };

    // Función para deseleccionar un amigo de la lista seleccionada
    const removeFriend = (friend) => {
        setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="chat-view">
            <h2>Recent Chats</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <Link to={`/privateChat/${ownId}/${chat.id}`}>
                            <div>
                                {chat.name !== null ? (
                                    <strong>{chat.name}</strong>
                                ) : (
                                    <strong>{chat.username}</strong>
                                )}
                                <span>Last message: {new Date(chat.last_message_time).toLocaleString()}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Botón para abrir el modal */}
            <Button onClick={openModal}>+</Button>

            {/* Modal que muestra la lista de amigos */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Select Friends</h2>

                        {/* Mostrar los amigos seleccionados */}
                        <div className="selected-friends">
                            {selectedFriends.map((friend) => (
                                <div key={friend.id} onClick={() => removeFriend(friend)} className="selected-friend">
                                    {friend.username}
                                </div>
                            ))}
                        </div>

                        {/* Cargar lista de amigos */}
                        {friendsLoading ? (
                            <div>Loading friends...</div>
                        ) : friendsError ? (
                            <div>{friendsError}</div>
                        ) : (
                            <ul>
                                {friends.map((friend) => (
                                    <li className='friend' key={friend.id} onClick={() => selectFriend(friend)}>
                                        {friend.username}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <Button onClick={closeModal}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatView;
