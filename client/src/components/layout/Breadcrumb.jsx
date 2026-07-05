import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-400 font-medium">
      <Link
        to="/"
        className="flex items-center hover:text-white transition-colors gap-1"
      >
        <Home size={13} className="text-primary" />
        <span className="hidden sm:inline">Workspace</span>
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return (
          <React.Fragment key={name}>
            <ChevronRight size={12} className="text-gray-600" />
            {isLast ? (
              <span className="text-accent font-semibold">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-white transition-colors">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
