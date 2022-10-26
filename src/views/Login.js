import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import WebLogo from "../image/WebLogo.png";
import Swal from "sweetalert2";

//css

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const userRef = useRef();
  const [errMgs, setErrMgs] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const checkFormLogin = () => {
    if (email === "" || pass === "") {
      setErrMgs("please enter email or password.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkFormLogin(e);
    // console.log(errMgs);
    if (errMgs === "" && email !== "" && pass !== "") {
      const response = await axios
        .post("/users/login", {
          email: email,
          pass: pass,
        })
        .catch((e) => {
          setErrMgs(e.response.data.message);
        });
      if (response?.status === 200) {
        Swal.fire({
          title: "Login!",
          text: "Wellcome to Ma - All.",
          icon: "success",
          confirmButtonColor: "#0d6efd",
        });
        navigate("/");
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="card my-5">
              <form className="card-body cardbody-color p-lg-5">
                <div className="text-center">
                  <img
                    src={WebLogo}
                    className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                    width="200px"
                    alt="profile"
                  />
                </div>
                {errMgs ? (
                  <div className="alert alert-danger text-center" role="alert">
                    {errMgs}
                  </div>
                ) : (
                  ""
                )}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    ref={userRef}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrMgs("");
                    }}
                    aria-describedby="emailHelp"
                    placeholder="exampxxx@gmail.com"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    ref={userRef}
                    onChange={(e) => {
                      setPass(e.target.value);
                      setErrMgs("");
                    }}
                    placeholder="password"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary px-5 mb-5 w-100"
                  >
                    Login
                  </button>
                </div>
                <div
                  id="emailHelp"
                  className="form-text text-center mb-5 text-dark"
                >
                  Not Registered?
                  <Link to="/register" className="text-dark fw-bold">
                    Create an Account
                  </Link>
                  <br></br>
                  <Link to="/" className="mt-5 fw-bold text-dark ">
                    Visit WEB
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
