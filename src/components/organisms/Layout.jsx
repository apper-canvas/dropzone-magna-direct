import React from "react";
import Header from "@/components/organisms/Header";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-primary-100/20 to-primary-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-r from-purple-100/20 to-pink-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-100/20 to-orange-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "4s" }} />
      </div>
    </div>
  );
};

export default Layout;