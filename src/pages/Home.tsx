import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import MissonControl from "../components/MissonControl";
import Communications from "./Communications";

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
background: linear-gradient(180deg, #d9d9d9 0%, #f0f0f0 80%);
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
                  <Route path="/Communications/:spaceCraft_ID" element={<Communications/>} />
                </Routes>
            </PageWrapper>
          </>
        </Router>
    );
}
