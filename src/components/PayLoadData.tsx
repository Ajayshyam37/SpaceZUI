import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import LaunchIcon from "@mui/icons-material/Launch";
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
import { Spacecraft, PayLoadInfo, TelemetryData, ApiResponse } from '../interfaces/types';
import LoadingSpinner from './LoadingSpinner';

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

const Heading3 = styled.h6`
  font-size: 0.8rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 10px;
  display: flex; /* vertically center */
  align-items: center; /* vertically center */
  justify-content: center; /* horizontally center */
`;

type PayLoadProps = {
    spacecraft?: Spacecraft;
}

export default function PayLoad(props: PayLoadProps) {
    const [error, setError] = useState<string>("");
    const [payloadData, setPayloadData] = useState<ApiResponse>({});
    const [payload, setPayload] = useState<PayLoadInfo>();
    const [isFetching1, setIsFetching1] = useState(false);
    const [loading, setLoading] = useState(true);
    const [payloadactive, setpayloadstate] = useState(false);

    useEffect(() => {
        if (props && props.spacecraft?.spaceCraft_ID) {
            setLoading(true);
            axios.get(`https://localhost:7050/api/PayLoad/GetPayLoadById?id=${props.spacecraft.payloadid}`)
                .then((response: AxiosResponse<any>) => {
                    setPayload(response.data);
                    if (response.data.payloadstate == 1) {
                        setpayloadstate(true);
                    }
                    if (response.data.payLoadData == true) {
                        setIsFetching1(true);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    setError(error);
                });
        }
    }, [props]);

    const GetPayLoadData = () => {
        if (isFetching1) {
            axios
                .get(`https://localhost:7050/api/Communications/GetPayLoadData?payloadtype=${payload?.payLoadType}&payloadid=${payload?.payloadid}`)
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
                })
                .catch(error => {
                    setIsFetching1(false);
                    setError(error);
                });
        }
    };

    const handlePayLoadDataStart = () => {
            axios.put(`https://localhost:7050/api/PayLoad/UpdatePayLoadData?id=${payload?.payloadid}&data=true`)
                .catch((error) => {
                    setError(error);
                });
        setIsFetching1(true);
    };

    const handlePayLoadDataStop = () => {
        axios.put(`https://localhost:7050/api/PayLoad/UpdatePayLoadData?id=${payload?.payloadid}&data=false`)
            .catch((error) => {
                setError(error);
            });
        setIsFetching1(false);
    };

    const handelPayLoadDeorbit = () => {
        axios
          .put(`https://localhost:7050/api/PayLoad/DeOrbitPayLoad?id=${payload?.payloadid}`)
          .then(() => {
            setpayloadstate(false);
          })
          .catch((error) => {
            setError(error);
          });
      }
    
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        let intervalTime = 60000; // default interval time

        if (payload?.payLoadType === 1 || payload?.payLoadType === 0 ) {
            intervalTime = 5000;
        } else if (payload?.payLoadType === 2) {
            intervalTime = 10000;
        } 
        if (isFetching1) {
            intervalId = setInterval(GetPayLoadData, intervalTime);
        }
        

        return () => clearInterval(intervalId);
    }, [isFetching1]);

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
            <Grid container>
                <Grid item xs={12} container justifyContent="flex-end" sx={{ marginBottom: 2 }} >
                    <Grid item>
                        {payload && payloadactive ? (<StyledButton onClick={handelPayLoadDeorbit} >DeOrbit</StyledButton>) : (<StyledButton disabled={true} >DeOrbit</StyledButton>)}
                    </Grid>
                    <Grid item>
                        {payloadactive ? (
                            isFetching1 ? (
                                <StyledButton onClick={handlePayLoadDataStop} className="StyledButton">
                                    <StopIcon /> PayLoad Data
                                </StyledButton>
                            ) : (
                                <StyledButton onClick={handlePayLoadDataStart}>
                                    <PlayArrowIcon /> PayLoad Data
                                </StyledButton>
                            )
                        ) : (
                            <StyledButton disabled={true}>
                                <PlayArrowIcon /> PayLoad Data
                            </StyledButton>
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} container>
                        {payload?.payLoadType === 0 && payloadData.CommunicationData && (
                            <><Heading3>Pay Load Data</Heading3>
                                <TableContainer sx={{ maxHeight: 600, overflow: "scroll" }}>
                                    <Table stickyHeader>
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
                                </TableContainer></>
                        )}
                        {payload?.payLoadType === 1 && payloadData.ImageData && (
                            <><Heading3>Pay Load Data</Heading3>
                                <TableContainer sx={{ maxHeight: 600, overflow: "scroll" }}>
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
                                </TableContainer></>
                        )}
                        {payload?.payLoadType === 2 && payloadData.ScientificData && (
                            <><Heading3>Pay Load Data</Heading3>
                                <TableContainer sx={{ maxHeight: 600, overflow: "scroll" }}>
                                    <Table stickyHeader>
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
                                </TableContainer></>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};
