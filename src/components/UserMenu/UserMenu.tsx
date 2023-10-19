import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function UserMenu() {
  const { user, logout } = useAuth0();
  const [open, setOpen] = useState(false);

  return (
    <div className={`dropdown column is-1 ${open ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          className="button is-ghost"
          aria-haspopup="true"
          aria-controls="userMenu-dropdown"
          onClick={() => setOpen(!open)}
        >
          <span>Logged as: {user?.nickname}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="userMenu-dropdown" role="menu">
        <div className="dropdown-content">
          <button
            className="dropdown-item button is-ghost"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
