import React from 'react';
import tmdbApi, { category, movieType } from '~/api/tmdbApi';
import apiConfig from '~/api/apiConfig';
import { useState } from 'react';
import { useEffect } from 'react';
import './heroslide.scss';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import { useNavigate } from 'react-router-dom';
import Button, { OutlineButton } from '../button/Button';
import { useRef } from 'react';
import Modal, { ModalContent } from '../modal/Modal';
import { useDispatch } from 'react-redux';
import { loadingEnd, loadingStart } from '~/redux/userSlice';

function HeroSlide() {
    const [movieItems, setMovieItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMovies = async () => {
            dispatch(loadingStart());
            const params = { page: 2 };
            try {
                const response = await tmdbApi.getMoviesList(movieType.popular, { params });
                setMovieItems(response.data.results.slice(1, 5));
            } catch (error) {
                console.log('error', error);
            }
            dispatch(loadingEnd());
        };
        getMovies();
    }, [dispatch]);

    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: true }}
            >
                {movieItems.map((item, index) => (
                    <SwiperSlide key={index}>
                        {({ isActive }) => (
                            // eslint-disable-next-line jsx-a11y/alt-text
                            <HeroSlideItem item={item} className={`${isActive ? 'isActive' : ''}`} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            {movieItems.map((item, index) => (
                <TrailerModal key={index} item={item} />
            ))}
        </div>
    );
}

const HeroSlideItem = (props) => {
    let navigate = useNavigate();

    const item = props.item;

    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.poster_path);

    const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);

        const videos = await tmdbApi.getVideos(category.movie, item.id);

        if (videos.data.results.length > 0) {
            const videoSrc = 'https://www.youtube.com/embed/' + videos.data.results[0].key;
            modal.querySelector('.modal__content > iframe').setAttribute('src', videoSrc);
        } else {
            modal.querySelector('.modal__content > iframe').setAttribute('height', 0);
            modal.querySelector('.modal__content > iframe').setAttribute('width', 0);
            modal.querySelector('.modal__content > span').innerText = 'No trailer';
        }

        modal.classList.toggle('active');
    };

    return (
        <div className={`hero-slide__item ${props.className}`} style={{ backgroundImage: `url(${background})` }}>
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Button onClick={() => navigate('/movie/' + item.id)}>Watch now</Button>
                        <OutlineButton onClick={setModalActive}>Watch trailer</OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.poster_path)} alt="" />
                </div>
            </div>
        </div>
    );
};

const TrailerModal = (props) => {
    const item = props.item;

    const iframeRef = useRef(null);

    const onClose = () => iframeRef.current.setAttribute('src', '');

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="400px" title="trailer"></iframe>
                <span style={{ fontSize: '1.6rem', fontWeight: 500 }}>{''}</span>
            </ModalContent>
        </Modal>
    );
};

HeroSlide.propTypes = {};

export default HeroSlide;
