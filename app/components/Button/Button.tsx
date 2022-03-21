
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
export const Button = ({
  children,
  className,
  color,
  disabled,
  type,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type ?? 'button'}
      disabled={disabled}
      className={`
      ${color === "green" && "bg-green-500 border-green-500"} 
      ${color === "blue" && "bg-blue-500 border-blue-500"}
      ${!color && !disabled && " hover:bg-gray-300 dark:hover:bg-gray-500"}
      ${!disabled && "hover:border-gray-500 hover:dark:border-gray-100"}
       font-bold py-2 px-4 rounded-full border-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
