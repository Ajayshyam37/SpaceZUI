import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import MissonControl from "../components/MissonControl";
import Communications from "../components/Communications";

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`;

const Heading = styled.h3`
  font-size: 2rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 5px;
`;
const PageWrapper = styled.div`
height: 100vh;
width: 100%;
background: #f5f5f5;
display: flex;
flex-direction: column;
`;

export function Home() {
    return (
        <Router>
          <>
            <PageWrapper>
                <Header>
                    <Heading>SpaceZ</Heading>
                </Header>
                <Routes>
                  <Route path='/' element={<MissonControl/>}/>
                  <Route path="/Communications" element={<Communications/>} />
                </Routes>
            </PageWrapper>
          </>
        </Router>
    );
}
