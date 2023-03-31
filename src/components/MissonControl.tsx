import styled from "styled-components";
import { Container, Card, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { Grid, CardContent, CardActions, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import ModalContent from "./ModelContent";
import AddIcon from '@mui/icons-material/Add';
import LoadingSpinner from "./LoadingSpinner";
import { Spacecraft,ExpandedState } from "../interfaces/types";

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
  display: flex; /* vertically center */
  align-items: center; /* vertically center */
  justify-content: center; /* horizontally center */
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

const CardWrapper = styled(Card)`
  margin-bottom: 16px;
  max-width: 350px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex; /* vertically center */
  align-items: center; /* vertically center */
  justify-content: center; /* horizontally center */

  &:hover {
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.25);
    transform: translateY(-4px);
  }
`;


function MissonControl() {
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [spacecrafts, setSpacecrafts] = useState<Spacecraft[]>([]);
    const [error, setError] = useState<string>("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [spacecraftName, setSpacecraftName] = useState('');

    const navigate = useNavigate();

    const loadData = () => {
        axios.get('https://localhost:7050/api/SpaceCrafts')
            .then((response: AxiosResponse<any>) => {
                setSpacecrafts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                setError(error);
            });
    };

    useEffect(() => {
        loadData();
    }, []);


    const handleExpandClick = (id: string) => {
        if (id === expandedCardId) {
            // clicked card is already expanded, collapse it
            setExpanded((prevState) => ({ ...prevState, [id]: !prevState[id] }));
            setExpandedCardId(null);
        } else {
            // clicked card is not expanded, collapse the currently expanded card (if any)
            if (expandedCardId) {
                setExpanded((prevState) => ({ ...prevState, [expandedCardId]: false }));
            }
            // expand the clicked card and update expandedCardId
            setExpanded((prevState) => ({ ...prevState, [id]: true }));
            setExpandedCardId(id);
        }
    };


    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, spacecraftId: string) => {
        const file = event.target.files?.[0];
        if (file && file.type === "text/plain") {
            const formData = new FormData();
            formData.append('file', file);
            axios.post(`https://localhost:7050/api/Launch/Launch?spacecraftId=${spacecraftId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then((response: AxiosResponse<any>) => {
                    loadData()
                })
                .catch((error) => {
                    setError(error);
                });
        } else {
            setErrorMessage("Incorrect file type selected. Please select a plain text file (.txt).");
            setShowErrorModal(true);
        }
    };

    const handleDeorbit = (spacecraftId: string) => {
        axios.put(`https://localhost:7050/api/SpaceCrafts/DeOrbit?id=${spacecraftId}`)
            .then(() => { loadData() })
            .catch((error) => {
                setError(error);
            });
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        axios.post(`https://localhost:7050/api/SpaceCrafts/NewSpaceCraft?name=${spacecraftName}`)
        .then(() => { loadData() })
            .catch(error => {
                setError(error);
            });
        handleClose();
    };

    function handleActiveClick(spacecraft : Spacecraft) {
        navigate('/Communications',{state:spacecraft})
      }
      

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
            <ModalContent show={showErrorModal} onHide={() => setShowErrorModal(false)} message={errorMessage} title="Errors" />
            <Grid direction="column">
                <Container>
                    <Grid item>
                        <Container>
                            <Heading1>Mission Control</Heading1>
                            <Grid container justifyContent="flex-end" style={{ marginBottom: '20px' }}>
                                <StyledButton onClick={handleOpen}>
                                    <AddIcon></AddIcon>
                                    New
                                </StyledButton>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Add Spacecraft</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label="Spacecraft Name"
                                            fullWidth
                                            value={spacecraftName}
                                            onChange={(event) => setSpacecraftName(event.target.value)}
                                            autoComplete="off"
                                        />
                                    </DialogContent>

                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} color="primary">
                                            Save
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>
                        </Container>
                    </Grid>
                    <Grid item container direction="row" style={{ flex: 1 }}>
                        <Grid item md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid>
                                <Grid item style={{ marginBottom: '20px' }}>
                                    <Heading2>Active Spacecrafts</Heading2>
                                </Grid>
                                <Grid item style={{ overflow: 'auto', maxHeight: '650px' }}>
                                    {spacecrafts
                                        .filter((spacecraft) => spacecraft.state === 1)
                                        .map((spacecraft) => (
                                            <>
                                                <CardWrapper key={spacecraft.spaceCraft_ID}>
                                                    <CardContent onClick={() => handleExpandClick(spacecraft.spaceCraft_ID)}>
                                                        <Heading3>{spacecraft.name}</Heading3>
                                                    </CardContent>
                                                    {expanded[spacecraft.spaceCraft_ID] && (
                                                        <CardActions style={{ justifyContent: 'center' }}>
                                                            <StyledButton onClick={() => handleDeorbit(spacecraft.spaceCraft_ID)}>DeOrbit</StyledButton>
                                                            <StyledButton onClick={() => handleActiveClick(spacecraft)}>Data</StyledButton>
                                                        </CardActions>
                                                    )}
                                                </CardWrapper>
                                                <br></br>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid>
                                <Grid item style={{ marginBottom: '20px' }}>
                                    <Heading2>Waiting Spacecrafts</Heading2>
                                </Grid>
                                <Grid item style={{ overflow: 'auto', maxHeight: '650px' }}>
                                    {spacecrafts
                                        .filter((spacecraft) => spacecraft.state === 0)
                                        .map((spacecraft) => (
                                            <>
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
                                                <br></br>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={4} style={{ overflow: 'auto', maxHeight: '650px', display: 'flex', flexDirection: 'column' }}>
                            <Grid>
                                <Grid item style={{ marginBottom: '20px' }}>
                                    <Heading2>Inactive Spacecrafts</Heading2>
                                </Grid>
                                <Grid item style={{ overflow: 'auto', maxHeight: '650px' }}>
                                    {spacecrafts
                                        .filter((spacecraft) => spacecraft.state === 2)
                                        .map((spacecraft) => (
                                            <>
                                                <CardWrapper key={spacecraft.spaceCraft_ID} onClick={()=> handleActiveClick(spacecraft)}>
                                                        <CardContent className="card-content">
                                                            <Heading3>{spacecraft.name}</Heading3>
                                                        </CardContent>
                                                </CardWrapper>
                                                <br></br>
                                            </>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </>

    );
}

export default MissonControl;