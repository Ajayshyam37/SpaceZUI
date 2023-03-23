import styled from "styled-components";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";

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

const CardWrapper = styled(Card)`
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 16px;
  height:100px;
`;


function MissonControl() {
    interface Spacecraft {
        spaceCraft_ID: number;
        name: string;
        state: number;
      }
      
      const [spacecrafts, setSpacecrafts] = useState<Spacecraft[]>([]);
    useEffect(() => {
        axios.get('https://localhost:7050/MissonControl')
        .then((response:AxiosResponse<any>) => {
            setSpacecrafts(response.data);
        })
    },[]);
    return (
        <>
        <Container>
            <Heading1>Mission Control</Heading1>
            <Row>
            <Col md={4}>
                <Heading2>Active Spacecrafts</Heading2>
                {spacecrafts
                    .filter((spacecraft) => spacecraft.state === 1)
                    .map((spacecraft) => (
                    <Link to={`/Communications/${spacecraft.spaceCraft_ID}`}>
                    <CardWrapper key={spacecraft.spaceCraft_ID}>
                        <Card.Body>
                        <Card.Title>{spacecraft.name}</Card.Title>
                        </Card.Body>
                    </CardWrapper>
                    </Link>
                    ))}
                </Col>
                <Col md={4}>
                    <Heading2>Waiting Spacecrafts</Heading2>
                    {spacecrafts
                    .filter((spacecraft) => spacecraft.state === 0)
                    .map((spacecraft) => (
                    <Link to={`/Communications/${spacecraft.spaceCraft_ID}`}>
                    <CardWrapper key={spacecraft.spaceCraft_ID}>
                        <Card.Body>
                        <Card.Title>{spacecraft.name}</Card.Title>
                        </Card.Body>
                    </CardWrapper>
                    </Link>
                    ))}
                </Col>
                <Col md={4}>
                    <Heading2>Inactive Spacecrafts</Heading2>
                    {spacecrafts
                    .filter((spacecraft) => spacecraft.state === 2)
                    .map((spacecraft) => (
                    <Link to={`/Communications/${spacecraft.spaceCraft_ID}`}>
                    <CardWrapper key={spacecraft.spaceCraft_ID}>
                        <Card.Body>
                        <Card.Title>{spacecraft.name}</Card.Title>
                        </Card.Body>
                    </CardWrapper>
                    </Link>
                    ))}
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default MissonControl;
