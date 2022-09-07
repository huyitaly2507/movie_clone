import './App.scss';

import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'swiper';
import Loading from './components/loading/Loading';
import AuthUser from './features/auth/AuthUser';
import DefaultLayout from './Layout/DefaultLayout/DefaultLayout';
import { selectLoading } from './redux/userSlice';
import { privateRoutes, publishRoutes } from './routes/routes';
import { NotiModal } from './components/movie-card/MovieCard';

function App() {
    const isLoading = useSelector(selectLoading);

    return (
        <AuthUser>
            <Router>
                <Routes>
                    {publishRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <>
                                        {isLoading && <Loading />}
                                        <NotiModal />
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </>
                                }
                            />
                        );
                    })}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;

                        const ProtectedRoute = route.protected;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <>
                                        {isLoading && <Loading />}
                                        <Layout>
                                            <ProtectedRoute>
                                                <Page />
                                            </ProtectedRoute>
                                        </Layout>
                                    </>
                                }
                            />
                        );
                    })}
                </Routes>
            </Router>
        </AuthUser>
    );
}

export default App;
