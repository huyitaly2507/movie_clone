import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '~/api/tmdbApi';

export default function VideoList(props) {
    const { category } = useParams();
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            const res = await tmdbApi.getVideos(category, props.id);
            setVideos(res.data.results.slice(0, 5));
        };
        getVideos();
    }, [category, props.id]);

    return (
        <div>
            {videos.map((item, index) => (
                <Video key={index} item={item} />
            ))}
        </div>
    );
}

const Video = (props) => {
    const item = props.item;

    const iframeRef = useRef(null);

    useEffect(() => {
        const height = (iframeRef.current.offsetWidth * 9) / 16 + 'px';
        iframeRef.current.setAttribute('height', height);
    }, []);

    return (
        <div className="video">
            <div className="video__title">
                <h2>{item.name}</h2>
            </div>
            {item.key ? (
                <iframe
                    src={`https://www.youtube.com/embed/${item.key}`}
                    ref={iframeRef}
                    width="100%"
                    title="video"
                ></iframe>
            ) : null}
        </div>
    );
};
