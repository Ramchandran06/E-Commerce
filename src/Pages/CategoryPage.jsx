import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Breadcrumb,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import FilterSidebar from "../Components/FilterSidebar";
import ReactPaginate from "react-paginate";
import "./CategoryPage.css"; 

const CategoryPage = () => {
  const { categoryName } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("createdAt_desc");

  const fetchProductsByCategory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { category, ...otherFilters } = filters;

      const params = {
        ...otherFilters,
        sortBy,
        page: currentPage,
        limit: 12,
      };

      const response = await axios.get(
        `/api/products/category/${categoryName}`,
        { params }
      );

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      setError(`Failed to fetch products for "${categoryName}".`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryName, filters, sortBy, currentPage]);

  useEffect(() => {
   
    handleClearFilters();
  }, [categoryName]);

  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSortBy("createdAt_desc");
    setCurrentPage(1);
  };

  
  const pageTitle =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <Container className="my-5 py-5">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
          Products
        </Breadcrumb.Item>
        <Breadcrumb.Item className="text-secondary" active>
          {pageTitle}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row className="mt-4">
        <Col lg={3}>
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            disableCategoryFilter={true}
          />
        </Col>

        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-white text-capitalize">{pageTitle}</h2>
            <div className="d-flex align-items-center">
              <span className="text-white-50 me-3">
                {totalProducts} Products Found
              </span>
              <Form.Select
                style={{ width: "200px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
              </Form.Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="light" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <Row xs={1} sm={2} md={3} className="g-4">
                {products.length > 0 ? (
                  products.map((product) => (
                    <Col key={product.productid}>
                      <ProductCard product={product} />
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Alert variant="warning">
                      No products found in "{pageTitle}" matching your criteria.
                    </Alert>
                  </Col>
                )}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <ReactPaginate
                    forcePage={currentPage - 1}
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={totalPages}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={
                      "page-link bg-dark text-white border-secondary"
                    }
                    activeClassName={"active"}
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryPage;
