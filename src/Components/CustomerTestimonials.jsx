import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import { FaUserCircle, FaStar } from "react-icons/fa";

import "swiper/css";
import "./CustomerTestimonials.css";

const CustomerTestimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/reviews/featured");
        const data = response.data;

        if (data.length > 0 && data.length < 6) {
          setReviews([...data, ...data]);
        } else {
          setReviews(data);
        }
      } catch (err) {
        setError("Could not load customer testimonials.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedReviews();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  if (error)
    return (
      <Alert variant="secondary" className="text-center">
        {error}
      </Alert>
    );
  if (reviews.length === 0) return null;

  return (
    <section className="testimonials-section">
      <Container fluid>
        <h2 className="text-center mb-5 fw-bold text-white">
          What Our Customers Say
        </h2>
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          loop={true}
          speed={8000}
          allowTouchMove={false}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
          className="testimonial-swiper-marquee"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={`${review.reviewid}-${index}`}>
              <div className="testimonial-card ">
                {review.profilepictureurl ? (
                  <img
                    src={review.profilepictureurl}
                    alt={review.fullname}
                    className="testimonial-avatar "
                  />
                ) : (
                  <FaUserCircle size={70} className="testimonial-avatar-icon" />
                )}
                <div className="testimonial-rating my-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                    />
                  ))}
                </div>
                <p className="testimonial-quote">"{review.comment}"</p>{" "}
                <h5 className="testimonial-name">{review.fullname}</h5>{" "}
                <p className="testimonial-product-name">
                  on {review.productname}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default CustomerTestimonials;
