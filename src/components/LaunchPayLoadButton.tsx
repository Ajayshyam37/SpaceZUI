import LaunchIcon  from "@mui/icons-material/Launch"
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import styled from "styled-components"

type LaunchPayLoadButtonProps = {
    isDisabled: boolean;
    spacecraftid: string;
    setpayloadlaunched:Dispatch<SetStateAction<boolean>>;
    setpayloadstate:Dispatch<SetStateAction<boolean>>;
  };
  
  const handlelaunch = (props: LaunchPayLoadButtonProps) => {
    if(!props.isDisabled)
    {
    props.setpayloadlaunched(true);
    axios.put(`https://localhost:7050/api/PayLoad/LaunchPayLoad?id=${props.spacecraftid}&spacecraft=false`)
      .catch((error) => {
        
      });
    }
    props.setpayloadstate(true);
  };
  
  const LaunchPayLoadButton: React.FC<LaunchPayLoadButtonProps> = (props) => {
    return (
      <StyledButton onClick={() => handlelaunch(props)} disabled={props.isDisabled}>
        <LaunchIcon />
        Launch Payload
      </StyledButton>
    );
  };
  
  

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

export default LaunchPayLoadButton;