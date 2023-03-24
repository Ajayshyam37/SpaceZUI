import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material"

import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Telemtry from "../components/Telemetry";
import PayLoadData from "../components/PayLoadData";
import Telemetry from "../components/Telemetry";

const Heading1 = styled.h3`
  font-size: 1.5rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Button = styled(Link)`
  display: inline-block;
  color: #000;
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  position: absolute;
  top: 20px;
  left: 20px;
`;

function Communications() {
    interface Communications {
        spaceCraft_ID: number;
        name: string;
        state: number;
        commType: number;
        payloadType: number;
        orbitRadius :number;
    }

    const [communications, setCommunications] = useState<Communications>();
    const { spaceCraft_ID } = useParams();
    useEffect(() => {
        axios
            .get("https://localhost:7050/Communications/" + spaceCraft_ID)
            .then((response: AxiosResponse<any>) => {
                const data = response.data;
                const formattedData: Communications = {
                    spaceCraft_ID: data.spaceCraft_ID,
                    name: data.name,
                    state: data.state,
                    commType: data.commType,
                    payloadType: data.payloadType,
                    orbitRadius:data.orbitRadius,
                };
                setCommunications(formattedData);
            });
    }, []);
    return (
        <>
            <Container>
                <Button to="/">Missons</Button>
                <Heading1>Communications</Heading1>
                <Grid spacing={2}>
                    <Grid item xs={6} sm={6} md={6}>
                        <Typography variant="h5">{communications?.name}</Typography>
                        <Typography variant="h5">Orbit Radius:{communications?.orbitRadius}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                    <Telemetry/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Communications;
