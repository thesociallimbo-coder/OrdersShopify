import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className = "", variant = "primary", ...props }: Props) {
  const variants = {
    primary: "bg-accent text-white border-accent hover:bg-blue-700",
    secondary: "bg-white text-gray-900 border-gray-300 hover:bg-gray-50",
    danger: "bg-white text-red-700 border-red-300 hover:bg-red-50"
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
