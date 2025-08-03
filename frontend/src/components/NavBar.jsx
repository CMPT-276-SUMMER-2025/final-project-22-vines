import {Link} from "react-router-dom";
import {useLocation, NavLink} from "react-router-dom";
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

function Dropdown({ icon, label, children, routes = [] }) {
  const location = useLocation();
  const isActive = routes.some((route) => location.pathname.startsWith(`/${route}`));

  return (
    <div className={`dropdown ${isActive ? "activeDropdown" : ""}`}>
      <button type="button" className="dropdownButton">
        <img src={icon} alt={`${label} icon`} className="buttonIcon" />
        {label}
      </button>
      <div className="dropdownContent">{children}</div>
    </div>
  );
}


function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="fullLogo">
        <img src={logo} alt="Logo" className="logo" />
        <img src={name} alt="Name" className="name" />
      </Link>

      <div className="navbarLinks">
        <NavBarButton destination={""} buttonIcon={dashboard} buttonText={"Dashboard"} />

        <Dropdown icon={logfood} label="Nutrition" routes={["logfood", "analyzemeal"]}>
        <NavBarButton destination={"logfood"} buttonIcon={logfood} buttonText={"Log Food"} />
        <NavBarButton destination={"analyzemeal"} buttonIcon={analyzemeal} buttonText={"Analyze Meal"} />
        </Dropdown>

        <Dropdown icon={trackexercise} label="Exercise" routes={["logexercise", "searchexercises", "generateplan"]}>
        <NavBarButton destination={"logexercise"} buttonIcon={trackexercise} buttonText={"Log Exercise"} />
        <NavBarButton destination={"searchexercises"} buttonIcon={trackexercise} buttonText={"Search Exercises"} />
        <NavBarButton destination={"generateplan"} buttonIcon={trackexercise} buttonText={"Generate Routine"} />
        </Dropdown>
      </div>

      <NavBarButton destination={"settings"} buttonIcon={settings} buttonText={"Settings"} />
    </nav>
  );
}


export default NavBar