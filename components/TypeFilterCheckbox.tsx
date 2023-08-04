import React from 'react';

interface Type {
  name: string;
  image: string;
}

interface TypeFilterCheckboxProps {
  type: Type;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TypeFilterCheckbox: React.FC<TypeFilterCheckboxProps> = ({ type, checked, onChange }) => {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-teal-600"
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2">{type.name}</span>
      <img src={type.image} alt={type.name} className="w-5 h-5 ml-1" />
    </label>
  );
};

export default TypeFilterCheckbox;
