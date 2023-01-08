import { FC } from "react";
import styled from "styled-components";
import { Search, CloseSquare } from "react-iconly";

interface Props {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}
const SearchInput: FC<Props> = ({ setValue, value }) => {
  const handleClear = () => {
    setValue("");
  };
  return (
    <Style className="search">
      <Search set="bulk" primaryColor="#7B73AE" />
      <input
        type="search"
        value={value}
        placeholder="Search..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
      {value.length > 0 && (
        <button onClick={handleClear} className="none">
          <CloseSquare set="bulk" primaryColor="#7B73AE" />
        </button>
      )}
    </Style>
  );
};

export default SearchInput;

const Style = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 14px;
  input {
    padding-left: 40px;
    width: 100%;
    border: none;
  }
  > svg {
    position: absolute;
    left: 10px;
  }
  button {
    position: absolute;
    right: 5px;
  }
`;
