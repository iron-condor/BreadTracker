import { useEffect, useRef, useState } from "react";
import { BaseResponse, Recipe, Timer } from "../../types/types";
import connector from "../../utils/axiosConfig";
import RecipePreview from "../../components/recipepreview/RecipePreview";
import './Recipes.css';
import { Button, ButtonGroup, Collapse, Form, InputGroup, Modal, Overlay, OverlayTrigger, Popover } from "react-bootstrap";
import addBreadIcon from "../../assets/addBreadIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faClock, faI, faInfo, faInfoCircle, faPlus, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import AddTimerModal from "../../components/modals/addtimer/AddTimerModal";
import { getTimeLabel } from "../../utils/timeFuncs";
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
  const [timers, setTimers] = useState<Timer[]>([]);
  const [showAddTimerModal, setShowAddTimerModal] = useState<boolean>(false);
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
      data.timers = timers;
      await connector.post('recipes/new', data)
      .then((result) => {
          if (result.status == 200 && result.data.success) {
            setRecipes([...recipes, result.data.newRecipe])
            setAddBreadExpanded(false);
          } else {
              // TODO: Handle error
          }
      }).catch((error) => {
          // TODO: Handle error
      });
    }

    const renderRecipePreviews = (recipes: Recipe[]) => {
        let ret: JSX.Element[] = [];

        for (let recipe of recipes) {
            ret.push(<RecipePreview recipe={recipe} key={recipe.uuid}/>)
        }

        return ret;
    }

    const renderTimers = (timers: Timer[]) => {
      let ret: JSX.Element[] = [];
      for (let timer of timers) {
        ret.push(
          <li>
            {timer.overnight 
              ? 
              <Form.Label>
                <strong>{timer.label}</strong> overnight
              </Form.Label>
              :
              <Form.Label>
                <strong>{timer.label}</strong> for <strong>{getTimeLabel(timer.lowerLimit)}</strong> to <strong>{getTimeLabel(timer.upperLimit)}</strong>
              </Form.Label>}
          </li>
        );
      }
      return <ol>{ret}</ol>;
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

                  {timers.length > 0 && <Form.Label>Steps</Form.Label>}
                  <div className="editingTimersGroup">
                    {renderTimers(timers)}
                  </div>
                  <div className="formButtonFooter">
                    <Button className="themeBtn" onClick={() => setShowAddTimerModal(true)}><FontAwesomeIcon icon={faPlus} className="mr-5"/>Add step</Button>
                    <div className="floatRightBtnGroup">
                      <Button type="submit">Save</Button>
                      <Button variant="secondary" onClick={() => setAddBreadExpanded(false)} type="reset">Cancel</Button>
                    </div>
                  </div>
                </Form>
              </div>
            </Collapse>
            <Button className="addBreadCollapseBtn themeBtn" onClick={() => setAddBreadExpanded(true)} hidden={addBreadExpanded}><FontAwesomeIcon icon={faPlus}/></Button>
          </div>
        </div>
        {/* Render all the saved recipes */}
        {renderRecipePreviews(recipes)}
        <AddTimerModal showModal={showAddTimerModal} setShowModalFunc={setShowAddTimerModal} timersObj={timers} setTimersFunc={setTimers}/>
      </div>
    )
}

export default Recipes;