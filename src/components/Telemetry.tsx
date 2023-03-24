import {Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material"
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Telemetry()
{
    const [telemetry, setTelemetryData] = useState<TelemetryData[]>([]);
    const [launchStatus, setPayloadStatus] = useState<boolean>(false); // state for payload status
    const [isRunning, setIsRunning] = useState(true);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    
    interface TelemetryData {
        id: string;
        altitude: string;
        longitude: string;
        latitude: string;
        temperature: string;
        timeToOrbit: string;
    }

    const { spaceCraft_ID } = useParams();
    
    useEffect(() => {
        let count = 0;
        const id = setInterval(() => {
            axios.get(`https://localhost:7050/Communications/GetTelmentry/${spaceCraft_ID}?count=${count}`)
                .then((response: AxiosResponse<any>) => {
                    setTelemetryData(prevTelemetryData => [...prevTelemetryData, ...response.data]);
                    
                    // check if timeToOrbit is 0 to set payload status
                    if (response.data[0]?.timeToOrbit === "0") {
                        console.log("true");
                        setPayloadStatus(true);
                    } else {
                        setPayloadStatus(false);
                    }
                });
            count++;
        }, 5000);
        setIntervalId(id);
        return () => clearInterval(id);
    }, []);

    const stopApiCall = () => {
        setIsRunning(false);
        if(intervalId !== null) {
            clearInterval(intervalId);
        }
    }

    const startApiCall = () => {
        setIsRunning(true);
    }
    
    return (
        <>
        <Grid item md={6} alignItems="">
            <Button variant="contained" color="primary" disabled={!launchStatus}>Launch Payload</Button>
            {isRunning ? <Button variant="contained" color="primary" onClick={stopApiCall}>Stop Telemetry</Button> : <Button variant="contained" color="primary" onClick={startApiCall}>Start Telemetry</Button>}
        </Grid>
        <Grid item xs={12}>
                
                <Table stickyHeader style={{ maxHeight: 200, overflow:"scroll"}}>
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
        </Grid>
        </>
    );
}

export default Telemetry;
