import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "", style }) => {
  return (
    <div 
      className={`md:px-2 px-2 pb-10 space-y-6 pt-2 font-inter ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
