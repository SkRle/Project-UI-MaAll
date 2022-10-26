import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FrontendLayout from "../layout/FrontendLayout";
import axios from "../api/axios";
import Card from "react-bootstrap/Card";
import "../css/Thread.css";
import Swal from "sweetalert2";

const Home = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const [perMiss, setPerMiss] = useState("");
  const [token, setToken] = useState("");
  const [thread, setThread] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState();
  const [userID, setUserID] = useState("");
  const [errMgs, setErrMgs] = useState("");
  const [categorylist, setCategorylist] = useState([]);

  useEffect(() => {
    getThread();
  }, []);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const getUser = JSON.parse(localStorage.getItem("user"));
      setUserID(getUser.data.user_id);
      setToken(getUser.token);
      setPerMiss(getUser.data.permission_id);
    }
  }, []);

  const checkFormPost = () => {
    if (title === "" || content === "") {
      setErrMgs("please enter title or content.");
    } else if (category === "") {
      setErrMgs("please choose category");
    }
  };

  const getCategory = async () => {
    await axios.get("/public/get-category").then((res) => {
      setCategorylist(res.data.data);
    });
    // console.log(categorylist);
  };

  const getThread = async () => {
    await axios.get("/public/get-thread").then((res) => {
      // console.log(res);
      setThread(res.data.data);
    });
  };

  const delThread = async (e) => {
    const postID = e.currentTarget.id;
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          url: `/thread/delete-thread`,
          method: "delete",
          data: {
            user_id: userID,
            post_id: postID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res?.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Post has been deleted.",
                icon: "success",
                confirmButtonColor: "#0d6efd",
              });
              getThread();
            }
          })
          .catch((e) => {
            if (e.response?.status === 403 || e.eresponse?.status === 401) {
              localStorage.removeItem("user");
              navigate("/login");
            }
          });
      }
    });
  };

  const postThread = async (e) => {
    e.preventDefault();
    checkFormPost();
    if (errMgs === "" && title !== "" && content !== "" && category !== "") {
      await axios({
        url: `/thread/post-thread`,
        method: "post",
        data: {
          post_title: title,
          post_content: content,
          post_category: category,
          user_id: userID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res?.status === 200) {
            Swal.fire({
              title: "Successfully!",
              text: "you posted successfully",
              icon: "success",
              confirmButtonColor: "#0d6efd",
            });
            getThread();
            setTitle("");
            setContent("");
            setCategory("");
          }
        })
        .catch((e) => {
          if (e.response?.status === 403 || e.eresponse?.status === 401) {
            localStorage.removeItem("user");
            navigate("/login");
          }
        });
    }
    if (!token) {
      navigate("/login");
    }
  };

  const selectCategory = async (e) => {
    if (e) {
      await axios.get(`/public/get-category/${e}`).then((res) => {
        setThread(res.data.data);
      });
    } else {
      getThread();
    }
  };
  return (
    <FrontendLayout>
      <div className="container-md mt-2">
        <div className="row">
          <div className="col-6 mt-2 mb-2 d-flex justify-content-center">
            <h4>
              <span
                onClick={() => selectCategory(0)}
                className="badge rounded-pill bg-primary mx-1 pointer"
              >
                All
              </span>
            </h4>
            {categorylist.map((o, i) => {
              return (
                <h4>
                  <span
                    key={o.category_id}
                    onClick={() => selectCategory(o.category_id)}
                    className="badge rounded-pill bg-primary mx-1 pointer"
                  >
                    {o.category_name}
                  </span>
                </h4>
              );
            })}
          </div>
          <div className="col-sm-7 col-md-7 col-12 pb-4">
            {thread.map((e, k) => (
              <Card
                key={k}
                className="mt-2  w-100"
                style={{
                  width: "22rem",
                }}
              >
                <Card.Body>
                  <Card.Title className=" fs-6 text-muted">
                    {e.user_fname} {e.user_lname}
                    <div className="d-flex flex-row-reverse">
                      {e.category_name}
                    </div>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 fs-4">
                    {e.post_title}
                  </Card.Subtitle>
                  <Card.Text className="text-body text-break">
                    {e.post_content}
                  </Card.Text>
                  {perMiss === 0 ? (
                    <Card.Text className="d-flex flex-row-reverse">
                      <button
                        id={e.post_id}
                        onClick={delThread}
                        className=" btn text-danger"
                      >
                        del
                      </button>
                    </Card.Text>
                  ) : (
                    <> </>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="mt-2 col-sm-5 col-md-5 col-12 pb-4">
            <form id="algin-form">
              <div className="form-group">
                <h4> Want to post something ? ? </h4> <label> Title </label>
                <input
                  ref={userRef}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrMgs("");
                  }}
                  className="form-control bg-light"
                  value={title}
                ></input>
                <label> content </label>
                <textarea
                  id=""
                  cols="30"
                  rows="5"
                  ref={userRef}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setErrMgs("");
                  }}
                  value={content}
                  className="form-control  bg-light"
                ></textarea>
                <label> category </label>
                <select
                  ref={userRef}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setErrMgs("");
                  }}
                  value={category}
                  className="form-control"
                >
                  <option value="" disabled selected>
                    please select category
                  </option>
                  {categorylist.map((o) => (
                    <option key={o.category_id} value={o.category_id}>
                      {o.category_name}
                    </option>
                  ))}
                </select>
                <div>
                  {errMgs ? (
                    <div
                      className="mt-3 alert alert-danger text-center"
                      role="alert"
                    >
                      {errMgs}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-4 d-flex flex-row-reverse">
                  <button onClick={postThread} className="btn btn-primary">
                    POST
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Home;
