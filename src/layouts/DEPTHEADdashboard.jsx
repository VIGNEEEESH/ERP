import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import DEPTHEADroutes from "@/DEPTHEADroutes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function DEPTHEADDashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={DEPTHEADroutes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        
        <Routes>
          {DEPTHEADroutes.map(
            ({ layout, pages }) =>
              layout === "depthead/dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

DEPTHEADDashboard.displayName = "/src/layout/DEPTHEADdashboard.jsx";

export default DEPTHEADDashboard;
