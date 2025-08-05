import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import HeroSection from "../Components/HeroSection";
import FeaturedCategories from "../Components/FeaturedCategories";
import NewArrivals from "../Components/NewArrivals";
import DealOfTheDay from "../Components/DealOfTheDay";
import CustomerTestimonials from "../Components/CustomerTestimonials";

const Homepage = () => {
  return (
    <>
      <HeroSection />

      <Container className="my-5">
        <FeaturedCategories />

        <hr className="my-5" />

        <NewArrivals />

        <hr className="my-5" />

        <DealOfTheDay />

        <hr className="my-5" />

        <CustomerTestimonials />
      </Container>
    </>
  );
};

export default Homepage;
