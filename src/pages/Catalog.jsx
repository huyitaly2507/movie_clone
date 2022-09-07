import React from 'react';
import { useParams } from 'react-router-dom';
import MovieGrid from '~/components/movie-grid/MovieGrid';
import PageHeader from '~/components/page-header/PageHeader';
// import PropTypes from 'prop-types';
import { category as cate } from '../api/tmdbApi';

function Catalog() {
    const { category } = useParams();

    return (
        <>
            <PageHeader>{category === cate.movie ? 'Movies' : 'TV Series'}</PageHeader>
            <div className="container">
                <div className="section mb-3">
                    <MovieGrid category={category} />
                </div>
            </div>
        </>
    );
}

Catalog.propTypes = {};

export default Catalog;
