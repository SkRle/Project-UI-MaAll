import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import WebLogo from "../image/WebLogo.png";
import Swal from "sweetalert2";
//css

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [conPass, setconPass] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const userRef = useRef();
  const [errMgs, setErrMgs] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const checkFormRegister = () => {
    if (
      fname === "" ||
      lname === "" ||
      email === "" ||
      pass === "" ||
      conPass === ""
    ) {
      setErrMgs("please enter in all input.");
    } else if (!isValidEmail(email)) {
      setErrMgs("Email is invalid.");
    } else if (pass !== conPass) {
      setErrMgs("passwords do not match, try again.");
    }
    // console.log(errMgs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkFormRegister();
    // console.log(conPass, pass);
    if (
      errMgs === "" &&
      fname !== "" &&
      lname !== "" &&
      email !== "" &&
      pass !== "" &&
      conPass !== "" &&
      isValidEmail(email) &&
      pass === conPass
    ) {
      await axios
        .post("/users/register", {
          email: email,
          pass: pass,
          fname: fname,
          lname: lname,
        })
        .then((response) => {
          if (response?.status === 200) {
            localStorage.setItem("token", response.data.token);
            Swal.fire({
              title: "Registed!",
              text: "You have successfully registered",
              icon: "success",
              confirmButtonColor: "#0d6efd",
            });
            navigate("/login");
          }
        })
        .catch((e) => {
          if (e.response.data?.message === "ER_DUP_ENTRY") {
            setErrMgs("this email address is already taken.");
          }
        });
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
                    ref={userRef}
                    onChange={(e) => {
                      setFname(e.target.value);
                      setErrMgs("");
                    }}
                    placeholder="First Name"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    ref={userRef}
                    onChange={(e) => {
                      setLname(e.target.value);
                      setErrMgs("");
                    }}
                    placeholder="Last Name"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
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
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    ref={userRef}
                    onChange={(e) => {
                      setconPass(e.target.value);
                      setErrMgs("");
                    }}
                    placeholder="confrim password"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary px-5 mb-5 w-100"
                  >
                    Register
                  </button>
                </div>
                <div
                  id="emailHelp"
                  className="form-text text-center mb-5 text-dark"
                >
                  Registered?
                  <a href="/login" className="text-dark fw-bold">
                    Login
                  </a>
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
