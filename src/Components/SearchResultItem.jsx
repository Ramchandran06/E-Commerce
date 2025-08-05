import React from "react";
import { Link } from "react-router-dom";
import "./SearchResultItem.css"; 

const SearchResultItem = ({ product, onResultClick }) => {
  const price = Number(product.Price) || 0;
  const discount = Number(product.DiscountPercentage) || 0;
  const newPrice = Math.round(price * (1 - discount / 100));

  return (
    <Link
      to={`/product/${product.ProductID}`}
      className="search-result-link"
      onClick={onResultClick}
    >
      <div className="search-result-item">
        <img
          src={product.thumbnail}
          alt={product.Name}
          className="search-result-img"
        />
        <div className="search-result-info">
          <p className="search-result-title mb-1">{product.Name}</p>
          <p className="search-result-price mb-0">₹{newPrice}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;
