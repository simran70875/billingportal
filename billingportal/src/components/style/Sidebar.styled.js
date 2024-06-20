import styled from "styled-components";

export const Sidebar = styled.div`
  background-color: ${({ theme }) => theme.colors.sidebar};
  text-align: center;
  font-weight: bold;
  height: 100%;
`;

export const SidebarItems = styled.div`
  color: hsl(0, 0%, 100%);
  padding: 10px;
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.header};
    text-decoration: none !important;
    padding: 10px;
    width: 100%;
    margin-top: 10px;
    border-radius: 10px;
  }
`;
export const MenuItem = styled.div`
  color: hsl(0, 0%, 100%);
  padding: 10px;
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none !important;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.header};
    text-decoration: none !important;
    padding: 10px;
    width: 100%;
    margin-top: 10px;
    border-radius: 10px;
  }
`;
