import { Select } from "@chakra-ui/react";

interface Props {
  onChange: (e: any) => void;
}
const NameDropdown = ({ onChange }: Props) => {
  const nameString = import.meta.env.VITE_ALL_NAMES;
  const names = JSON.parse(nameString);

  return (
    <>
      <Select onChange={onChange} placeholder="Select Name">
        {names.map((name: string) => (
          <option value={name} key={name}>
            {name}
          </option>
        ))}
      </Select>
    </>
  );
};
export default NameDropdown;
