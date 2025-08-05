import React from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css"; 

const HeroSection = () => {
  return (
    <div className="hero-container">
      <Link
        to="/category/kurtis"
        className="hero-split"
        style={{
          backgroundImage: `url(https://www.manyavar.com/on/demandware.static/-/Library-Sites-ManyavarSharedLibrary/default/dw635c965b/How-to-Style-a-Kurta-for-a-Wedding-Party-Dos-and-Don%E2%80%99ts_D.jpg)`,
        }}
      >
        <div className="hero-content">
          <h2>Mens Kurtis</h2>
          <p>Chic and contemporary styles for the modern you.</p>
          <button className="hero-button">Explore Kurtis</button>
        </div>
      </Link>
      <Link
        to="/category/sarees"
        className="hero-split"
        style={{
          backgroundImage: `url(https://vaarahisilks.com/cdn/shop/files/landscape_Vaarahi_Silks_photos_1.jpg?crop=center&height=2050&v=1737528086&width=4100)`,
        }}
      >
        <div className="hero-content">
          <h2>Ethnic Elegance</h2>
          <p>Graceful designs for every tradition.</p>
          <button className="hero-button">Discover Sarees</button>
        </div>
      </Link>
      <Link
        to="/category/western"
        className="hero-split"
        style={{
          backgroundImage: `url('https://www.moontara.in/cdn/shop/collections/all-dresses-moontara.jpg?v=1723488451&width=2400')`,
        }}
      >
        <div className="hero-content">
          <h2>Modern Trends</h2>
          <p>Chic and contemporary styles for the modern you.</p>
          <button className="hero-button">Explore Western</button>
        </div>
      </Link>
    </div>
  );
};

export default HeroSection;
