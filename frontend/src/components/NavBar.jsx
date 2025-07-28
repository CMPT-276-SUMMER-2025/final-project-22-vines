import {Link} from "react-router-dom";

function NavBarButton({destination, buttonText}) {
    return (
        <Link to={`/${destination}`}>
            <button type="button">
                {buttonText}
            </button>
        </Link>
    )
}

function NavBar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Logo</Link>
            </div>
            <div className="navbarLinks">
                <NavBarButton destination={""} buttonText={"Dashboard"}/>
                <NavBarButton destination={""} buttonText={"Log Food"}/>
                <NavBarButton destination={"analyzemeal"} buttonText={"Analyze Meal"}/>
                <NavBarButton destination={""} buttonText={"Track Exercise"}/>
                <NavBarButton destination={""} buttonText={"Settings"}/>
            </div>
        </nav>
    )
}

export default NavBar