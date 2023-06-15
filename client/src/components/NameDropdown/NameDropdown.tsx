import { Select } from "@chakra-ui/react";

interface Props {
  onChange: (e: any) => void;
}
const NameDropdown = ({ onChange }: Props) => {
  const nameString = import.meta.env.VITE_ALL_NAMES;
  const names = JSON.parse(nameString);

  return (
    <>
      <Select onChange={onChange}>
        {names.map((name: string) => (
          <option value={name} key={name}>
            {name}
          </option>
        ))}
        {/* <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option> */}
      </Select>
    </>
  );
};
export default NameDropdown;
