import { BiSearchAlt } from "react-icons/bi";
import { Button, Input, Space } from "antd";
import { useEffect, useState, type ChangeEvent } from "react";

type searchBoxProps = {
  placeholder?: string;
};

export const useSearchBox = ({
  placeholder = "Search...",
}: searchBoxProps = {}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [debounceValue, setdebounceValue] = useState<string>("");

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      setdebounceValue(searchValue);
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchValue]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const SearchBox = () => (
    // <Input.Search
    //   placeholder={placeholder ?? "Search..."}
    //   onChange={handleSearchChange}
    //   allowClear
    //   value={searchValue}
    // />

    <Space.Compact className="w-full">
      <Input
        placeholder={placeholder ?? "Search..."}
        allowClear
        onChange={handleSearchChange}
        className="py-2"
      />
      <Button
        className="bg-transparent text-gray-600 h-full block py-2 "
        icon={<BiSearchAlt />}
      />
    </Space.Compact>
  );

  return { debounceValue, SearchBox };
};
