import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiConfig from '~/api/apiConfig';
import tmdbApi from '~/api/tmdbApi';
import NoImage from '~/assets/no-image.png';

export default function CastList(props) {
    const { category } = useParams();
    const [casts, setCasts] = useState([]);

    useEffect(() => {
        const getCredits = async () => {
            const res = await tmdbApi.credits(category, props.id);
            setCasts(res.data.cast.slice(0, 5));
        };
        getCredits();
    }, [category, props.id]);

    return (
        <div className="casts">
            {casts.map((item, index) => (
                <div key={index} className="casts__item">
                    <div
                        className="casts__item__img"
                        style={{
                            backgroundImage: `url(${
                                item.profile_path ? apiConfig.w500Image(item.profile_path) : NoImage
                            })`,
                        }}
                    ></div>
                    <p className="casts__item__name">{item.name}</p>
                </div>
            ))}
        </div>
    );
}
