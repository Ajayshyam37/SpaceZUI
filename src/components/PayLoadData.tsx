import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import {
    TableContainer,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

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

interface Communications {
    spaceCraft_ID: number;
    name: string;
    state: number;
    commType: number;
    payloadState: number,
    payload_ID: string,
    payloadType: number,
    telemetry: boolean,
    payloaddata: boolean,
    orbitRadius: number,
    totalTimeToOrbit: number
}

interface ApiResponse {
    CommunicationData?: {
        Bandwidth: {
            Uplink: number;
            Downlink: number;
        };
    }[];
    ImageData?: string[];
    ScientificData?: {
        Weather: {
            Rain: number;
            Humidity: number;
            Snow: number;
        };
    }[];
}

type PayLoadProps = {
    communications?: Communications;
}

export default function PayLoad(props: PayLoadProps) {
    const [error, setError] = useState<string>("");
    const [payloadData, setPayloadData] = useState<ApiResponse>({});
    const [isFetching, setIsFetching] = useState(false);
    const [isFetching1, setIsFetching1] = useState(false);

    console.log(props);

    useEffect(() => {
        let count = 0;
        let intervalId: NodeJS.Timeout;

        if (isFetching) {
            intervalId = setInterval(() => {
                axios
                    .get(`https://localhost:7050/Communications/GetPayLoadData`, { params: { payloadtype: props.communications?.payloadType, count: count } })
                    .then((response: AxiosResponse<any>) => {
                        setPayloadData((prevPayloadData) => ({
                            ...prevPayloadData,
                            CommunicationData: response.data.CommunicationData
                                ? [response.data.CommunicationData, ...(prevPayloadData.CommunicationData || [])]
                                : prevPayloadData.CommunicationData,
                            ImageData: response.data.imageData
                                ? [response.data.imageData, ...(prevPayloadData.ImageData || [])]
                                : prevPayloadData.ImageData,
                            ScientificData: response.data.ScientificData
                                ? [{ Weather: response.data.ScientificData.Weather }, ...(prevPayloadData.ScientificData || [])]
                                : prevPayloadData.ScientificData,
                        }));  
                        console.log(response.data);                      
                    })
                    .catch(error => {
                        setError(error);
                    });
                count++;
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [isFetching]);

    const handleStart = () => {
        setIsFetching(true);
    };

    const handleStop = () => {
        setIsFetching(false);
    };

    const handleStart1 = () => {
        setIsFetching1(true);
    };

    const handleStop1 = () => {
        setIsFetching1(false);
    };


    if (error) {
        return (
            <ErrorMessage />
        );
    }

    return (
        <>
            <Grid container>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                    <Grid item>
                        {isFetching ? (
                            <StyledButton onClick={handleStop} className="StyledButton">
                                <StopIcon /> PayLoad Data
                            </StyledButton>
                        ) : (
                            <StyledButton onClick={handleStart}>
                                <PlayArrowIcon /> PayLoad Data
                            </StyledButton>
                        )}
                    </Grid>
                    <Grid item>
                    {isFetching1 ? (
                            <StyledButton onClick={handleStop1} className="StyledButton"><StopIcon />Telemetry Data</StyledButton>
                        ) : (
                            <StyledButton onClick={handleStart1}> <PlayArrowIcon />Telemetry Data</StyledButton>
                        )}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {props.communications?.payloadType === 0 && payloadData.CommunicationData && (
                        <TableContainer sx={{ maxHeight: 500, overflow: "scroll" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Uplink</TableCell>
                                        <TableCell>Downlink</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payloadData.CommunicationData.map((data: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.Bandwidth.Uplink}</TableCell>
                                            <TableCell>{data.Bandwidth.Downlink}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {props.communications?.payloadType === 1 && payloadData.ImageData && (
                        <TableContainer sx={{ maxHeight: 500, overflow: "scroll" }}>
                            <Table>
                                <TableBody>
                                    {payloadData.ImageData.map((data: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                <img src={data} height="510" width="800" alt="Spy Images" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {props.communications?.payloadType === 2 && payloadData.ScientificData && (
                        <TableContainer sx={{ maxHeight: 500, overflow: "scroll" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rain</TableCell>
                                        <TableCell>Humidity</TableCell>
                                        <TableCell>Snow</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {payloadData.ScientificData.map((data: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{data.Weather.Rain}</TableCell>
                                            <TableCell>{data.Weather.Humidity}</TableCell>
                                            <TableCell>{data.Weather.Snow}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}


                </Grid>
            </Grid>
        </>
    );
};
