import React, { useState } from "react";
import { Icon, Link as ChakraLink, Box } from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { MenuItem, SidebarItems } from "../style/Sidebar.styled";
import { HeaderIcon, HeaderText } from "../style/Header.styled";

export default function SidebarItem(props) {
  const location = useLocation();
  const isActive = location.pathname === props.to;
  const [open, setOpen] = useState(false);
  const handleIconRightClick = () => {
    setOpen(!open);
  };

  return (
    <SidebarItems
      className={`${isActive ? "active" : ""} ${open ? "active" : ""}`}
    >
      <ChakraLink
        display={"flex"}
        alignItems={"flex-start"}
        as={ReactRouterLink}
        to={props.to}
        justifyContent={props.navSize === "small" ? "center" : "flex-start"}
      >
        {props.icon && (
          <HeaderIcon>
            <Icon as={props.icon} fontSize="xl"></Icon>
          </HeaderIcon>
        )}

        <HeaderText
          style={{
            display: props.navSize === "small" ? "none" : "flex",
            marginLeft: props.navSize === "small" ? 0 : 10,
          }}
        >
          {props.title}
        </HeaderText>

        {props.iconRight && (
          <HeaderIcon
            style={{
              textAlign: "end",
              flex: 1,
            }}
            onClick={handleIconRightClick} // Handle icon right click
          >
            <Icon as={props.iconRight} fontSize="l"></Icon>
          </HeaderIcon>
        )}
      </ChakraLink>

      {open && props.dropdownItems && (
        <Box style={{ paddingLeft: 10 }}>
          {props.dropdownItems.map((dropdownItem, index) => (
            <MenuItem style={{ paddingBottom: 5, paddingTop: 5 }} key={index}>
              <ChakraLink
                display={"flex"}
                alignItems={"center"}
                as={ReactRouterLink}
                to={dropdownItem.move}
                justifyContent={
                  props.navSize === "small" ? "center" : "flex-start"
                }
              >
                <HeaderText
                  style={{
                    display: props.navSize === "small" ? "none" : "flex",
                    marginLeft: props.navSize === "small" ? 0 : 10,
                  }}
                >
                  {dropdownItem.item}
                </HeaderText>
              </ChakraLink>
            </MenuItem>
          ))}
        </Box>
      )}
    </SidebarItems>
  );
}
