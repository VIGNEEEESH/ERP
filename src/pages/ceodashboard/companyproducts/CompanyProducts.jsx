import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { message } from "antd";
import Modal from "antd/lib/modal/Modal";
import { AuthContext } from "@/pages/auth/Auth-context";

const CompanyProducts = () => {
  const [products, setProducts] = useState([]);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [image, setImage] = useState(null);
  const auth = useContext(AuthContext);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/get/all/products`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        message.error("Error fetching products: " + error.message);
      }
    };

    fetchProducts();
  }, [auth.token]);

  const handleAddProduct = () => {
    setShowAddProducts(true);
  };

  const handleGoBack = () => {
    setShowAddProducts(false);
  };

  const handleUpdateProduct = (product) => {
    setCurrentProduct({
      productName: product.productName,
      productDescription: product.productDescription,
      image: product.image,
      _id: product._id,
    });
    setShowUpdateProduct(true);
  };

  const handleUpdateCancel = () => {
    setShowUpdateProduct(false);
    setCurrentProduct(null);
  };

  const handleProductNameChange = (e) => {
    setCurrentProduct({
      ...currentProduct,
      productName: e.target.value,
    });
  };

  const handleProductDescriptionChange = (e) => {
    setCurrentProduct({
      ...currentProduct,
      productDescription: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleDeleteProduct = (_id, productName) => {
    setShowDeleteModal(true);
    const product = { _id, productName };
    setProductToDelete(product);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/delete/product/byid/${productToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
        message.success("Product successfully deleted");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      message.error("Error deleting product: " + error.message);
    }
  };

  const handleProductSubmit = async () => {
    try {
      const formData = new FormData();
      if (!productName || !productDescription || !image) {
        message.error("Please fill in all fields and upload an image.");
        return;
      }

      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("image", image);

      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/create/product`,
        {
          method: "POST",
          headers: { Authorization: "Bearer " + auth.token },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      message.success("Product created successfully");
      setProductDescription("");
      setProductName("");
      setShowAddProducts(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      message.error(`Failed to create product: ${error.message}`);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      if (!currentProduct.productName || !currentProduct.productDescription) {
        message.error("Please fill in all fields.");
        return;
      }

      formData.append("productName", currentProduct.productName);
      formData.append("productDescription", currentProduct.productDescription);
      if (image) formData.append("image", image);

      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/update/product/byid/${currentProduct._id}`,
        {
          method: "PATCH",
          headers: { Authorization: "Bearer " + auth.token },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      message.success("Product updated successfully");
      setShowUpdateProduct(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      message.error(`Failed to update product: ${error.message}`);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleCloseProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 ml-4">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            Manage Products
          </Typography>
          <div className="flex justify-between items-center">
            <div></div>
            <Button
              onClick={handleAddProduct}
              className="border border-white bg-black text-white hover:bg-blue-700"
            >
              Add Product
            </Button>
          </div>
        </CardHeader>

        <div className="px-4 pb-4 mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product.productName}
              color="transparent"
              shadow={true}
              className="relative transition-transform transform hover:scale-105 hover:shadow-xl rounded-lg"
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              onClick={() => handleCardClick(product)}
            >
              <div className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                <img
                  src={`${import.meta.env.REACT_APP_BACKEND_URL}/${product.image}`}
                  alt={product.productName}
                  className="h-full w-full object-cover rounded-t-lg"
                />
              </div>
              <CardBody className="py-0 px-1 flex flex-col items-center justify-between">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="mt-1 mb-2"
                >
                  {product.productName}
                </Typography>
                <div className="flex mt-2 mb-4"> {/* Adjust the margin here */}
                  <Button
                    className="mr-4 py-1 px-2.5 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateProduct(product);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    className="py-1 px-2.5 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product._id, product.productName);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Card>
      <Modal
        title="Delete Product"
        open={showDeleteModal}
        onOk={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        okButtonProps={{ style: { backgroundColor: "black" } }}
      >
        <p>Are you sure you want to delete this product?</p>
        {productToDelete && (
          <div>
            <p>Product: {productToDelete.productName}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Add Product"
        visible={showAddProducts}
        onCancel={handleGoBack}
        footer={null}
      >
        <div className="p-4">
          <Input
            type="text"
            name="productName"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            label="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="p-4">
          <Textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            name="productDescription"
            label="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>
        <div className="p-4">
          <Input
            type="file"
            name="image"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleImageChange}
          />
        </div>
        <div className="p-4 flex justify-end">
          <Button onClick={handleProductSubmit}>Add Product</Button>
        </div>
      </Modal>

      {/* Modal for updating product */}
      <Modal
        title="Update Product"
        visible={showUpdateProduct}
        onCancel={handleUpdateCancel}
        footer={null}
      >
        <div className="p-4">
          <Input
            type="text"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            label="Enter product name"
            value={currentProduct ? currentProduct.productName : ""}
            onChange={handleProductNameChange}
          />
        </div>
        <div className="p-4">
          <Textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            label="Enter product description"
            value={currentProduct ? currentProduct.productDescription : ""}
            onChange={handleProductDescriptionChange}
          />
        </div>
        <div className="p-4">
          <Input
            type="file"
            name="image"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleImageChange}
          />
        </div>
        <div className="p-4 flex justify-end">
          <Button onClick={handleUpdateSubmit}>Update Product</Button>
        </div>
      </Modal>

      <Modal
        title=""
        visible={showProductDetails}
        onCancel={handleCloseProductDetails}
        footer={null}
      >
        {selectedProduct && (
          <div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {selectedProduct.productName}
            </Typography>
            <Typography variant="body1" className="mb-4">
              {selectedProduct.productDescription}
            </Typography>
            <img
              src={`${import.meta.env.REACT_APP_BACKEND_URL}/${selectedProduct.image}`}
              alt={selectedProduct.productName}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CompanyProducts;
