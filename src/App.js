import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import Register from "./views/Register";
import NotFound from "./views/NoPage";
const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  );
};

export default App;
