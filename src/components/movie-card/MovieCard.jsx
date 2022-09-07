/* eslint-disable array-callback-return */
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import apiConfig from '~/api/apiConfig';
import { category } from '~/api/tmdbApi';
import NoImage from '~/assets/no-image.png';
import config from '~/config';
import { db } from '~/Firebase';
import { selectUser } from '~/redux/userSlice';
import Button from '../button/Button';
import Modal, { ModalContent } from '../modal/Modal';
import './movie-card.scss';

export default function MovieCard(props) {
    const currentUser = useSelector(selectUser);
    const [liked, setLiked] = useState(false);
    const { pathname } = useLocation();
    const item = props.item;

    const link = '/' + category[props.category || item.category] + '/' + item.id;

    const bg = apiConfig.w500Image(item.poster_path || item.backdrop_path || item.img);

    const movieID = doc(db, 'users', `${currentUser?.email}`);

    const saveShow = async () => {
        if (currentUser?.email) {
            setLiked(!liked);
            await updateDoc(movieID, {
                savedShows: arrayUnion({
                    id: item.id,
                    title: item.title || item.name,
                    img: item.poster_path || item.backdrop_path || '',
                    category: props.category,
                }),
            });
        } else {
            setModalActive('Please log in to save a movie');
        }
    };

    const setModalActive = async (value) => {
        const modal = document.querySelector(`.modal`);

        modal.querySelector('.modal__content > .noti-modal_title > span').innerHTML = value;

        modal.classList.toggle('active');
    };

    useEffect(() => {
        if (currentUser) {
            onSnapshot(movieID, (doc) => {
                doc.data()?.savedShows.map((saved) => {
                    if (saved.id === item.id) {
                        setLiked(true);
                    }
                });
            });
        } else {
            setLiked(false);
        }
    }, [movieID, item.id, currentUser]);

    return (
        <>
            {item.poster_path || item.backdrop_path || item.img || NoImage ? (
                <div>
                    <div
                        className="movie-card"
                        style={{
                            backgroundImage: `url(${
                                item.poster_path || item.backdrop_path || item.img ? bg : NoImage
                            })`,
                        }}
                    >
                        {pathname === config.routes.myFavourite ? (
                            <div className="movie-card_close" onClick={props.onClick}>
                                <RiCloseLine />
                            </div>
                        ) : (
                            <div className="movie-card_liked">
                                {liked ? (
                                    <HiHeart
                                        className="movie-card_liked-fill"
                                        onClick={() => setModalActive('Please go to your favorites to delete!')}
                                    />
                                ) : (
                                    <HiOutlineHeart className="movie-card_liked-outline" onClick={saveShow} />
                                )}
                            </div>
                        )}

                        <Link to={link}>
                            <Button>
                                <BsPlayFill />
                            </Button>
                        </Link>
                    </div>
                    <h3 className="movie-card_title">{item.title || item.name}</h3>
                </div>
            ) : null}
        </>
    );
}

export const NotiModal = () => {
    return (
        <Modal active={false}>
            <ModalContent>
                <div className="noti-modal_title">
                    <span></span>
                </div>
            </ModalContent>
        </Modal>
    );
};
