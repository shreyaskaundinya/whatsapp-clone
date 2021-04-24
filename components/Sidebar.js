import styled from 'styled-components';

import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';

import * as EmailValidator from 'email-validator';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

import { Avatar, IconButton, Button } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import { useRouter } from 'next/router';
import Chat from './Chat';

import getRecipientEmail from '../utils/getRecipientEmail';

function Sidebar() {
    var [user] = useAuthState(auth);
    var [state, dispatch] = useStateValue();
    const router = useRouter();

    const userContactsRef = db
        .collection('chats')
        .where('users', 'array-contains', user.email);

    const usersRef = db.collection('users');

    var [contactsSnapshot] = useCollection(userContactsRef);
    var [usersSnapshot] = useCollection(usersRef);

    const chatExists = (recipientEmail) =>
        !!contactsSnapshot?.docs?.find((chat) =>
            chat.find((user) => user === recipientEmail)
        );

    const userExists = (recipientEmail) => {
        console.log(recipientEmail);
        const s = usersSnapshot?.docs
            ?.find((user) => user.data().email === recipientEmail)
            ?.data();
        if (s === undefined) {
            return false;
        } else {
            return true;
        }
    };

    const createChat = async () => {
        const input = prompt(
            'Please eneter an email address for the user you wish to chat with : '
        );
        if (!input) return null;

        if (EmailValidator.validate(input)) {
            // user cant chat with himself
            if (user.email === input) {
                return null;
            }

            // check if chat exists
            if (chatExists(input)) {
                return null;
            }

            // check if user exists
            if (!userExists(input)) {
                alert('User Does Not Exist');
                return null;
            }

            // add chat to db
            await db.collection('chats').add({ users: [user.email, input] });
            console.log(`Starting chat with ${input}...`);
        }
    };

    const enterChat = (id) => {
        // for mobile remove sidebar
        if (screen.width < 768) {
            dispatch({
                type: actionTypes.SET_DISPLAY_SIDEBAR,
                term: false,
            });
        } else {
            dispatch({
                type: actionTypes.SET_DISPLAY_SIDEBAR,
                term: true,
            });
        }
        router.push(`/chat/${id}`);
    };

    // console.log(contactsSnapshot?.docs);
    var chatComponents = contactsSnapshot?.docs.map((chat) => {
        return (
            <Chat
                key={chat.id}
                id={chat.id}
                recipientEmail={getRecipientEmail(
                    chat.data().users,
                    user.email
                )}
                enterChat={() => enterChat(chat.id)}
            />
        );
    });

    return (
        <Container show={state.term}>
            <Header>
                <UserAvatar
                    src={user.photoURL}
                    onClick={() => {
                        auth.signOut();
                    }}
                />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon />
                <SearchInput placeholder='Search In Chats' />
            </Search>

            <StartChatButton onClick={createChat}>
                Start a new chat
            </StartChatButton>
            <ChatsContainer>
                <h4>Chats</h4>
                {chatComponents}
            </ChatsContainer>
        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.5;
    border-right: 1px solid whitesmoke;
    min-height: 100vh;
    min-width: 250px;
    max-width: 400px;
    overflow-y: scroll;
    z-index: 1000;
    box-shadow: 0 0 2px 1px rgba(83, 86, 87, 0.1);
    display: ${(props) => (props.show ? '' : 'none')};

    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 100;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover::before {
        content: 'Logout';
        color: white;
        font-size: x-small;
        padding: 20px;
        position: relative;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        opacity: 0.8;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background-color: red;
    }
`;
const IconsContainer = styled.div``;

const ChatsContainer = styled.div`
    h4 {
        padding: 15px;
    }
`;

const Search = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 20px;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const SearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`;

const StartChatButton = styled(Button)`
    width: 100%;
`;
