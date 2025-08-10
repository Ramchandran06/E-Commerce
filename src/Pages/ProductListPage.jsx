import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import ProductCard from "../Components/ProductCard";
import FilterSidebar from "../Components/FilterSidebar";
import ReactPaginate from "react-paginate";
import axios from "axios";
import "./ProductListPage.css";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("createdAt_desc");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { ...filters, sortBy, page: currentPage, limit: 12 };

      const response = await axios.get("/api/products", { params });

        const formattedProducts = response.data.products.map((product) => ({
          ...product,
          price: Number(product.price), 
        }));
         setProducts(formattedProducts);

       setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Could not load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  return (
    <Container className="my-5 py-5">
      <Row className="me-2 ">
        <Col lg={3}>
          <FilterSidebar
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </Col>

        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 text-white">Our Products</h2>
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
                  No products match your current filters.
                </Alert>
              </Col>
            )}
          </Row>

          {totalPages > 1 && (
            <ReactPaginate
              forcePage={currentPage - 1}
              previousLabel={"< Previous"}
              nextLabel={"Next >"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center mt-5"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPage;
