import type { ElementType, ReactNode, MouseEventHandler } from "react";

export interface IButtonProps {
  children: ReactNode;
  href?: string;
  renderAs?: ElementType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  download?: boolean | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
}

/**
 * Button component that can be rendered as various HTML elements
 * @param {Object} props
 * @param {ReactNode} props.children - The content of the button
 * @param {string} [props.href] - The URL to link to if the button is an anchor
 * @param {ElementType} [props.renderAs] - The HTML element to render the button as
 * @param {"button" | "submit" | "reset"} [props.type="submit"] - The type of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state
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
  loading = false,
  download,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: IButtonProps) => {
  const Component = renderAs ?? "button";
  const isLink = renderAs === "a";
  const targetLink = isLink ? "_blank" : undefined;
  const isDisabled = disabled || loading;

  return (
    <Component
      type={isLink ? undefined : type}
      data-cy="submit"
      className="glitch p-3 m-3 text-white font-medium transition-all duration-300 ease-in-out bg-matrix-dark rounded-sm hover:bg-matrix-dark/80 disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-glow-sm active:shadow-inner border border-matrix/20 hover:border-matrix/40 hover:brightness-110 active:brightness-95 cursor-pointer"
      href={href}
      target={targetLink}
      disabled={isDisabled}
      data-text={children}
      download={download}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 align-middle"
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  );
};

export default Button;
