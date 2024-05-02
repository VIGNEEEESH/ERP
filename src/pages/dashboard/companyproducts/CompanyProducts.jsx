import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { projectsData } from "@/data";
import { message } from "antd";

export function CompanyProducts() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [products, setProducts] = useState([]);

  const handleViewProject = (product) => {
    setSelectedProject(product);
  };

  const handleGoBack = () => {
    setSelectedProject(null);
  };

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

  return (
    <>
      <div className="relative mt-8 h-32 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      {selectedProject ? (
        <div className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
          <Button onClick={handleGoBack} className="mt-4 ml-4">
            Go Back
          </Button>
          {/* Render individual project details */}
          <IndividualProject project={selectedProject} />
        </div>
      ) : (
        <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
          <CardBody className="p-4">
            <div className="px-4 pb-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Our Products
              </Typography>
              <Typography
                variant="small"
                className="font-normal text-blue-gray-500"
              >
                Products and services that we are serving
              </Typography>
              <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
                {products.map(
                  ({ image, productName, productDescription }) => (
                    <Card key={productName} color="transparent" shadow={false}>
                      <CardHeader
                        floated={false}
                        color="gray"
                        className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                      >
                        <img
                          src={`http://localhost:4444/${image}`}
                          
                          className="h-full w-full object-cover"
                        />
                      </CardHeader>
                      <CardBody className="py-0 px-1">
                        {/* <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500"
                        >
                          {tag}
                        </Typography> */}
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="mt-1 mb-2"
                        >
                          {productName}
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500"
                        >
                          {productDescription}
                        </Typography>
                      </CardBody>
                      <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                        {/* <Button
                          variant="outlined"
                          size="sm"
                          onClick={() =>
                            handleViewProject({
                              image,
                              productName,
                              productDescription,
                              
                            })
                          }
                        >
                          view project
                        </Button> */}
                        {/* <div>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </div> */}
                      </CardFooter>
                    </Card>
                  )
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
}

// IndividualProject component to render the details of the selected project
const IndividualProject = ({ product }) => {
  return (
    <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 flex flex-wrap items-center">
      <div className="w-full lg:w-1/2 p-4">
        <CardHeader
          floated={false}
          color="gray"
          className="mx-auto mb-4 h-64 w-64 xl:h-40"
        >
          <img
            src={product.img}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </CardHeader>
      </div>
      <div className="w-full lg:w-1/2 p-4">
        <div>
          <Typography variant="h3" color="blue-gray" className="mb-4">
            {product.productName}
          </Typography>
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500 mb-4"
          >
            {product.productDescription}
          </Typography>
          <div className="flex flex-wrap items-center mb-4">
            {product.members.map(({ image, productDescription }, key) => (
              <Tooltip key={productDescription} content={productDescription}>
                <Avatar
                  src={image}
                  alt={productDescription}
                  size="sm"
                  variant="circular"
                  className={`cursor-pointer border-2 border-white ${
                    key === 0 ? "" : "-ml-2.5"
                  }`}
                />
              </Tooltip>
            ))}
          </div>
          <Link to={project.route}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
              View Project
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CompanyProducts;
