import { Col, Container, Row } from "react-bootstrap";
import connector from '../../utils/axiosConfig';
import { useEffect, useState } from "react";
import { Recipe, BaseResponse } from "../../types/types";
import RecipePreview from "../../components/recipepreview/RecipePreview";
import './Dashboard.css';

function Dashboard() {
    

    return (
        <Container fluid>
            <Row>
                <Col lg={10}>
                    <h1>In Progress</h1>
                    <div className="inProgressContainer">
                        
                    </div>
                </Col>
                <Col xs={1}>
                    <h1>Starters</h1>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard;