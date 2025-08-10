import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import ReactPaginate from "react-paginate"; 

const ProductListPageAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

    
      const response = await axios.get("/api/products", {
        params: { page: currentPage, limit: 10 }, 
      });


      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products.");
      console.error("Fetch Admin Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);


  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(`/api/products/${id}`);
        toast.success(`Product "${name}" deleted successfully!`);
        
        if (currentPage !== 1) {
          setCurrentPage(1);
        } else {
          fetchProducts();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete product.");
      }
    }
  };


  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleView = (product) => setSelectedProduct(product);
  const handleClose = () => setSelectedProduct(null);

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="light" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Products</h1>
        <Link to="/admin/add-product">
          <Button variant="primary">Add New Product</Button>
        </Link>
      </div>

      <Table striped bordered hover variant="dark" responsive>
        <tbody>
          {products.map((product) => (
            <tr key={product.productid}>
              <td>{product.productid}</td>
              <td>
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  style={{ width: "50px" }}
                  rounded
                />
              </td>
              <td>{product.name}</td>
              <td>
                ₹
                {typeof product.price === "number"
                  ? product.price.toLocaleString("en-IN")
                  : "N/A"}
              </td>
              <td>{product.stock}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleView(product)}
                >
                  <FaEye />
                </Button>
                <Link to={`/admin/product/${product.productid}/edit`}>
                  <Button variant="warning" size="sm" className="me-2">
                    <FaEdit />
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.productid, product.name)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            breakLabel={"..."}
            pageCount={totalPages}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link bg-dark text-white border-secondary"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            previousLinkClassName={
              "page-link bg-dark text-white border-secondary"
            }
            nextClassName={"page-item"}
            nextLinkClassName={"page-link bg-dark text-white border-secondary"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link bg-dark text-white border-secondary"}
            disabledClassName={"disabled"}
          />
        </div>
      )}

      {selectedProduct && (
        <Modal show={!!selectedProduct} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <Row>
              <Col md={4}>
                <Image src={selectedProduct.thumbnail} fluid rounded />
              </Col>
              <Col md={8}>
                <h4>Description</h4>
                <p>{selectedProduct.description}</p>
                <hr />
                <p>
                  <strong>Category:</strong> {selectedProduct.category}
                </p>
                <p>
                  <strong>Brand:</strong> {selectedProduct.brand}
                </p>
                <p>
                  <strong>Stock:</strong> {selectedProduct.stock} units
                </p>
                <p>
                  <strong>Price:</strong> ₹
                  {selectedProduct.price
                    ? selectedProduct.price.toLocaleString("en-IN")
                    : "N/A"}
                </p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-white">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProductListPageAdmin;
