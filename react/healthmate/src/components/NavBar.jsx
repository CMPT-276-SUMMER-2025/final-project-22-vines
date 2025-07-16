import {Link} from "react-router-dom";

function NavBar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Logo</Link>
            </div>
            <div className="navbarLinks">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/dashboard">Log Food</Link>
                <Link to="/dashboard">Analyze Meal</Link>
                <Link to="/dashboard">Track Exercise</Link>
            </div>
        </nav>
    )
}

export default NavBar