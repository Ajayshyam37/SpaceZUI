import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Container, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

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
    interface TelemetryData {
        id:string;
        altitude: string;
        longitude: string;
        latitude: string;
        temperature: string;
        timeToOrbit: string;
    }

    interface Communications {
        spaceCraft_ID: number;
        name: string;
        state: number;
        commType: number;
        payloadType: number;
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
                };
                setCommunications(formattedData);
            });
    }, []);

    const [telemetry, setTelemetryData] = useState<TelemetryData[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get("https://localhost:7050/Communications/GetTelmentry/" + spaceCraft_ID)
                .then((response: AxiosResponse<any>) => {
                    setTelemetryData(prevTelemetryData => [...prevTelemetryData, ...response.data]);
                    console.log(response.data);
                });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Container>
                <Button to="/">Missons</Button>
                <Heading1>Communications</Heading1>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h5">{communications?.name}</Typography>
                        <Typography variant="body1">Communication Type: {communications?.commType}</Typography>
                        <Typography variant="body1">PayLoad Type: {communications?.payloadType}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Altitude</TableCell>
                                        <TableCell>Longitude</TableCell>
                                        <TableCell>Latitude</TableCell>
                                        <TableCell>Temperature</TableCell>
                                        <TableCell>Time to Orbit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {telemetry.map((data) => (
                                        <TableRow key={data.id}>
                                            <TableCell>{data.altitude}</TableCell>
                                            <TableCell>{data.longitude}</TableCell>
                                            <TableCell>{data.latitude}</TableCell>
                                            <TableCell>{data.temperature}</TableCell>
                                            <TableCell>{data.timeToOrbit}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Communications;
