import React from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = () => {
  const location = useLocation();

  const navigationItems = [
    { path: "/", label: "Upload", icon: "Upload" },
    { path: "/files", label: "File Manager", icon: "FolderOpen" }
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <ApperIcon name="CloudUpload" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                DropZone
              </h1>
              <p className="text-xs text-slate-500 -mt-1">File Upload Manager</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700"
                      initial={false}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              className="text-slate-600"
            >
              Menu
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon="HelpCircle"
              className="text-slate-600"
            >
              Help
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon="Settings"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-200">
        <nav className="flex">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "text-primary-700 bg-primary-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;