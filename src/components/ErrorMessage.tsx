import React from "react";
import { Container, Typography } from "@mui/material";
import { AiOutlineWarning } from "react-icons/ai";

export default function ErrorMessage () {
  return (
    <Container>
      <div style={{ textAlign: "center" }}>
        <AiOutlineWarning size={30} style={{ marginRight: "10px" }} />
        <Typography variant="subtitle1" color="error">
          Sorry, there was an error retrieving the data. Please try again later.
        </Typography>
      </div>
    </Container>
  );
};
