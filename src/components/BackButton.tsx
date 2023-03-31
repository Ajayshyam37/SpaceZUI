import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import  ArrowBack  from '@mui/icons-material/ArrowBack';

const StyledButtonBack = styled.button`
  background-color: #6c63ff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-right: 10px;
  text-decoration: none;
  position: absolute;
  top: 20px;
  left: 20px;`;


const HomeLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const BackButton = () => {
  return (
    <HomeLink to="/">
      <StyledButtonBack>
        <ArrowBack />
        Misson Control
      </StyledButtonBack>
    </HomeLink>
  );
};

export default BackButton;
