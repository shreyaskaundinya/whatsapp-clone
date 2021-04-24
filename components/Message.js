import styled from 'styled-components';

import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../firebase';

import getRecipientEmail from '../utils/getRecipientEmail';

import moment from 'moment';

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage =
        user === userLoggedIn.email ? SenderMessage : RecieverMessage;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>
                    {message.timestamp
                        ? moment(message.timestamp).format('LT')
                        : '...'}
                </Timestamp>
            </TypeOfMessage>
        </Container>
    );
}

export default Message;

const Container = styled.div``;
const MessageElement = styled.div`
    width: fit-content;
    min-width: 60px;
    max-width: 45%;
    word-wrap: break-word;
    border-radius: 10px;
    padding: 8px 10px;
    position: relative;
    background-color: white;
    margin: 10px 0px;
    font-size: 0.9em;
    box-shadow: 0 0 2px 1px rgba(83, 86, 87, 0.1);
`;

const SenderMessage = styled(MessageElement)`
    margin-left: auto;
    background-color: #ebf6ff;
    text-align: right;
`;
const RecieverMessage = styled(MessageElement)`
    text-align: left;
`;

const Timestamp = styled.p`
    font-size: 0.7em;
    color: grey;
    text-align: right;
`;
