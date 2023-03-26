import styled from "styled-components";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import path from "path";
import ErrorMessage from "./ErrorMessage";
import { Typography, Grid, CardContent, CardActions, LinearProgress } from "@mui/material";
import ModalContent from "./ModelContent";

const StyledButton = styled.button`
  background-color: #6c63ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
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

const Heading1 = styled.h3`
  font-size: 1.5rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Heading2 = styled.h4`
  font-size: 1rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
  margin-bottom:5px;
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

const CardWrapper = styled(Card)`{
    maxWidth: 300,
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    color:white;
    }
`;

function MissonControl() {
    interface Spacecraft {
        spaceCraft_ID: number;
        name: string;
        state: number;
    }

    interface ExpandedState {
        [key: number]: boolean;
    }
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const handleExpandClick = (id: number) => {
        setExpanded((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };
    const [spacecrafts, setSpacecrafts] = useState<Spacecraft[]>([]);
    const [error, setError] = useState<string>("");

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, spacecraftId: number) => {
        const file = event.target.files?.[0];
        if (file && file.type === "text/plain") {
            const formData = new FormData();
            formData.append('file', file as Blob, file?.name);
            
            axios({
                method: 'POST',
                data: formData,
                url: `https://localhost:7050/MissonControl/LaunchSpaceCraft/${spacecraftId}`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then((response: AxiosResponse<any>) => {
                    // handle successful response
                })
                .catch((error: AxiosError<any>) => {
                    setErrorMessage(error.message);
                    setShowErrorModal(true);
                });
        } else {
            setErrorMessage("Incorrect file type selected. Please select a plain text file (.txt).");
            setShowErrorModal(true);
        }
    };


    useEffect(() => {
        axios.get('https://localhost:7050/MissonControl')
            .then((response: AxiosResponse<any>) => {
                setSpacecrafts(response.data);
                console.log(response.data);
            }).catch(error => {
                setError(error);
            });
    }, []);

    if (error) {
        return (
            <ErrorMessage />
        );
    }

    return (
        <>
            <ModalContent show={showErrorModal} onHide={() => setShowErrorModal(false)} message={errorMessage} />
            <Grid spacing={4}>
                <Container>
                    <Heading1>Mission Control</Heading1>
                    <Grid container spacing={4}>
                        <Grid item md={4}>
                            <Heading2>Active Spacecrafts</Heading2>
                            {spacecrafts
                                .filter((spacecraft) => spacecraft.state === 1)
                                .map((spacecraft) => (
                                    <Link to={`/Communications/${spacecraft.spaceCraft_ID}`} key={spacecraft.spaceCraft_ID}>
                                        <CardWrapper>
                                            <CardContent>
                                                <Heading3>{spacecraft.name}</Heading3>
                                            </CardContent>
                                        </CardWrapper>
                                    </Link>
                                ))}
                        </Grid>
                        <Grid item md={4}>
                            <Heading2>Waiting Spacecrafts</Heading2>
                            {spacecrafts
                                .filter((spacecraft) => spacecraft.state === 0)
                                .map((spacecraft) => (
                                    <CardWrapper key={spacecraft.spaceCraft_ID}>
                                        <CardContent onClick={() => handleExpandClick(spacecraft.spaceCraft_ID)}>
                                            <Heading3>{spacecraft.name}</Heading3>
                                        </CardContent>
                                        {expanded[spacecraft.spaceCraft_ID] && (
                                            <CardActions style={{ justifyContent: 'center' }}>
                                                <StyledButton>
                                                    <label htmlFor={`fileInput-${spacecraft.spaceCraft_ID}`}>Initiate Launch</label>
                                                    <input
                                                        id={`fileInput-${spacecraft.spaceCraft_ID}`}
                                                        type="file"
                                                        accept=".txt"
                                                        onChange={(event) => handleFileSelect(event, spacecraft.spaceCraft_ID)}
                                                        style={{ display: 'none' }}
                                                    />
                                                </StyledButton>
                                            </CardActions>
                                        )}
                                    </CardWrapper>
                                ))}
                        </Grid>
                        <Grid item md={4}>
                            <Heading2>Inactive Spacecrafts</Heading2>
                            {spacecrafts
                                .filter((spacecraft) => spacecraft.state === 2)
                                .map((spacecraft) => (
                                    <CardWrapper key={spacecraft.spaceCraft_ID}>
                                        <Link to={`/Communications/${spacecraft.spaceCraft_ID}`} key={spacecraft.spaceCraft_ID}>
                                            <CardContent className="card-content">
                                                <Heading3>{spacecraft.name}</Heading3>
                                            </CardContent>
                                        </Link>
                                    </CardWrapper>

                                ))}
                        </Grid>
                    </Grid>
                </Container>
            </Grid>

        </>
    );
}

export default MissonControl;
