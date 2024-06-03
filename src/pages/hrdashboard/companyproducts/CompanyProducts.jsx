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

export function CompanyProducts() {
  const [products, setProducts] = useState([]);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [image, setImage] = useState("");
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
      _id: product._id
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
      productName: e.target.value
    });
  };

  const handleProductDescriptionChange = (e) => {
    setCurrentProduct({
      ...currentProduct,
      productDescription: e.target.value
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
            Authorization: "Bearer " + auth.token
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
      message.error("Error deleting product: " + error.message);
    }
  };

  const handleProductSubmit = async () => {
    try {
      const formData = new FormData();
      const emptyFields = [];
      if (!productName) emptyFields.push("productName");
      if (!productDescription) emptyFields.push("productDescription");
      if (!image) emptyFields.push("image");

      if (emptyFields.length > 0) {
        const errorMessage = `Please fill in the following fields: ${emptyFields.join(", ")}`;
        message.error(errorMessage);
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
          body: formData
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
      const emptyFields = [];
      if (!currentProduct.productName) emptyFields.push("productName");
      if (!currentProduct.productDescription) emptyFields.push("productDescription");
      if (image && !image.name) emptyFields.push("image");

      if (emptyFields.length > 0) {
        const errorMessage = `Please fill in the following fields: ${emptyFields.join(", ")}`;
        message.error(errorMessage);
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
          body: formData
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

  return (
    <>
      <div className="relative mt-8 h-32 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>

      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Our Products
            </Typography>
            <Typography variant="small" className="font-normal text-blue-gray-500">
              Products and services that we are serving
            </Typography>
            <div className=" flex justify-between items-center">
              <div></div>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </CardBody>

        <div className="px-4 pb-4 mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
          {products.map(({ image, productName, productDescription, _id }) => (
            <Card key={productName} color="transparent" shadow={false}>
              <div className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                <img
                  src={`${import.meta.env.REACT_APP_BACKEND_URL}/${image}`}
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardBody className="py-0 px-1 flex flex-col items-center justify-between">
                <Typography variant="h5" color="blue-gray" className="mt-1 mb-2">
                  {productName}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  {productDescription}
                </Typography>
                <div className="flex mt-4">
                  <Button
                    className="mr-4"
                    onClick={() =>
                      handleUpdateProduct({ productName, productDescription, image, _id })
                    }
                  >
                    Update
                  </Button>
                  <Button onClick={() => handleDeleteProduct(_id, productName)}>
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
            <p>Product Name: {productToDelete.productName}</p>
          </div>
        )}
      </Modal>
      {/* Modal for adding product */}
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
    </>
  );
}

export default CompanyProducts;
