import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import { Link } from "react-router-dom";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./NewArrivals.css";

const NewArrivals = () => {
  const { addToCart } = useCart();

  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        
        const response = await axios.get("/api/products/new-arrivals");
        setNewArrivals(response.data);
      } catch (err) {
        setError("Could not load new arrivals at the moment.");
        console.error("Fetch New Arrivals Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white-50">Loading New Arrivals...</p>
      </div>
    );
  }

  
  if (error) {
    return <Alert variant="warning">{error}</Alert>;
  }


  if (!newArrivals || newArrivals.length === 0) {
    return null; 
  }

  return (
    <section className="new-arrivals-section">
      <h2 className="text-center mb-4 fw-bold text-white">New Arrivals</h2>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 80,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {newArrivals.map((product) => (
          <SwiperSlide key={product.productid}>
            {" "}
            <div className="arrival-card">
              <img src={product.thumbnail} alt={product.name} />{" "}
              <div className="arrival-overlay">
                <h5 className="arrival-title">{product.name}</h5>{" "}
                <p className="arrival-price">
                  {
                    typeof product.price === "number"
                      ? `₹${product.price.toLocaleString("en-IN")}`
                      : "Price upon request" 
                  }
                </p>{" "}
                <div className="arrival-buttons">
                  <Link to={`/product/${product.productid}`}>
                    {" "}
                    <Button variant="outline-light" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default NewArrivals;
