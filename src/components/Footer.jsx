import React from "react";
import '../styles/footer.css';

function Footer () {
   return(
    <footer>
        <p>&copy; {new Date().getFullYear()} Your website name</p>
    </footer>
    );
}

export default Footer;