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
 * Button component that can be rendered as various HTML elements
 * @param {Object} props
 * @param {ReactNode} props.children - The content of the button
 * @param {string} [props.href] - The URL to link to if the button is an anchor
 * @param {ElementType} [props.renderAs] - The HTML element to render the button as
 * @param {"button" | "submit" | "reset"} [props.type="submit"] - The type of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean | string} [props.download] - Specifies that the target will be downloaded when clicked
 * @param {MouseEventHandler<HTMLButtonElement>} [props.onClick] - Click event handler
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
