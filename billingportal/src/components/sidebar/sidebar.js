import { Flex } from "@chakra-ui/react";
import React from "react";
import SidebarItem from "./SidebarItem";
import {
  FiHome,
  FiUserPlus,
  FiUsers,
  FiBook,
  FiSettings,
  FiBarChart,
  FiList,
} from "react-icons/fi";
import { FaAngleDown, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Sidebar } from "../style/Sidebar.styled";
import { Button, ButtonText } from "../style/Button.styled";
import { useSelector } from "react-redux";

export default function SidebarMain() {
  const [navSize, setNavSize] = React.useState("large");
  const role = useSelector((state) => state.auth.role);
  let sidebarItems;
  if (role === "operator") {
    sidebarItems = [
      {
        key: "dashboard",
        iconName: FiHome,
        title: "Dashboard",
        move: "/",
      },
      {
        key: "Sales",
        iconName: FiBarChart,
        title: "Sales reports",
        move: "/sales",
      },
      { key: "Items", iconName: FiBook, title: "Items", move: "/items" },
      {
        key: "Clients",
        iconName: FiUserPlus,
        title: "Clients",
        move: "/clients",
      },
      {
        key: "Bills",
        iconName: FiList,
        title: "Bills",
        move: "/bills",
      },
      {
        key: "Settings",
        iconName: FiSettings,
        title: "Settings",
        move: "/settings",
      },
    ];
  } else {
    sidebarItems = [
      {
        key: "dashboard",
        iconName: FiHome,
        title: "Dashboard",
        move: "/",
      },
      {
        key: "Sales",
        iconName: FiBarChart,
        title: "Sales reports",
        move: "/sales",
      },
      { key: "Items", iconName: FiBook, title: "Items", move: "/items" },
      {
        key: "Operators",
        iconName: FiUsers,
        title: "Operators",
        move: "/operators",
      },
      {
        key: "Clients",
        iconName: FiUserPlus,
        title: "Clients",
        move: "/clients",
      },
      {
        key: "Bills",
        iconName: FiList,
        title: "Bills",
        move: "/bills",
      },
      {
        key: "Settings",
        iconName: FiSettings,
        title: "Settings",
        move: "/settings",
      },
    ];
  }
  return (
    <Sidebar>
      <Flex
        p={2}
        w={navSize === "small" ? "70px" : "230px"}
        h="100%"
        flexDir="column"
      >
        <Flex justifyContent={"flex-end"}>
          <Button
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              if (navSize === "small") {
                setNavSize("large");
              } else {
                setNavSize("small");
              }
            }}
          >
            {navSize === "small" ? (
              <ButtonText>
                <FaArrowRight size={10} />
              </ButtonText>
            ) : (
              <ButtonText>
                <FaArrowLeft size={10} />
              </ButtonText>
            )}
          </Button>
        </Flex>

        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            icon={item.iconName}
            iconRight={item.dropdownItems && FaAngleDown}
            navSize={navSize}
            to={item.move}
            dropdownItems={item.dropdownItems}
          />
        ))}
      </Flex>
    </Sidebar>
  );
}
