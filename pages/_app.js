import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import firebase from 'firebase';

import { StateProvider } from '../StateProvider';
import reducer, { initialState } from '../reducer';

function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            db.collection('users').doc(user.uid).set(
                {
                    email: user.email,
                    // use server timestamp
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                    photoURL: user.photoURL,
                },
                // updates info
                { merge: true }
            );
        }
    }, [user]);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Login />;
    }
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <Component {...pageProps} />
        </StateProvider>
    );
}

export default MyApp;
