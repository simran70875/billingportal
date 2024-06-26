import styled from "styled-components";

export const CardsContainer = styled.section`
  margin: 50px;
`;

export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.quoteBgc};
  border: 1px solid ${({ theme }) => theme.colors.quoteBorder};
  margin-left: auto;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

export const CardTitle = styled.div`
  color: ${({ theme }) => theme.colors.quoteTitle};
  // border-bottom: 1px solid ${({ theme }) => theme.colors.quoteBorder};
  // text-align: center;
  padding: 10px;
  font-weight: bold;
`;

export const CardBody = styled.div`
  color: ${({ theme }) => theme.colors.quoteBody};
  padding: 10px;
  font-family: monospace;
`;
