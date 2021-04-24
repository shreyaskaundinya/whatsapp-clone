import styled from 'styled-components';

import { useState, useRef, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';

import { useRouter } from 'next/router';
import { db, auth } from '../firebase';

import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import TimeAgo from 'timeago-react';

import Message from '../components/Message';

import getRecipientEmail from '../utils/getRecipientEmail';

import firebase from 'firebase';

function ChatScreen({ chat, messages }) {
    // context api global state
    var [state, dispatch] = useStateValue();

    // holds the message input data
    const [currentMessage, setCurrentMessage] = useState('');

    // holds the info of current user
    const [user] = useAuthState(auth);

    // router init, data
    const router = useRouter();

    //  reference to EndOf Messages
    const endOfMessagesRef = useRef(null);

    const recipientEmail = getRecipientEmail(chat.users, user.email);

    // snapshot of recipient data
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', recipientEmail)
    );

    // recipient data
    const recipient = recipientSnapshot?.docs?.[0].data();

    // snapshot of messages data
    var [messagesSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );

    // route to home
    const goToHome = () => {
        router.push('/');
        dispatch({
            type: actionTypes.SET_DISPLAY_SIDEBAR,
            term: true,
        });
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesSnapshot]);

    // messages components
    const messagesComponents = () => {
        // if there are new messages in realtime
        if (messagesSnapshot) {
            return messagesSnapshot?.docs?.map((message) => {
                return (
                    <Message
                        key={message.id}
                        user={message.data().user}
                        message={{
                            ...message.data(),
                            timestamp: message
                                .data()
                                .timestamp?.toDate()
                                .getTime(),
                        }}
                    />
                );
            });
        } else {
            // messages sent before
            return JSON.parse(messages).map((message) => {
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />;
            });
        }
    };

    // function to send message
    const sendMessage = (e) => {
        e.preventDefault();

        // trying to send empty message
        if (currentMessage === '') {
            return null;
        }
        console.log(user.email, recipient.email, currentMessage);

        // update users last seen
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        // add message to db

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: currentMessage,
            user: user.email,
            photoURL: user.photoURL,
        });

        setCurrentMessage('');
    };

    return (
        <Container>
            <Header>
                <IconButton onClick={goToHome}>
                    <ArrowBackIcon />
                </IconButton>
                {recipient ? (
                    <UserAvatar src={recipient?.photoURL} />
                ) : (
                    <UserAvatar>{recipient?.email[0]}</UserAvatar>
                )}
                <HeaderInformation>
                    <h4>{recipientEmail}</h4>
                    {recipient ? (
                        <p>
                            Last Seen :{' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo
                                    datetime={recipient?.lastSeen
                                        .toDate()
                                        ?.getTime()}
                                />
                            ) : (
                                Unavailable
                            )}
                        </p>
                    ) : (
                        <p>Loading last seen...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessagesContainer>{messagesComponents()}</MessagesContainer>
            <MessageForm>
                <InsertEmoticonIcon />
                <MessageInput
                    placeholder='Write a message...'
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <MicIcon />
                <SendButton type='submit' onClick={sendMessage}>
                    <SendIcon />
                </SendButton>
            </MessageForm>
            <EndOfMessage ref={endOfMessagesRef} />
        </Container>
    );
}

export default ChatScreen;

const Container = styled.div`
    background-color: whitesmoke;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;
const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    background-color: white;
    z-index: 10;
    top: 0;
    padding: 15px;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    flex: 1;
    > h3 {
        margin-bottom: 2px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;
const HeaderIcons = styled.div``;

const UserAvatar = styled(Avatar)`
    text-transform: uppercase;
`;

const MessagesContainer = styled.div`
    /* flex: 1; */
    padding: 30px 30px 30px 30px;
    margin-bottom: 60px;

    overflow-y: scroll;
    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
    @media (max-width: 768px) {
        padding: 70px 30px;
        margin: unset;
    }
`;

const MessageForm = styled.form`
    display: flex;
    align-items: center;
    z-index: 10;
    width: 100%;
    box-shadow: 0 0 2px 1px rgba(83, 86, 87, 0.1);
    height: 60px;
    background-color: white;
    padding: 15px;
    position: fixed;
    bottom: 0;
`;
const MessageInput = styled.input`
    border: none;
    outline: none;
    position: sticky;
    bottom: 0;
    flex: 1;
    padding: 10px;
`;

const SendButton = styled(IconButton)`
    background-color: white;
`;

const EndOfMessage = styled.div``;
