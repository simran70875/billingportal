import styled from "styled-components";

export const Button = styled.button`
  display: flex;
  vertical-align: center;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  background-color:${({ theme }) => theme.colors.header};
  border-radius: 50%;
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.border};
  padding:5px;
  cursor: pointer;
  &:hover {
    box-shadow: 2px 2px 2px ${({ theme }) => theme.colors.border};
`;

export const ButtonText = styled.p`
  color: ${({ theme }) => theme.colors.quoteTitle};
  font-weight: bold;
  margin-bottom:0px;
  font-family: monospace;
  font-size: 17px;
`;
