import {
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NoImageUser from '~/assets/no-image-user.jpg';
import { auth, db } from '~/Firebase';
import { loginFailed, loginStart, loginSuccess, logOutUser } from '~/redux/userSlice';

export const AuthContext = createContext();

export default function AuthUser({ children }) {
    const dispatch = useDispatch();
    const [valuesUser, setValuesUser] = useState(null);

    const ggProvider = new GoogleAuthProvider();
    const fbProvider = new FacebookAuthProvider();

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        return signInWithPopup(auth, ggProvider);
    };

    const facebookSignIn = () => {
        return signInWithPopup(auth, fbProvider);
    };

    const logOut = () => {
        dispatch(logOutUser());
        return signOut(auth);
    };

    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    dispatch(loginStart());
                    if (currentUser?.displayName === null) {
                        await updateProfile(currentUser, { displayName: valuesUser.name });
                    }
                    if (currentUser?.email) {
                        const docSnap = await getDoc(doc(db, 'users', currentUser?.email));
                        if (!docSnap.exists()) {
                            try {
                                await setDoc(doc(db, 'users', currentUser?.email), {
                                    savedUser: {
                                        id: currentUser.uid || '',
                                        name: currentUser.displayName || '',
                                        email: currentUser.email || '',
                                        photoUrl: currentUser.photoURL || NoImageUser,
                                        lastSignInTime: currentUser.metadata.lastSignInTime || '',
                                    },
                                    savedShows: [],
                                });
                            } catch (error) {
                                console.log(error.message);
                            }
                        }
                        onSnapshot(doc(db, 'users', currentUser?.email), (doc) => {
                            dispatch(loginSuccess({ ...doc.data()?.savedUser }));
                        });
                    }
                }
            } catch (error) {
                dispatch(loginFailed(error.message));
            }
        });

        return () => {
            unsubcribe();
        };
    }, [dispatch, valuesUser]);

    return (
        <AuthContext.Provider value={{ setValuesUser, signIn, signUp, logOut, googleSignIn, facebookSignIn }}>
            {children}
        </AuthContext.Provider>
    );
}
