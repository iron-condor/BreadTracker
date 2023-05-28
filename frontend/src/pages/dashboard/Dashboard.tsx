import { Col, Container, Row } from "react-bootstrap";
import connector from '../../utils/axiosConfig';
import { useEffect, useState } from "react";
import { Recipe, BaseResponse } from "../../types/types";
import RecipePreview from "../../components/recipepreview/RecipePreview";
import './Dashboard.css';

interface GetRecipesResponse extends BaseResponse {
    recipeList: Recipe[];
}

function Dashboard() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    const loadRecipes = async () => {
        await connector.get('recipes/getAll')
        .then((result) => {
            if (result.status == 200 && result.data.success) { 
                let data: GetRecipesResponse = result.data;
                setRecipes(data.recipeList);
            } else {
                // TODO: Handle error
            }
        }).catch((error) => {
            // TODO: Handle error
        });
    }

    const renderRecipePreviews = () => {
        let ret: JSX.Element[] = [];

        for (let recipe of recipes) {
            ret.push(<RecipePreview recipe={recipe}/>)
        }

        return ret;
    }

    useEffect(() => {
        loadRecipes();
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col lg={10}>
                    <h1>In Progress</h1>
                    <div className="recipePreviewContainer">
                        {renderRecipePreviews()}
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