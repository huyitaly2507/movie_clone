import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Sidebar from '../components/sidebar/Sidebar';
import { useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '~/Firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '~/redux/userSlice';

function DefaultLayout({ children }) {
    const currentUser = useSelector(selectUser);
    const [active, setActive] = useState(false);
    const [moviesFavourite, setMoviesFavourite] = useState([]);

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${currentUser?.email}`), (doc) => {
            setMoviesFavourite(doc.data()?.savedShows);
        });
    }, [currentUser?.email, setMoviesFavourite]);

    return (
        <div>
            <Header onClick={() => setActive(!active)} moviesFavourite={moviesFavourite} />
            <Sidebar active={active} setActive moviesFavourite={moviesFavourite} />
            {children}
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
