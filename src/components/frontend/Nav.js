import { useState, useEffect } from "react";
import NavImage from "../../image/NavLogo.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Nav = () => {
  const [token, setToken] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const data = JSON.parse(localStorage.getItem("user"));
      setFname(data.data.user_fname);
      setLname(data.data.user_lname);
      setToken(data.token);
    }
  }, []);

  const logout = () => {
    Swal.fire({
      title: "Logout!",
      text: "You have successfully logged out.",
      icon: "success",
      confirmButtonColor: "#0d6efd",
    });
    localStorage.removeItem("user");
  };
  return (
    <nav className="navbar navbar-light bg-dark">
      <div className="container">
        <img src={NavImage} alt="" className="px-100" width={100} />
        <div className="d-flex input-group w-auto">
          {!token ? (
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
          ) : (
            <div className="text-light bold">
              {fname} {lname}
              <Link
                className="ms-2 md-ms-2 btn btn-danger"
                to="/login"
                onClick={logout}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Nav;
