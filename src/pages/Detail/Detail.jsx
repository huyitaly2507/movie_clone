import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import apiConfig from '~/api/apiConfig';
import tmdbApi from '~/api/tmdbApi';
import MovieList from '~/components/movie-list/MovieList';
import { loadingEnd, loadingStart } from '~/redux/userSlice';
import CastList from './CastList';
import './detail.scss';
import VideoList from './VideoList';
import NoImage from '~/assets/no-image.png';

function Detail() {
    const [item, setItem] = useState(null);
    const { category, id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const getDetail = async () => {
            dispatch(loadingStart());
            try {
                const response = await tmdbApi.detail(category, id, { params: {} });
                setItem(response.data);
            } catch (error) {
                console.log(error.message);
            }
            dispatch(loadingEnd());
        };
        getDetail();
    }, [category, id, dispatch]);

    return (
        <>
            {item && (
                <>
                    {item.poster_path || item.backdrop_path || NoImage ? (
                        <>
                            <div
                                className="banner"
                                style={{
                                    backgroundImage: `url(${
                                        item.backdrop_path || item.poster_path
                                            ? apiConfig.originalImage(item.backdrop_path || item.poster_path)
                                            : NoImage
                                    })`,
                                }}
                            ></div>
                            <div className="mb-3 movie-content container">
                                <div className="movie-content__poster">
                                    <div
                                        className="movie-content__poster__img"
                                        style={{
                                            backgroundImage: `url(${
                                                item.backdrop_path || item.poster_path
                                                    ? apiConfig.originalImage(item.backdrop_path || item.poster_path)
                                                    : NoImage
                                            })`,
                                        }}
                                    ></div>
                                </div>
                                <div className="movie-content__info">
                                    <h1 className="title">{item.title || item.name}</h1>
                                    <div className="genres">
                                        {item.genres &&
                                            item.genres.slice(0, 5).map((genre, index) => (
                                                <span key={index} className="genres__item">
                                                    {genre.name}
                                                </span>
                                            ))}
                                    </div>
                                    <p className="overview">{item.overview}</p>
                                    <div className="cast">
                                        <div className="section__header">
                                            <h2>Casts</h2>
                                        </div>
                                        <CastList id={item.id} />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="section mb-3">
                                    <VideoList id={item.id} />
                                </div>
                                <div className="section mb-3">
                                    <div className="section__header mb-2">
                                        <h2>Similar</h2>
                                    </div>
                                    <MovieList category={category} type="similar" id={item.id} />
                                </div>
                            </div>
                        </>
                    ) : null}
                </>
            )}
        </>
    );
}

Detail.propTypes = {};

export default Detail;
