import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { FaGem, FaHeart, FaLightbulb } from "react-icons/fa";
import "./AboutUsPage.css";
import "animate.css";

const AboutUsPage = () => {
  return (
    <>
     
      <div className="about-header-banner">
        <div className="about-banner-content animate__animated animate__fadeIn">
          <h1 className="display-3 fw-bold">Our Story</h1>
          <p className="lead">Crafting trends, weaving traditions.</p>
        </div>
      </div>

      <Container className="my-5 py-5 text-white">
      
        <Row className="align-items-center about-section gy-4">
          <Col md={6} className="animate__animated animate__fadeInLeft">
            <Image
              src="https://images.pexels.com/photos/5868731/pexels-photo-5868731.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Our Mission"
              className="mission-image"
              fluid
            />
          </Col>
          <Col md={6} className="animate__animated animate__fadeInRight">
            <h2>Who We Are</h2>
            <p className="text-white-50">
              SIT Dress Shop was born from a passion for fashion and a desire to
              bring high-quality, stylish apparel to everyone. We believe that
              what you wear is a way to express who you are. Our mission is to
              blend timeless traditional wear with modern western trends,
              offering a unique collection that caters to every taste.
            </p>
            <p className="text-white-50">
              From handpicked sarees to chic contemporary outfits, every piece
              in our store is selected with care, ensuring impeccable quality
              and design.
            </p>
          </Col>
        </Row>

    
        <div className="text-center about-section">
          <h2 className="mb-5">Why Choose Us?</h2>
          <Row className="gy-4">
            <Col md={4} className="animate__animated animate__fadeInUp">
              <div className="value-card">
                <div className="value-icon">
                  <FaGem />
                </div>
                <h4>Premium Quality</h4>
                <p className="text-white-50">
                  We never compromise on quality. Our fabrics are sourced from
                  the best artisans and suppliers to ensure longevity and
                  comfort.
                </p>
              </div>
            </Col>
            <Col
              md={4}
              className="animate__animated animate__fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="value-card">
                <div className="value-icon">
                  <FaLightbulb />
                </div>
                <h4>Unique Designs</h4>
                <p className="text-white-50">
                  Our collection is curated to bring you exclusive designs that
                  you won't find anywhere else. Stay unique, stay stylish.
                </p>
              </div>
            </Col>
            <Col
              md={4}
              className="animate__animated animate__fadeInUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="value-card">
                <div className="value-icon">
                  <FaHeart />
                </div>
                <h4>Customer Love</h4>
                <p className="text-white-50">
                  Your satisfaction is our priority. We are dedicated to
                  providing an exceptional shopping experience from start to
                  finish.
                </p>
              </div>
            </Col>
          </Row>
        </div>

    
        <div className="text-center about-section">
          <h2 className="mb-5">Meet The Founders</h2>
          <Row>
            <Col
              md={6}
              className="team-member-card animate__animated animate__fadeIn"
            >
              <Image
                src="https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Founder 1"
                className="team-member-img"
              />
              <h4>Sathish </h4>
              <p className="text-white-50">Creative Director</p>
            </Col>
            <Col
              md={6}
              className="team-member-card animate__animated animate__fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <Image
                src="https://images.pexels.com/photos/3778603/pexels-photo-3778603.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Founder 2"
                className="team-member-img"
              />
              <h4>Karthikeyan </h4>
              <p className="text-white-50">Head of Operations</p>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default AboutUsPage;
