import type { ElementType, ReactNode, MouseEventHandler } from "react";

export interface IButtonProps {
  children: ReactNode;
  href?: string;
  renderAs?: ElementType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  download?: boolean | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Button component for rendering a button or link
 * @param {IButtonProps} props - The props for the Button component
 * @param {ReactNode} props.children - The content of the button
 * @param {string} [props.href] - The URL for the link (if renderAs is "a")
 * @param {ElementType} [props.renderAs] - The element type to render as (e.g., "a" for link)
 * @param {"button" | "submit" | "reset"} [props.type="submit"] - The type of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean | string} [props.download] - The download attribute for the link
 * @param {MouseEventHandler<HTMLButtonElement>} [props.onClick] - The click event handler
 * @returns {JSX.Element} The rendered Button component
 */
const Button = ({
  children,
  href,
  renderAs,
  type = "submit",
  disabled = false,
  download,
  onClick,
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
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
