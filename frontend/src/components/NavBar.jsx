import {Link} from "react-router-dom";
import {NavLink} from "react-router-dom";
import logo from "../assets/logo.png";
import name from "../assets/name.png";
import dashboard from "../assets/dashboard.svg";
import logfood from "../assets/logfood.svg";
import analyzemeal from "../assets/analyzemeal.svg";
import trackexercise from "../assets/trackexercise.svg";
import settings from "../assets/settings.svg";
import "../css/Navbar.css";

function NavBarButton({destination, buttonIcon, buttonText}) {
    return (
        <NavLink to={`/${destination}`} className="buttonLink">
            <button type="button">
                <img src={buttonIcon} alt="Button Icon" className="buttonIcon"/>
                {buttonText}
            </button>
        </NavLink>
    )
}

function NavBar() {
    return (
        <nav className="navbar">
            <Link to="/" className="fullLogo">
                <img src={logo} alt="Logo" className="logo"/>
                <img src={name} alt="Name" className="name"/>
            </Link>
            <div className="navbarLinks">
                <NavBarButton destination={""} buttonIcon={dashboard} buttonText={"Dashboard"}/>
                <NavBarButton destination={"logfood"} buttonIcon={logfood} buttonText={"Log Food"}/>
                <NavBarButton destination={"analyzemeal"} buttonIcon={analyzemeal} buttonText={"Analyze Meal"}/>
                <NavBarButton destination={"trackexercise"} buttonIcon={trackexercise} buttonText={"Track Exercise"}/>
                
            </div>
            <NavBarButton destination={"settings"} buttonIcon={settings} buttonText={"Settings"}/>
        </nav>
    )
}

export default NavBar