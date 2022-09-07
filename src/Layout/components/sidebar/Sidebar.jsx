import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '~/features/auth/AuthUser';
import { selectUser } from '~/redux/userSlice';
import './sidebar.scss';

export default function Sidebar({ active, setActive, moviesFavourite }) {
    const currentUser = useSelector(selectUser);
    const { logOut } = useContext(AuthContext);

    const handleLogout = () => {
        logOut();
        setActive(false);
    };

    return (
        <div className={`sidebar__wrapper ${active ? 'active' : ''}`}>
            {currentUser && (
                <div className="user-info">
                    <div style={{ backgroundImage: `url(${currentUser.photoUrl})` }} className="user-info_img"></div>
                    <span className="user-info_name">{currentUser.name || currentUser.email}</span>
                </div>
            )}
            <ul className="sidebar__nav">
                <NavLink
                    to="/myfavourite"
                    className={({ isActive }) => `sidebar__item ${isActive ? 'active' : ''}`}
                    onClick={() => setActive(false)}
                >
                    Your Favourites
                    {moviesFavourite && moviesFavourite.length !== 0 ? (
                        <div className="quantity">{moviesFavourite.length}</div>
                    ) : (
                        ''
                    )}
                </NavLink>
                <NavLink to="/" className="sidebar__item" onClick={handleLogout}>
                    Log Out
                </NavLink>
            </ul>
        </div>
    );
}
