import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import styled from "styled-components";

interface Props {
  startTime: Date;
  duration: number;
  setTimerIsZero:Dispatch<SetStateAction<boolean>>;
}


const Heading3 = styled.h6`
  font-size: 2.5rem;
  color:#000;
  text-transform: uppercase;
  letter-spacing: 5px;
  display: flex; /* vertically center */
  align-items: center; /* vertically center */
  justify-content: center; /* horizontally center */
`;

const LoadingText = styled.span`
  font-size: 1rem;
  color:#000;
  text-transform: uppercase;
  letter-spacing: 10px;
  display: flex; /* vertically center */
  align-items: center; /* vertically center */
  justify-content: center; /* horizontally center */
`;

function CountdownTimer({ startTime, duration, setTimerIsZero }: Props) {
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date(Date.now());
            const target = new Date(startTime.getTime() + (duration * 1000));
            const diff = target.getTime() - now.getTime();
            if (diff <= 0) {
              setTimeRemaining(0);
              setTimerIsZero(true);
              clearInterval(intervalId);
              setLoading(false);
            } else {
              setTimerIsZero(false);
              setTimeRemaining(diff);
              setLoading(false);
            }
          }, 1000);          

        return () => {
            clearInterval(intervalId);
        };
    }, [startTime, duration]);

    const formatTime = (time: number) => {
        const seconds = Math.floor(time / 1000) % 60;
        const minutes = Math.floor(time / (1000 * 60)) % 60;
        const hours = Math.floor(time / (1000 * 60 * 60)) % 24;
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
      
        const secondsStr = seconds.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const hoursStr = hours.toString().padStart(2, '0');
        const daysStr = days.toString().padStart(2, '0');
      
        const isZero = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
      
        const className = isZero ? 'blink' : '';
      
        if (days > 0) {
          return <Heading3 className={className}>{daysStr}:{hoursStr}:{minutesStr}:{secondsStr}</Heading3>;
        } else {
          return <Heading3 className={className}>{hoursStr}:{minutesStr}:{secondsStr}</Heading3>;
        }
      };
        

    return (
        <>
            <LoadingText className={loading ? 'loading-text' : ''}>
                {loading ? 'Loading...' : formatTime(timeRemaining)}
            </LoadingText>

        </>
    );
}

export default CountdownTimer;
