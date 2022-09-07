import React from 'react';
// import PropTypes from 'prop-types';
import './footer.scss';
import footerBg from '~/assets/footer-bg.jpg';
import logo from '~/assets/tmovie.png';
import { Link } from 'react-router-dom';

function Footer(props) {
    return (
        <div className="footer" style={{ backgroundImage: `url(${footerBg})` }}>
            <div className="footer_content container">
                <div className="footer_content_logo">
                    <div className="logo">
                        <img src={logo} alt="" />
                        <Link to="/">Movies_Clones</Link>
                    </div>
                </div>
                <div className="footer_content_menus">
                    <div className="footer_content_menu">
                        <Link to="/">Home</Link>
                        <Link to="/">Contact us</Link>
                        <Link to="/">Term of services</Link>
                        <Link to="/">About us</Link>
                    </div>
                    <div className="footer_content_menu">
                        <Link to="/">Live</Link>
                        <Link to="/">FAQ</Link>
                        <Link to="/">Premium</Link>
                        <Link to="/">Pravacy policy</Link>
                    </div>
                    <div className="footer_content_menu">
                        <Link to="/">You must watch</Link>
                        <Link to="/">Recent release</Link>
                        <Link to="/">Top IMDB</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

Footer.propTypes = {};

export default Footer;
