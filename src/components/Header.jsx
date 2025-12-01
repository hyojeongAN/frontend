import React from 'react';
import '../styles/header.css';

function Header({ onNavigate }) {

    return(
            <nav>
                <ul>
                    <li onClick={() => onNavigate('home')}>Home</li>
                    <li onClick={() => onNavigate('service')}>Service</li>
                </ul>
            </nav>
    );
}

export default Header;