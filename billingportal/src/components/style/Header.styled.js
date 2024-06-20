import styled from "styled-components";

export const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.header};
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  height: 10%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderBottom};
`;

export const HeaderText = styled.div`
  color: ${({ theme }) => theme.colors.quoteTitle};
  font-weight: bold;
  font-family: monospace;
  text-transform: capitalize;
`;

export const HeaderLogo = styled.h1`
  color: ${({ theme }) => theme.colors.quoteTitle};
  font-family: monospace;
  font-size: 20px;
`;
export const HeaderIcon = styled.div`
  color: ${({ theme }) => theme.colors.quoteTitle};
`;
export const HeaderInput = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 50%;
  border-radius: 20px;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.quoteTitle};
`;
