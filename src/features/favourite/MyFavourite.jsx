import './myfavourite.scss';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NoImage from '~/assets/no-image.png';
import MovieCard from '~/components/movie-card/MovieCard';
import PageHeader from '~/components/page-header/PageHeader';
import { db } from '~/Firebase';
import { selectUser } from '~/redux/userSlice';

export default function MyFavourite() {
    const currentUser = useSelector(selectUser);
    const [movies, setMovies] = useState([]);

    const deleteShow = async (passedID) => {
        if (currentUser?.email) {
            try {
                const result = movies.filter((movie) => movie.id !== passedID);
                await updateDoc(doc(db, 'users', `${currentUser?.email}`), {
                    savedShows: result,
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        onSnapshot(doc(db, 'users', `${currentUser?.email}`), (doc) => {
            doc.data()?.savedShows.forEach((item) => {
                if (item.img === '') {
                    item.img = NoImage;
                }
            });
            setMovies(doc.data()?.savedShows);
        });
    }, [currentUser?.email]);

    return (
        <>
            <PageHeader>Your Favourites</PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <div className="my-favourite_list">
                        {movies.map((movie, index) => (
                            <MovieCard key={index} item={movie} onClick={() => deleteShow(movie.id)} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
