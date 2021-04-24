import styled from 'styled-components';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({ messages, chat }) {
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(chat.users, user.email);
    return (
        <Container>
            <Head>
                <title>Chat with {recipientEmail}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    );
}

export default Chat;

// SERVER SIDE RENDERING -> sends the props to the component
export async function getServerSideProps(context) {
    // get the chat reference
    const chatRef = db.collection('chats').doc(context.query.id);

    // PREP the messages on the server
    const messaggesRes = await chatRef
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

    const messages = messaggesRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((messages) => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime(),
        }));

    // PREP the chats
    const chatRes = await chatRef.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    };

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        },
    };
}

const Container = styled.div`
    display: flex;
`;
const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`;
