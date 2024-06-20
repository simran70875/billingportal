import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { HeaderMain } from "../../components/other/header";
import SidebarMain from "../../components/sidebar/sidebar";
import { Footer } from "../../components/style/Footer.styled";

export default function Layout() {
  return (
    <Box pos={"fixed"} w="100%" h="100%">
      <HeaderMain />

      <Flex w="100%" h="100%">
        <SidebarMain />
        <Box w="100%">
          <Box h="85%">
            <div style={{ height: "100%", overflowY: "scroll" }}>
              <Outlet />
            </div>
          </Box>
          <Footer>Bolling Portal</Footer>
        </Box>
      </Flex>
    </Box>
  );
}
