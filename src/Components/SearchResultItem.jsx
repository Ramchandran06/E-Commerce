import React from "react";
import { Link } from "react-router-dom";
import "./SearchResultItem.css"; 

const SearchResultItem = ({ product, onResultClick }) => {
  const price = Number(product.price) || 0;
  const discount = Number(product.discountpercentage) || 0;
  const newPrice = Math.round(price * (1 - discount / 100));

  return (
    <Link
      to={`/product/${product.productid}`}
      className="search-result-link"
      onClick={onResultClick}
    >
      <div className="search-result-item">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="search-result-img"
        />
        <div className="search-result-info">
          <p className="search-result-title mb-1">{product.name}</p>
          <p className="search-result-price mb-0">₹{newPrice}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;
