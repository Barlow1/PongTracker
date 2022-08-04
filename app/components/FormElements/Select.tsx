import InputError from './InputError';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  error: string | null;
  label: string;
  defaultOption?: SelectOption;
}
const Select = ({
  options,
  defaultOption,
  name,
  error,
  label,
  ...rest
}: SelectProps &
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >) => {
  const errorId = `${name}-error`;
  return (
    <>
      <label htmlFor={name}>{label}</label>
      {error ? <InputError id={errorId}>{error}</InputError> : null}
      <select name={name} {...rest}>
        {defaultOption && (
          <option value={defaultOption.value} disabled selected>
            {defaultOption.label}
          </option>
        )}
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
