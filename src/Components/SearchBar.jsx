import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import SearchResultItem from "./SearchResultItem";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setIsSearchActive(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="search-container">
      <Form onSubmit={handleSearchSubmit}>
        <Form.Control
          type="search"
          placeholder="Search products..."
          className={`search-input ${isSearchActive ? "active" : ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <button
        className="search-icon-btn"
        onClick={() => setIsSearchActive(!isSearchActive)}
        type={isSearchActive ? "submit" : "button"}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
