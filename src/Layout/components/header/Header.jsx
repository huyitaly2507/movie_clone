import { useContext, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { RiHomeHeartLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '~/assets/tmovie.png';
import Button, { OutlineButton } from '~/components/button/Button';
import { AuthContext } from '~/features/auth/AuthUser';
import { selectUser } from '~/redux/userSlice';
import './header.scss';

const headerNav = [
    {
        display: 'Home',
        path: '/',
    },
    {
        display: 'Movies',
        path: '/movie',
    },
    {
        display: 'TV Series',
        path: '/tv',
    },
];

function Header({ onClick, moviesFavourite }) {
    // const { pathname } = useLocation();
    const headerRef = useRef(null);
    const currentUser = useSelector(selectUser);
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    // const active = headerNav.findIndex((e) => e.path === pathname);

    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                headerRef.current.classList.add('shrink');
            } else {
                headerRef.current.classList.remove('shrink');
            }
        };
        window.addEventListener('scroll', shrinkHeader);

        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        };
    }, []);

    return (
        <div ref={headerRef} className="header">
            <div className="header__wrapper container">
                {currentUser && <HiMenu className="menu" onClick={onClick} />}
                <Link to="/" className="logo">
                    <img src={logo} alt="" />
                    <span>Movies_Clones</span>
                </Link>
                <ul className="header__nav">
                    {headerNav.map((e, i) => (
                        <li key={i}>
                            <NavLink to={e.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                                {e.display}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="header__user-info">
                    {currentUser ? (
                        <div className="header__user-info-Signin">
                            <div className="my-favourite" onClick={() => navigate('/myfavourite')}>
                                <RiHomeHeartLine />
                                {moviesFavourite && moviesFavourite.length !== 0 ? (
                                    <div className="my-favourite_quantity">{moviesFavourite.length}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <span className="header__user-info-name">{currentUser.name || currentUser.email}</span>
                            <div
                                style={{ backgroundImage: `url(${currentUser.photoUrl})` }}
                                className="header__user-info-img"
                            >
                                <Button className="medium log-out" onClick={() => logOut()}>
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="header__user-info-noSignin">
                            <OutlineButton className="medium" onClick={() => navigate('/signin')}>
                                Sign In
                            </OutlineButton>
                            <Button className="medium" onClick={() => navigate('/signup')}>
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Header.propTypes = {};

export default Header;
