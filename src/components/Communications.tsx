import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Telemetry from "./Telemetry";
import PayLoad from "./PayLoadData";
import ErrorMessage from "./ErrorMessage";

const Heading1 = styled.h3`
  font-size: 1.5rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Button1 = styled(Link)`
  display: inline-block;
  color: #000;
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const Button2 = styled.button<{ isActive: boolean }>`
  display: inline-block;
  color: ${(props) => (props.isActive ? "#fff" : "#000")};
  background-color: ${(props) => (props.isActive ? "#000" : "transparent")};
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  margin-right: 20px;
  border: none;
  &:hover {
    cursor: pointer;
    background-color: #000;
    color: #fff;
  }
`;

export default function Communications() {
    const [error, setError] = useState<string>("");
    const [view, setView] = useState<"telemetry" | "payload">("telemetry"); // default view is telemetry
    const location = useLocation();
    
    const handleTelemetryClick = () => {
        setView("telemetry");
    };

    const handlePayloadClick = () => {
        setView("payload");
    };

    if (error) {
        return (
            <ErrorMessage />
        );
    }
    return (
        <>
            <Container>
                <Button1 to="/">Misson Control</Button1>
                <Heading1>Communications</Heading1>
                <Typography variant="h5">{location.state?.name}</Typography>
                <br />
                <Grid container>
                    <Grid item xs={12}>
                        <Button2
                            onClick={handleTelemetryClick}
                            isActive={view === 'telemetry'}
                            style={{
                                marginRight: '10px',
                                backgroundColor: view === 'telemetry' ? '#FFFFFF' : '#f0f0f0',
                                color: view === 'telemetry' ? '#000000' : '#707070',
                            }}
                        >
                            <Typography>Telemetry</Typography>
                        </Button2>
                        <Button2
                            onClick={handlePayloadClick}
                            isActive={view === 'payload'}
                            style={{
                                backgroundColor: view === 'payload' ? '#FFFFFF' : '#f0f0f0',
                                color: view === 'payload' ? '#000000' : '#707070',
                            }}
                        >
                            <Typography>Payload</Typography>
                        </Button2>
                    </Grid>
                </Grid>
                <br />
                {view === 'telemetry' && <Telemetry spacecraft={location.state} />}
                {view === 'payload' && <PayLoad communications={location.state} />}
            </Container>
        </>
    );

}
