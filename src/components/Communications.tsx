import { memo,useMemo, useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import styled from "styled-components";
import Telemetry from "./Telemetry";
import PayLoad from "./PayLoadData";
import ErrorMessage from "./ErrorMessage";
import CountdownTimer from "./CountDownTimer";
import BackButton from "./BackButton";
import { useLocation } from "react-router-dom";

const Heading1 = styled.h3`
  font-size: 1.5rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Heading2 = styled.h3`
  font-size: 1rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

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
  text-decoration: none;
  position: absolute;
  top: 20px;
  left: 20px;`;


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
function Communications() {
    const [error, setError] = useState<string>("");
    const [view, setView] = useState<"telemetry" | "payload">("telemetry");
    const [timeriszero, setTimerIsZero] = useState(false);
    const location = useLocation();
    const MemoizedTelemetry = useMemo(() => memo(Telemetry), [location.state?.spaceCraft_ID]);
    const MemoizedPayLoad = memo(PayLoad);


    const [showCountdown, setShowCountdown] = useState(true);
    useEffect(() => {
        if (location.state?.state === 2) {
            setShowCountdown(false);
        }
    });

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
                <BackButton />
                <Heading1>Communications</Heading1>
                <Heading1>{location.state?.name}</Heading1>
                <Heading2>{location.state?.payloadname}</Heading2>
                <br />
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Button2
                            onClick={handleTelemetryClick}
                            isActive={view === "telemetry"}
                            style={{
                                marginRight: "10px",
                                backgroundColor: view === "telemetry" ? "#FFFFFF" : "#f0f0f0",
                                color: view === "telemetry" ? "#000000" : "#707070",
                            }}
                        >
                            <Typography>Telemetry</Typography>
                        </Button2>
                        <Button2
                            onClick={handlePayloadClick}
                            isActive={view === "payload"}
                            style={{
                                backgroundColor: view === "payload" ? "#FFFFFF" : "#f0f0f0",
                                color: view === "payload" ? "#000000" : "#707070",
                            }}
                        >
                            <Typography>Payload</Typography>
                        </Button2>
                    </Grid>
                    <Grid item sx={{ marginLeft: "auto" }}>
                        {showCountdown && (
                            <CountdownTimer
                                startTime={new Date(location.state.launchtime)}
                                duration={location.state.totalTimeToOrbit}
                                setTimerIsZero = {setTimerIsZero}
                            />
                        )}
                    </Grid>
                </Grid>
                {view === 'telemetry' && <MemoizedTelemetry spacecraft={location.state} />}
                {view === 'payload' && <MemoizedPayLoad spacecraft={location.state} timerIsZero ={timeriszero} />}
            </Container>
        </>
    );

}

export default memo(Communications);
