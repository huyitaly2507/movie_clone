import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import SignIn from '~/features/auth/pages/SignIn';
import SignUp from '~/features/auth/pages/SignUp';
import MyFavourite from '~/features/favourite/MyFavourite';
import Catalog from '~/pages/Catalog';
import Detail from '~/pages/Detail/Detail';
import Home from '~/pages/Home';
import { selectUser } from '~/redux/userSlice';

const ProtectedRoute = ({ children }) => {
    const currenUser = useSelector(selectUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currenUser) {
            navigate('/signin');
        }
    }, [navigate, currenUser]);

    return <>{children}</>;
};

const publishRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.catalog, component: Catalog },
    { path: config.routes.search, component: Catalog },
    { path: config.routes.signIn, component: SignIn, layout: null },
    { path: config.routes.signUp, component: SignUp, layout: null },
];

const privateRoutes = [
    { path: config.routes.detail, component: Detail, protected: ProtectedRoute },
    { path: config.routes.myFavourite, component: MyFavourite, protected: ProtectedRoute },
];

export { publishRoutes, privateRoutes };
