import InputError from "./InputError";

export interface FieldProps {
  name: string;
  type: string;
  label: string;
  error?: string | null;
  disabled?: boolean;
}

export default function Field({
  name,
  type,
  error,
  label,
  disabled,
  ...rest
}: FieldProps &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >) {
  const errorId = `${name}-error`;
  const getInputByType = (type: string) => {
    switch (type) {
      case 'textarea':
        return <textarea disabled={disabled} name={name}></textarea>;
        break;
      default:
        return <input {...rest} disabled={disabled} name={name} type={type} />;
    }
  };
  const input = getInputByType(type);
  return (
    <>
      <label htmlFor={name}>{label}</label>
      {error ? <InputError id={errorId}>{error}</InputError> : null}
      {input}
    </>
  );
}
