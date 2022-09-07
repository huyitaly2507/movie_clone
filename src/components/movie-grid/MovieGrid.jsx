import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './movie-grid.scss';

import tmdbApi, { category, movieType, tvType } from '~/api/tmdbApi';
import Button, { OutlineButton } from '../button/Button';
import MovieCard from '../movie-card/MovieCard';
import Input from '../input/Input';
import { useDispatch } from 'react-redux';
import { loadingEnd, loadingStart } from '~/redux/userSlice';

export default function MovieGrid(props) {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const dispatch = useDispatch();

    const { keyword } = useParams();

    useEffect(() => {
        const getList = async () => {
            dispatch(loadingStart());
            let response = null;

            if (keyword === undefined) {
                const params = {};
                switch (props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(movieType.upcoming, { params });
                        break;
                    default:
                        response = await tmdbApi.getTvList(tvType.popular, { params });
                        break;
                }
            } else {
                const params = {
                    query: keyword,
                };
                response = await tmdbApi.search(props.category, { params });
            }
            setItems(response.data.results);
            setTotalPage(response.data.total_pages);
            dispatch(loadingEnd());
        };
        getList();
    }, [props.category, keyword, dispatch]);

    const loadmore = async () => {
        dispatch(loadingStart());
        let response = null;

        if (keyword === undefined) {
            const params = { page: page + 1 };
            switch (props.category) {
                case category.movie:
                    response = await tmdbApi.getMoviesList(movieType.upcoming, { params });
                    break;
                default:
                    response = await tmdbApi.getTvList(tvType.popular, { params });
                    break;
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword,
            };
            response = await tmdbApi.search(props.category, { params });
        }
        setItems([...items, ...response.data.results]);
        setPage((prevPage) => prevPage + 1);
        dispatch(loadingEnd());
    };

    return (
        <>
            <div className="section mb-3">
                <MovieSearch category={props.category} keyword={keyword} />
            </div>
            {items.length === 0 ? (
                <span className="movie-not_found">{`Not found "${keyword}" ${props.category}!`}</span>
            ) : (
                <>
                    <div className="movie-grid">
                        {items.map((item, index) => (
                            <MovieCard key={index} category={props.category} item={item} />
                        ))}
                    </div>
                    {page < totalPage ? (
                        <div className="movie-grid_loadmore">
                            <OutlineButton className="small" onClick={loadmore}>
                                Load more
                            </OutlineButton>
                        </div>
                    ) : null}
                </>
            )}
        </>
    );
}

const MovieSearch = (props) => {
    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const goToSearch = useCallback(() => {
        dispatch(loadingStart());
        if (keyword.trim().length > 0) {
            navigate(`/${category[props.category]}/search/${keyword}`);
        }
        dispatch(loadingEnd());
    }, [keyword, props.category, navigate, dispatch]);

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch();
            }
        };
        document.addEventListener('keyup', enterEvent);

        return () => {
            document.removeEventListener('keyup', enterEvent);
        };
    }, [keyword, goToSearch]);

    return (
        <div className="movie-search">
            <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button className="small" onClick={goToSearch}>
                Search
            </Button>
        </div>
    );
};
