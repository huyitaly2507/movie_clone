import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import tmdbApi, { category } from '~/api/tmdbApi';
import './movie-list.scss';

// import Swiper core and required modules
import { Keyboard, Mousewheel, Navigation, Pagination, Scrollbar } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';

import MovieCard from '../movie-card/MovieCard';
import { useDispatch } from 'react-redux';
import { loadingEnd, loadingStart } from '~/redux/userSlice';

function MovieList(props) {
    const [items, setItems] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getList = async () => {
            dispatch(loadingStart());
            let response = null;
            const params = {};

            if (props.type !== 'similar') {
                switch (props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(props.type, { params: { params } });
                        break;
                    default:
                        response = await tmdbApi.getTvList(props.type, { params: { params } });
                }
            } else {
                response = await tmdbApi.similar(props.category, props.id);
            }
            setItems(response.data.results);
            dispatch(loadingEnd());
        };
        getList();
    }, [props.type, props.category, props.id, dispatch]);

    return (
        <div className="movie-list">
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Keyboard, Mousewheel]}
                navigation={true}
                keyboard={{
                    enabled: true,
                    onlyInViewport: true,
                }}
                // mousewheel={{
                //     invert: false,
                //     forceToAxis: true,
                //     sensitivity: 5,
                // }}
                // scrollbar={true}
                spaceBetween={10}
                slidesPerView={'auto'}
                slidesPerGroupAuto={true}
                speed={1500}
                // watchOverflow={true}
                className="movie-swiper"
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index}>
                        <MovieCard item={item} category={props.category} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default MovieList;
