import React from 'react';

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const AuthInput = ({ type, placeholder, value, onChange, required = true }: AuthInputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3.5 bg-[#000000] border border-[#2F3336] rounded-md text-[#E7E9EA] placeholder-[#536471] focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] focus:outline-none transition"
      required={required}
    />
  );
};

export default AuthInput;