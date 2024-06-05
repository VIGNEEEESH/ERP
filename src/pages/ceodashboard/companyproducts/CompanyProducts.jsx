import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea
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
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [image, setImage] = useState(null);
  const auth = useContext(AuthContext);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/get/all/products`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        message.error(`Error fetching products: ${error.message}`);
      }
    };
    fetchProducts();
  }, [auth.token]);

  const handleAddProduct = () => setShowAddProducts(true);
  const handleGoBack = () => setShowAddProducts(false);

  const handleUpdateProduct = (product) => {
    setCurrentProduct(product);
    setShowUpdateProduct(true);
  };

  const handleUpdateCancel = () => {
    setShowUpdateProduct(false);
    setCurrentProduct(null);
  };

  const handleProductNameChange = (e) =>
    setCurrentProduct({ ...currentProduct, productName: e.target.value });
  const handleProductDescriptionChange = (e) =>
    setCurrentProduct({ ...currentProduct, productDescription: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleDeleteProduct = (_id, productName) => {
    setShowDeleteModal(true);
    setProductToDelete({ _id, productName });
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
            Authorization: `Bearer ${auth.token}`
          }
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
      message.error(`Error deleting product: ${error.message}`);
    }
  };

  const handleProductSubmit = async () => {
    if (!productName || !productDescription || !image) {
      message.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("image", image);

    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/create/product`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: formData
        }
      );

      if (!response.ok) throw new Error("Failed to create product");

      message.success("Product created successfully");
      setProductName("");
      setProductDescription("");
      setImage(null);
      setShowAddProducts(false);
      setProducts([...products, await response.json()]);
    } catch (error) {
      message.error(`Failed to create product: ${error.message}`);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!currentProduct.productName || !currentProduct.productDescription) {
      message.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("productName", currentProduct.productName);
    formData.append("productDescription", currentProduct.productDescription);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/update/product/byid/${currentProduct._id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: formData
        }
      );

      if (!response.ok) throw new Error("Failed to update product");

      message.success("Product updated successfully");
      setShowUpdateProduct(false);
      setCurrentProduct(null);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === currentProduct._id ? currentProduct : product
        )
      );
    } catch (error) {
      message.error(`Failed to update product: ${error.message}`);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowDescription(true);
  };

  const handleCloseDescription = () => {
    setShowDescription(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="relative mt-8 h-32 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>

      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 rounded-3xl shadow-xl relative">
        <CardBody className="p-4">
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Our Products
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-500">
              Products and services that we are serving
            </Typography>
          </div>
          <Button
            color="blue"
            buttonType="filled"
            size="lg"
            rounded={false}
            block
            className="mb-4 absolute top-[-30px] right-4"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </CardBody>

        <div className="px-4 pb-4 mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Card
              key={product              .id}
              color="transparent"
              shadow="lg"
              className="cursor-pointer transform hover:scale-105 transition-transform duration-300 relative"
              onClick={() => handleCardClick(product)}
            >
              <div className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                <img
                  src={`${import.meta.env.REACT_APP_BACKEND_URL}/${product.image}`}
                  alt={product.productName}
                  className="h-full w-full object-cover rounded-t-3xl"
                  style={{ maxHeight: "200px" }}
                />
              </div>
              <CardBody className="py-0 px-1 flex flex-col items-center justify-between">
                <Typography variant="h5" color="blue-gray" className="mt-1 mb-2">
                  {product.productName}
                </Typography>
                <div className="flex">
                  <Button
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateProduct(product);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    className="ml-2"
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
        {productToDelete && <p>Product Name: {productToDelete.productName}</p>}
      </Modal>

      <Modal title="Add Product" visible={showAddProducts} onCancel={handleGoBack} footer={null}>
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
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            label="Upload product image"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex justify-end p-4">
          <Button color="blue" onClick={handleProductSubmit}>
            Add Product
          </Button>
        </div>
      </Modal>

      <Modal
        title="Update Product"
        visible={showUpdateProduct}
        onCancel={handleUpdateCancel}
        footer={null}
      >
        <div className="p-4">
          <Input
            type="text"
            name="productName"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            label="Enter product name"
            value={currentProduct?.productName || ""}
            onChange={handleProductNameChange}
          />
        </div>
        <div className="p-4">
          <Textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            name="productDescription"
            label="Enter product description"
            value={currentProduct?.productDescription || ""}
            onChange={handleProductDescriptionChange}
          />
        </div>
        <div className="p-4">
          <Input
            type="file"
            name="image"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            label="Update product image"
            onChange={handleImageChange}
          />
        </div>
        <div className="flex justify-end p-4">
          <Button color="blue" onClick={handleUpdateSubmit}>
            Update Product
          </Button>
        </div>
      </Modal>

      <Modal
        title="Product Description"
        visible={showDescription}
        onCancel={handleCloseDescription}
        footer={null}
      >
        <div className="p-4">
          {selectedProduct && (
            <>
              <Typography variant="h5" color="blue-gray" className="mt-1 mb-2">
                {selectedProduct.productName}
              </Typography>
              <p>{selectedProduct.productDescription}</p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CompanyProducts;

