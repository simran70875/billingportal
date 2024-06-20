import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { FaAngleDown, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Header,
  HeaderText,
  HeaderIcon,
} from "../style/Header.styled";
import imagesPath from "./imagePaths";
import Logout from "../../hooks/logout";

export function HeaderMain() {
  const userId = useSelector((state) => state.auth.userid);
  const role = useSelector((state) => state.auth.role);
  const handleLogout  = Logout();

  return (
    <Header>
      <Flex>
        <Flex alignItems={"center"} paddingLeft={2}>
          <img
            style={{ objectFit: "contain", width: 100, height: 80 }}
            alt="logo"
            src={imagesPath.logo}
          />
        </Flex>

        <Flex flex={1} alignItems={"center"} justifyContent={"flex-end"}>
          <Spacer flex={0} px={"5px"} />
          {/* <Avatar size="sm" src="avatar-1.jpg" /> */}
          <Stack mx={4} gap={0}>
            <HeaderText>{userId}</HeaderText>
            <HeaderText>{role}</HeaderText>
          </Stack>

          <Menu>
            <HeaderIcon>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FaAngleDown />}
                variant="unstyled"
              />
            </HeaderIcon>

            <MenuList>
              {/* <MenuItem icon={<FaUser />}>Profile</MenuItem> */}
              <MenuItem onClick={handleLogout} icon={<FaSignOutAlt />}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Header>
  );
}
