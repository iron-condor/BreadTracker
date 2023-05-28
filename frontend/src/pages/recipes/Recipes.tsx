import { useEffect, useState } from "react";
import { BaseResponse, Recipe, Timer } from "../../types/types";
import connector from "../../utils/axiosConfig";
import RecipePreview from "../../components/recipepreview/RecipePreview";
import './Recipes.css';
import { Button, Collapse, Form } from "react-bootstrap";
import addBreadIcon from "../../assets/addBreadIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
`import '../../common.css';`

interface GetRecipesResponse extends BaseResponse {
  recipeList: Recipe[];
}

interface AddRecipeRequest {
  name: string;
  description: string;
  timers?: Timer[];
}

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [addBreadExpanded, setAddBreadExpanded] = useState<boolean>(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

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

    const saveRecipe = async (data: AddRecipeRequest) => {
      // await connector.get('recipes/getAll')
      // .then((result) => {
      //     if (result.status == 200 && result.data.success) { 
      //         let data: GetRecipesResponse = result.data;
      //         setRecipes(data.recipeList);
      //     } else {
      //         // TODO: Handle error
      //     }
      // }).catch((error) => {
      //     // TODO: Handle error
      // });
    }

    const renderRecipePreviews = () => {
        let ret: JSX.Element[] = [];

        for (let recipe of recipes) {
            ret.push(<RecipePreview recipe={recipe} key={recipe.uuid}/>)
        }

        return ret;
    }

    useEffect(() => {
        loadRecipes();
    }, []);

    return (
      <div className="recipePreviewContainer">
        {/* Element used for adding another recipe */}
        <div className="recipePreviewDiv newRecipeDiv">
          <img className="recipePreviewImage" src={addBreadIcon}/>
          <div className="recipePreviewBelowImage">
            <h2 className="recipePreviewTitle">New Recipe</h2>
            <p className="recipePreviewDescription">Add new recipes to keep track of their timing</p>
            <Collapse in={addBreadExpanded}>
              <div>
                <Form onSubmit={handleSubmit(saveRecipe)}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Name" {...register("name")}></Form.Control>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" placeholder="Description" {...register("description")}></Form.Control>

                  <div className="formButtonFooter">
                    <Button className="themeBtn" type="submit">Save</Button>
                    <Button className="themeBtn" onClick={() => setAddBreadExpanded(false)} type="reset">Cancel</Button>
                  </div>
                </Form>
              </div>
            </Collapse>
            <Button className="addBreadCollapseBtn themeBtn" onClick={() => setAddBreadExpanded(true)}><FontAwesomeIcon icon={faPlus}/></Button>
          </div>
        </div>
        {/* Render all the saved recipes */}
        {renderRecipePreviews()}
      </div>
    )
}

export default Recipes;