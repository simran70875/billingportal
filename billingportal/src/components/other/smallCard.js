import { Box, Text } from "@chakra-ui/react";
import { Card, CardBody, CardTitle } from "../style/Cards.styled.js";

export function SmallCard(props) {
  return (
    <Box>
      <Card>
        <CardTitle>{props.title}</CardTitle>
        <CardBody>
          <Text fontSize={20} fontWeight={"700"}>
            {props.value}
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
