import React from "react";

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = "", style, ...props }) => {
  return (
    <div 
      className={`md:px-2 px-2 pb-10 space-y-6 pt-2 font-inter ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
