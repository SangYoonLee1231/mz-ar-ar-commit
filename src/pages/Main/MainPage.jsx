import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Component,
} from "react-router-dom";
import "./MainPage.scss";
import Nav from "../../components/Nav.jsx";
import Header from "../../components/header.jsx";
import ImageSlider from "./imageSlider.jsx";

//화면 Main(메인화면) 컴포넌트를 만든다
const Main = () => {
  return (
    <div className="main-body">
      <Header />
      <div className="banner">
        <div className="banner-font-style">
          <span className="fontColor">MZ</span>
          <span style={{ color: "white", fontSize: 30 }}>를 잘</span>
          <span className="fontColor">AR</span>
          <span style={{ color: "white", fontSize: 30 }}>니깐!</span>
        </div>
        <div className="banner-ment-style">
          <span style={{ color: "white", fontSize: 35 }}>지금 분당점은?</span>
          <div className="SizedBox"></div>
          <div className="banner-mzarar-style">
            <span style={{ color: "black", fontSize: 45, padding: 20 }}>
              MZ-AR-AR
            </span>
          </div>
        </div>
      </div>

      <div className="center">
        <div className="SizedBox"></div>
        <div className="horiz-style">
          <Link to="/login-page">
            <button className="button-horiz">로그인</button>
          </Link>
          <div className="SizedBox"></div>
        </div>
        <ImageSlider />
        <div className="center">
          <div className="SizedBox"></div>
          <div className="SizedBox"></div>
          <div className="SizedBox"></div>
          <div className="SizedBox"></div>
          <div className="SizedBox"></div>
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Main;
