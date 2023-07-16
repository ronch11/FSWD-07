import { NavLink } from "react-router-dom";
import "../../Styles/TopNav.css";


export function TopNav() {
  return (
    <>
      <nav className="topnav" id="myTopnav">
        <NavLink to="/Info"></NavLink>
      </nav>
    </>
  );
}

export default TopNav;
