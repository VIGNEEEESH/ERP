import {
    Card,
    CardBody,
    CardHeader,
    Avatar,
    Typography,
    Tooltip,
  } from "@material-tailwind/react";
  import { Link } from "react-router-dom";
  import { projectsData } from "@/data";
  
  export function ProductDetail() {
    // Assuming you are passing a single project object instead of an array
    const project = projectsData[0];
  
    return (
      <div className="flex flex-wrap mt-8 mx-auto w-full lg:w-4/5 xl:w-3/5">
        <div className="w-full lg:w-1/2 lg:pr-6">
          <div className="overflow-hidden rounded-xl">
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-6">
          <Typography variant="h3" color="blue-gray" className="mb-4">
            {project.title}
          </Typography>
          <Typography variant="small" className="font-normal text-blue-gray-500 mb-4">
            {project.description}
          </Typography>
          <div className="flex flex-wrap items-center mb-4">
            {project.members.map(({ img, name }, key) => (
              <Tooltip key={name} content={name}>
                <Avatar
                  src={img}
                  alt={name}
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
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
              View Project
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  export default ProductDetail;
  