
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea
} from "@material-tailwind/react";
import { message } from "antd";
import { TrashIcon } from "@heroicons/react/24/solid";
import Modal from "antd/lib/modal/Modal";

export function CompanyProducts() {
  const [products, setProducts] = useState([]);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/product/get/all/products`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch attendance data: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.log(error);
        message.error("Error fetching products ", error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setShowAddProducts(true);
  };

  const handleGoBack = () => {
    setShowAddProducts(false);
  };

  const handleUpdateProduct = (product) => {
    setCurrentProduct(product);
    setShowUpdateProduct(true);
  };

  const handleUpdateCancel = () => {
    setShowUpdateProduct(false);
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductDescriptionChange = (e) => {
    setProductDescription(e.target.value);
  };

  const handleProductImageChange = (e) => {
    // Handle file upload
  };

  const handleProductSubmit = () => {
    // Handle product submission
  };

  const handleUpdateSubmit = () => {
    // Handle update submission
    setShowUpdateProduct(false);
    // Perform update operation with productName, productDescription, and productImage
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

        <div className=" px-4 pb-4 mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
          {products.map(
            ({ image, productName, productDescription }) => (
              <Card key={productName} color="transparent" shadow={false}>
                <div className="mx-0 mt-0 mb-4 h-64 xl:h-40">
                  <img
                    src={`http://localhost:4444/${image}`}
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
                    <Button className="mr-4" onClick={() => handleUpdateProduct({ productName, productDescription, image })}>Update</Button>
                    <Button><TrashIcon className="w-4 h-4" /></Button>
                  </div>
                </CardBody>
              </Card>
            )
          )}
        </div>
      </Card>

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
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            label="Enter product name"
            value={productName}
            onChange={handleProductNameChange}
          />
        </div>
        <div className="p-4">
          <Textarea
            className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            label="Enter product description"
            value={productDescription}
            onChange={handleProductDescriptionChange}
          />
        </div>
        <div className="p-4">
          <Input
            type="file"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleProductImageChange}
          />
        </div>
        <div className="p-4 flex justify-end">
          <Button onClick={handleProductSubmit}>
            Add Product
          </Button>
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
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onChange={handleProductImageChange}
          />
        </div>
        <div className="p-4 flex justify-end">
          <Button onClick={handleUpdateSubmit}>
            Update Product
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default CompanyProducts;
