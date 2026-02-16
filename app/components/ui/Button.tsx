"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "neon" | "white";
  width?: string;
}

export default function Button({
  children,
  variant = "primary",
  width = "w-auto",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-bold shadow-lg transition-all duration-300 " +
    "hover:scale-[1.02] disabled:cursor-not-allowed flex items-center justify-center ";

  const variantClasses =
    variant === "danger"
      ? "bg-gradient-to-r from-[#FF3A3A] to-[#FF6B6B] hover:shadow-[0_0_20px_#FF6B6B] rounded-[0.35rem] border-2 border-[#FF6B6B] ring-1 ring-[#FF6B6B]"
      : variant === "neon"
      ? "bg-[#00FF00] text-black font-semibold relative mt-[5px] mb-[5px] rounded-[18px] overflow-hidden border border-transparent hover:border-[#00FF00] before:absolute before:inset-[2px] before:bg-[#00FF00] before:rounded-[12px] before:z-[1] hover:before:bg-[#00FF00] after:absolute after:inset-0 after:bg-[#ffffff] after:rounded-[10px] after:z-0"
      : variant === "white"
      ? "bg-white text-black hover:bg-gray-50 rounded-[0.35rem] shadow-sm"
      : "bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] text-[#FFFFFF] hover:shadow-[0_0_20px_#3A8DFF] rounded-[0.35rem] border-1 border-[#7B61FF] ring-1 ring-[#7B61FF]";
  const innerSpanClasses = `relative z-10 ${
    variant === "neon"
      ? "px-[15px] py-[8px] text-[15px]"
      : variant === "white"
      ? "px-[32px] py-[13px]"
      : "px-[32px] py-[12px]"
  } font-['Orbitron'] flex items-center justify-center`;
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${width} ${className}`}
      style={{ fontSize: "1.125rem" }}
    >
      <span className={innerSpanClasses}>{children}</span>
    </button>
  );
}
