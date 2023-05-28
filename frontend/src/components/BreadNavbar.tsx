import { Container, Nav, Navbar } from "react-bootstrap";
import breadIcon from '../assets/BreadIcon.png';
import './styles/BreadNavbar.css';
import { NavLink } from "react-router-dom";

function BreadNavbar() {
    return (
    <Navbar bg="light" expand="lg" className="breadNavbar" sticky="top">
        <Container className="navbarContainer">
            <Navbar.Brand className="navbarBrandBox">
                <img src={breadIcon} className="breadIcon"/>
                Bread Tracker
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
                    <Nav.Link as={NavLink} to="/recipes">Recipes</Nav.Link>
                    <Nav.Link as={NavLink} to="/starters">Starters</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    )
}

export default BreadNavbar;