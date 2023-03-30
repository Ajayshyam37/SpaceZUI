import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import LaunchIcon from "@mui/icons-material/Launch";
import ErrorMessage from "./ErrorMessage";
import { Spacecraft } from "../interfaces/types";
import {TelemetryData} from "../interfaces/types";

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
}

export default function Telemetry(props: TelemetryProps) {
    const [error, setError] = useState<string>("");
    const [telemetry, setTelemetryData] = useState<TelemetryData[]>([]);
    const [launchStatus, setPayloadStatus] = useState<boolean>(false); // state for payload status
    const [isFetching, setIsFetching] = useState(false);

    const handleStart = () => {
        setIsFetching(true);
    };

    const handleStop = () => {
        setIsFetching(false);
    };


    useEffect(() => {
        let count = 0;
        let intervalId: NodeJS.Timeout;

        if (isFetching) {
            intervalId = setInterval(() => {
                axios
                    .get(`https://localhost:7050/Communications/GetTelemetry`, { params: { id: props.spacecraft?.spaceCraft_ID } })
                    .then((response: AxiosResponse<any>) => {
                        setTelemetryData(prevTelemetryData => [...response.data,...prevTelemetryData]);
                        // check if timeToOrbit is 0 to set payload status
                        if (response.data[0]?.timeToOrbit === "0") {
                            console.log("true");
                            setPayloadStatus(true);
                        } else {
                            setPayloadStatus(false);
                        }
                    }).catch(error => {
                        setError(error);
                    });
                count++;
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [isFetching]);


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
                        <StyledButton disabled={!launchStatus}>
                            <LaunchIcon />
                            Launch Payload
                        </StyledButton>
                    </Grid>
                    <Grid item>
                        {isFetching ? (
                            <StyledButton onClick={handleStop} className="StyledButton"><StopIcon />Telemetry Data</StyledButton>
                        ) : (
                            <StyledButton onClick={handleStart}> <PlayArrowIcon />Telemetry Data</StyledButton>
                        )}
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ maxHeight: 500, overflow: "scroll" }}>
                <TableContainer>
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
                                    <TableCell>{data.timeToOrbit}</TableCell>
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
