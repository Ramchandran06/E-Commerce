import React from "react";
import { Link } from "react-router-dom";
import "./FeaturedCategories.css";

const categories = [
  {
    name: "Sarees",
    img: "https://live.staticflickr.com/5549/30694719191_82fbe79f47_b.jpg",
    link: "/category/sarees",
  },
  {
    name: "Kurtis",
    img: "https://mendeserve.com/cdn/shop/articles/Kurta_Designs_for_Men.png?v=1726657366&width=1100",
    link: "/category/kurtis",
  },
  {
    name: "Western Wear",
    img: "https://www.mohifashion.com/cdn/shop/articles/BB_216433_Final_320eb394-2ae4-42e1-91f1-7e342fc976df.jpg?v=1718363593&width=1100",
    link: "/category/western",
  },
];

const FeaturedCategories = () => {
  return (
    <section>
      <h1 className="text-center mb-4 text-light fw-bold">Explore Our Collections</h1>
      <div className="category-grid-container">
        {categories.map((category) => (
          <Link
            to={category.link}
            key={category.name}
            className="category-grid-item"
          >
            <img
              src={category.img}
              alt={category.name}
              className="category-grid-img"
            />
            <div className="category-grid-overlay">
              <div>
                <h3 className="category-grid-title">{category.name}</h3>
                <button className="category-grid-button">Shop Now</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
