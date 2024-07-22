import React from "react";
import "./styles.css";

// Interface
interface ButtonPropsI {
  children: React.ReactNode;
}

const Button = ({ children }: ButtonPropsI) => {
  return <button className="button">{children}</button>;
};

export default Button;
