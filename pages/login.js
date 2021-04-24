import styled from 'styled-components';
import Head from 'next/head';
import { Button } from '@material-ui/core';
import { auth, provider } from '../firebase';

function Login() {
    var signIn = async () => {
        console.log('Sign In');
        await auth
            .signInWithRedirect(provider)
            .then((data) => {
                console.log('Sign in success');
            })
            .catch(alert);
        console.log('Signin done!');
    };
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <h2>Welcome to WhatsApp (jk)</h2>
            <LoginContainer>
                <Logo src='https://seeklogo.com/images/W/whatsapp-logo-112413FAA7-seeklogo.com.png' />
                <Button variant='outlined' onClick={signIn}>
                    Sign-In with Google
                </Button>
            </LoginContainer>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    min-height: 100vh;
    background-color: whitesmoke;
`;
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 80px;
    background-color: white;
    border: 1px solid white;
    border-radius: 10px;
    box-shadow: 0 2px 8px 2px rgb(30, 30, 30, 0.3);
`;
const Logo = styled.img`
    width: 200px;
    height: 200px;
    margin-bottom: 50px;
`;
