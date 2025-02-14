import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
const About = "./pages/Footer/About";
const Blog = "./pages/Footer/Blog";
const License = "./pages/Footer/License";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          by{" "}
          <a
            href="https://thecorrectsteps.com/"
            target="_blank"
            className="transition-colors hover:text-blue-500 font-bold"
          >
            Correct Steps Consultancy LLp
          </a>{" "}
          for a better web.
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  routes: [
    { name: "About Us", path: About },
    { name: "Blog", path: Blog },
    { name: "License", path: License  },
  ],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
