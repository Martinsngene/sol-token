import React from "react";
import "./styles.css";

// Interface
interface ButtonPropsI {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, className, onClick, disabled }: ButtonPropsI) => {
  return (
    <button className={`${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
