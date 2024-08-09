import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import styled from 'styled-components';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Messages = styled.div`
  max-height: 600px;
  overflow-y: auto;
  padding-right: 20px;
`;

const Message = styled.div`
  background-color: ${(props) => (props.isOwnMessage ? '#ccffcc' : 'grey')};
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 5px;
  min-width: 100px;
  max-width: 70%;
  display: inline-block;
  clear: both;
  position: relative;
  word-break: break-word;
  overflow: hidden;
  padding-right: 40px;
  float: ${(props) => (props.isOwnMessage ? 'right' : 'left')};
`;

const MessageContent = styled.span`
  text-align: left;
  display: block;
  position: relative;
  padding-right: 20px;
`;

const MessageTime = styled.span`
  color: #666;
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  right: 10px;
`;

const ChatForm = styled.form`
  display: flex;
  margin-top: 20px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const EmojiButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const EmojiPickerContainer = styled.div`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: absolute;
  bottom: 50px;
  right: 20px;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const socket = useRef(null);
  const messageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { ownId, userId } = useParams();
  const realOwnToken = localStorage.getItem("token");
  console.log(realOwnToken)
  const users = [+ownId, +userId];
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.current = io(config.url, {
      query: { token: realOwnToken }
    });
    socket.current.emit('set users', { users: users });

    socket.current.on('error', (error) => {
      console.error('Error del servidor:', error.message);
      setError(error.message); // Maneja el error en el cliente
      socket.current.disconnect(); // Opcional: desconecta el socket si es necesario
        // Redirigir a la página de inicio
        navigate('/'); // Ajusta la ruta según tu configuración
    });

    socket.current.on('chat message', (content, id, sender_user, date_sent, userConnected) => {
      const message = {
        content,
        id,
        sender_user,
        date_sent,
        userConnected,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollMessagesToBottom();
    });

    socket.current.on('user connected', (data) => {
      console.log('User connected:', data.userID);
    });

    return () => {
      socket.current.disconnect();
    };
    
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      socket.current.emit('chat message', { mensaje: input });
      setInput('');
    }
  };

  const scrollMessagesToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const addEmoji = (emoji) => {
    setInput(input + emoji.native);
    setEmojiPickerVisible(false);
    messageInputRef.current.focus();
  };

  return (
    <Container>
      <Messages id="messages">
        {console.log(messages)}
        {messages.map((msg, index) => (
          <Message
            key={index}
            isOwnMessage={msg.sender_user === msg.userConnected}
            data-date={msg.date_sent}
          >
            <MessageContent>{msg.content}</MessageContent>
            <MessageTime>{new Date(msg.date_sent).toLocaleTimeString()}</MessageTime>
          </Message>
        ))}
        <div ref={messagesEndRef}></div>
      </Messages>

      <ChatForm id="chatForm" onSubmit={sendMessage}>
        <MessageInput
          type="text"
          id="messageInput"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          ref={messageInputRef}
        />
        <EmojiButton type="button" id="emojiButton" onClick={toggleEmojiPicker}>
          😀
        </EmojiButton>
        <SubmitButton type="submit">Enviar</SubmitButton>
      </ChatForm>

      <EmojiPickerContainer visible={emojiPickerVisible}>
          <Picker 
                   data={data}
                   onEmojiSelect={addEmoji}
                   style={{
                    position:"absolute",
                    marginTop: "465px",
                    marginLeft: -40,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                  />
            
      </EmojiPickerContainer>
    </Container>
  );
};

export default Chat;
