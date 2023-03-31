import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import LaunchIcon from "@mui/icons-material/Launch";
import ErrorMessage from "./ErrorMessage";
import { Spacecraft } from "../interfaces/types";
import { TelemetryData } from "../interfaces/types";
import { stat } from "fs";
import LoadingSpinner from "./LoadingSpinner";
import LaunchPayLoadButton from  "./LaunchPayLoadButton"


const StyledButton = styled.button`
  background-color: #6c63ff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-right: 10px;
  &:disabled {
    background-color: #c4c4c4;
    color: #000;
  }
`;


type TelemetryProps = {
    spacecraft?: Spacecraft;
    timerIsZero: boolean;
}

export default function Telemetry(props: TelemetryProps) {
    const [error, setError] = useState<string>("");
    const [telemetry, setTelemetryData] = useState<TelemetryData[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [launchpayload,setlaunchpayload] = useState(false);

    useEffect(() => {
        if (props && props.spacecraft?.spaceCraft_ID) {
            setLoading(true);
            axios.get(`https://localhost:7050/api/SpaceCrafts/GetSpaceCraftById?id=${props.spacecraft.spaceCraft_ID}`)
                .then((response: AxiosResponse<any>) => {
                    axios.get(`https://localhost:7050/api/Communications/GetTelemetry`, { params: { id: props.spacecraft?.spaceCraft_ID } })
                        .then((response: AxiosResponse<any>) => {
                            setTelemetryData(prevTelemetryData => [...response.data, ...prevTelemetryData]);
                        }).catch(error => {
                            setError(error);
                        });
                    if (response.data.state != 2 && response.data.spaceCraftTelemetery == true) {
                        setIsFetching(true);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    setError(error);
                });
        }
    }, [props]);

    const handleStart = () => {
        axios.put(`https://localhost:7050/api/SpaceCrafts/SpaceCraftTelemetry?id=${props.spacecraft?.spaceCraft_ID}&spacecraft=true`)
            .catch((error) => {
                setError(error);
            });
        setIsFetching(true);
    };

    const handleStop = () => {
        axios.put(`https://localhost:7050/api/SpaceCrafts/SpaceCraftTelemetry?id=${props.spacecraft?.spaceCraft_ID}&spacecraft=false`)
            .catch((error) => {
                setError(error);
            });

        setIsFetching(false);
    };


    useEffect(() => {
        let count = 0;
        let intervalId: NodeJS.Timeout;

        if (isFetching) {
            intervalId = setInterval(() => {
                axios
                    .get(`https://localhost:7050/api/Communications/GetTelemetry`, { params: { id: props.spacecraft?.spaceCraft_ID } })
                    .then((response: AxiosResponse<any>) => {
                        setTelemetryData(prevTelemetryData => [...response.data, ...prevTelemetryData]);
                    }).catch(error => {
                        setError(error);
                    });
            }, 10000);
        }

        return () => clearInterval(intervalId);
    }, [isFetching]);

    if (loading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    if (error) {
        return (
            <ErrorMessage />
        );
    }


    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                    <Grid item>
                        <LaunchPayLoadButton isDisabled={!props.timerIsZero} spacecraftid={props.spacecraft?.payloadid ?? ''} />
                    </Grid>
                    <Grid item>
                        {props.spacecraft?.state == 2 ? (
                            <StyledButton disabled={true}>
                                <PlayArrowIcon />
                                Telemetry Data
                            </StyledButton>
                        ) : (
                            isFetching ? (
                                <StyledButton onClick={handleStop} className="StyledButton">
                                    <StopIcon />
                                    Telemetry Data
                                </StyledButton>
                            ) : (
                                <StyledButton onClick={handleStart}>
                                    <PlayArrowIcon />
                                    Telemetry Data
                                </StyledButton>
                            )
                        )}


                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer sx={{ maxHeight: 500, overflow: "scroll" }}>
                        <Table stickyHeader>
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
                                        <TableCell>{data.timeToOrbit}s</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    );
}
