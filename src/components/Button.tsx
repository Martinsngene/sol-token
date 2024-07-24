import React from "react";
import "./styles.css";

// Interface
interface ButtonPropsI {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className }: ButtonPropsI) => {
  return <button className={`${className}`}>{children}</button>;
};

export default Button;
