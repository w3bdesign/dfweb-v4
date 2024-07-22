import type { ElementType, ReactNode } from "react";

export interface IButtonProps {
  children: ReactNode;
  href?: string;
  renderAs?: ElementType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  download?: boolean | string;
}

const Button = ({
  children,
  href,
  renderAs,
  type = "submit",
  disabled = false,
  download,
  ...props
}: IButtonProps) => {
  const Component = renderAs ?? "button";
  const isLink = renderAs === "a";
  const targetLink = isLink ? "_blank" : undefined;

  return (
    <Component
      type={isLink ? undefined : type}
      data-cy="submit"
      className="glitch p-3 m-3 text-primaryButtonText transition duration-500 ease-in-out bg-emerald-700 rounded hover:shadow-outline hover:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
      href={href}
      target={targetLink}
      disabled={disabled}
      data-text={children}
      download={download}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
