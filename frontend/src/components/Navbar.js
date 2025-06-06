import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';

function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setIsAuth(false);
    navigate('/signin');
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '2px' }}>
          <span role="img" aria-label="rupee">💸</span> RupeeTrack
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          {isAuth && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/analytics">Analytics</Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto">
            {isAuth ? (
              <>
                <span className="navbar-text me-3">Hi, {name}</span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;