const getRecipientEmail = (users, user) => {
    return users[0] === user ? users[1] : users[0];
};

export default getRecipientEmail;
