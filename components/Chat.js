import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

import { Avatar } from '@material-ui/core';

function Chat({ id, recipientEmail, enterChat }) {
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', recipientEmail)
    );
    const recipient = recipientSnapshot?.docs?.[0].data();

    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ) : (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            <p>{recipientEmail}</p>
        </Container>
    );
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    cursor: pointer;
    :hover {
        background-color: whitesmoke;
    }
`;

const UserAvatar = styled(Avatar)`
    text-transform: uppercase;
`;
