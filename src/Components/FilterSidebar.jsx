import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaStar } from "react-icons/fa";
import "./FilterSidebar.css"; 

const FilterSidebar = ({ onFilterChange, onClearFilters, disableCategoryFilter = false}) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

 
  useEffect(() => {
    axios
      .get("/api/products/categories/all")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Could not fetch categories", err));
  }, []);

  const handleApply = () => {
    onFilterChange({
      category: selectedCategory || undefined, 
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      rating: selectedRating || undefined,
    });
  };

 
  const handleClear = () => {
    setSelectedCategory("");
    setPriceRange([0, 50000]);
    setSelectedRating(0);
    onClearFilters();
  };

  return (
    <div className="filter-sidebar">
      <div className="d-flex justify-content-between align-items-center ">
        <h4 className="filter-title mb-0">Filters</h4>
        <Button variant="outline-secondary" size="sm" onClick={handleClear}>
          Clear All
        </Button>
      </div>
      <hr />
      {!disableCategoryFilter && (
      <div className="filter-section">
        <h5 className="filter-title">Category</h5>
        <div className="category-pills">
          <div
            className={`category-pill ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            All
          </div>
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`category-pill ${
                selectedCategory === cat.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>
      )}
      <hr />
      <div className="filter-section">
        <h5 className="filter-title">Price Range</h5>
        <Slider
          range
          min={0}
          max={50000}
          step={100}
          value={priceRange}
          onChange={(value) => setPriceRange(value)}
        />
        <div className="d-flex justify-content-between mt-2">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
      <hr />
      <div className="filter-section">
        <h5 className="filter-title">Rating</h5>
        <div className="rating-checks">
          {[4, 3, 2, 1].map((star) => (
            <Form.Check
              key={star}
              type="radio"
              id={`star-${star}`}
              label={
                <>
                  {" "}
                  <FaStar color="#ffc107" className="mb-1" /> {`${star} & up`}
                </>
              }
              name="rating"
              checked={selectedRating === star}
              onChange={() => setSelectedRating(star)}
            />
          ))}
        </div>
      </div>
      <div className="d-grid mt-4">
        <Button variant="primary" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;
