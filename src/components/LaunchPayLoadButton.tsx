import LaunchIcon  from "@mui/icons-material/Launch"
import { isDisabled } from "@testing-library/user-event/dist/utils"
import axios from "axios";
import styled from "styled-components"

type LaunchPayLoadButtonProps = {
    isDisabled: boolean;
    spacecraftid: string;
  };
  
  const handlelaunch = (props: LaunchPayLoadButtonProps) => {
    console.log(props);
    axios.put(`https://localhost:7050/api/PayLoad/LaunchPayLoad?id=${props.spacecraftid}&spacecraft=false`)
      .catch((error) => {
        
      });
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