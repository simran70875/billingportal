import styled from "styled-components";

export const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.footer};
  text-align: center;
  color: ${({ theme }) => theme.colors.footerText};
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.borderTop};
  a {
    color: ${({ theme }) => theme.colors.link};
    padding-left: 7px;
    font-weight: 700;
    text-decoration: underline;
  }
`;
