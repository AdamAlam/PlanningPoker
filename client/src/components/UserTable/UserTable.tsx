import {
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

interface UserTableProps {
  userData: {
    name: string;
    points?: number | string | null;
  }[];
  pointsShown?: boolean;
}
const UserTable = ({ userData, pointsShown = false }: UserTableProps) => (
  <TableContainer>
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th minW="30%">Name</Th>
          <Th>Estimated Points</Th>
        </Tr>
      </Thead>
      <Tbody>
        {userData &&
          userData.map((user) => (
            <Tr key={user.name}>
              <Td>{user.name}</Td>
              <Td>
                {pointsShown
                  ? user.points || <Spinner size="sm" />
                  : user.points
                  ? "✅"
                  : "❌"}
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default UserTable;
