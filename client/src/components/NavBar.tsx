import React from 'react'
import Link from 'next/link'
import { MeDocument, useLogoutMutation, useMeQuery } from '../generated/graphql'
import {Navbar, Nav, FormControl, NavDropdown, Form, Button} from 'react-bootstrap'

const NavBar = () => {

    const { data } = useMeQuery()
    const [logout] = useLogoutMutation({update: (store) => {
        store.writeQuery({
            query: MeDocument,
            data: {
                me: null
            }
        })
    }})

    return (
        <Navbar bg="dark" expand="sm" variant="dark">
            <div className="container">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link href="/"><Nav.Link href="/">Main</Nav.Link></Link>

                    {data?.me?.username ?
                    <NavDropdown title={`You: ${data?.me?.username}`} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                    </NavDropdown> 
                    : <>
                        <Link href="/register"><Nav.Link href="/register">Register</Nav.Link></Link>
                        <Link href="/login"><Nav.Link href="/login">Login</Nav.Link></Link>
                    </>
                    }

                </Nav>
            </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default NavBar
