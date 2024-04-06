import { Box, Container } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { string, node } from "prop-types";

function Section({ bgColor, children }: { bgColor: string, children: any }) {
  return (
    <Box component="section" flex={1} bgcolor={bgColor}>
      <Box marginY={2}>
        <Container>{children}</Container>
      </Box>
    </Box>
  );
}

Section.propTypes = {
  bgColor: string,
  children: node.isRequired
};

Section.defaultProps = {
  bgColor: blueGrey[100]
};

export default Section;
