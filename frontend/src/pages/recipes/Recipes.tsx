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
  const [showModal, setShowModal] = useState<boolean>();
  const [isOvernightTimer, setIsOvernightTimer] = useState<boolean>();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const popover = (<Popover className="infoPopover">
    <Popover.Header as="h3">What are step timers?</Popover.Header>
    <Popover.Body>
      Step timers measure the amount of time that a step takes to complete.
      They have a <strong>soft</strong> and <strong>hard</strong> limit.
      <br/>
      <br/>
      When the soft limit is reached, a chime <FontAwesomeIcon icon={faVolumeHigh}/> is sounded. When the hard limit is reached, an alarm <FontAwesomeIcon icon={faBell}/> is sounded that must be acknowledged before the next
      step timer is allowed to begin.
      <br/>
      <br/>
      Example: Knead for <strong>4-6 minutes</strong>
    </Popover.Body>
  </Popover>);

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
        ret.push(<div>Timer placeholder</div>);
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

                  {timers.length > 0 && <Form.Label>Timers</Form.Label>}
                  <div className="editingTimersGroup">
                    {renderTimers(timers)}
                  </div>
                  <div className="formButtonFooter">
                    <Button className="themeBtn" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} className="mr-5"/>Add timer</Button>
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
        <Modal className="addTimerModal" show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Step Timer
              <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
                <FontAwesomeIcon icon={faInfoCircle} className="infoTooltipButton"/>
              </OverlayTrigger>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Name</Form.Label>
            <Form.Control required placeholder="Name"></Form.Control>
            <br/>
            <ButtonGroup>
              <Button variant={isOvernightTimer ? "primary" : "secondary"} onClick={() => setIsOvernightTimer(true)}>Overnight</Button>
              <Button variant={isOvernightTimer ? "secondary" : "primary"} onClick={() => setIsOvernightTimer(false)}>Limit based</Button>
            </ButtonGroup>
            <Form.Group hidden={isOvernightTimer}>
              <br/>
              <Form.Label>Soft limit</Form.Label>
              <InputGroup className="timerLimitInputGroup">
                <Form.Control defaultValue={0} inputMode="numeric" type="number" min={0}/>
                <InputGroup.Text>hours</InputGroup.Text>
                <Form.Control defaultValue={0} inputMode="numeric" type="number" min={0}/>
                <InputGroup.Text>seconds</InputGroup.Text>
              </InputGroup>
              <br/>
              <Form.Label>Hard limit</Form.Label>
              <InputGroup className="timerLimitInputGroup">
                <Form.Control required defaultValue={0} inputMode="numeric" type="number" min={0}/>
                <InputGroup.Text>hours</InputGroup.Text>
                <Form.Control required defaultValue={0} inputMode="numeric" type="number" min={0}/>
                <InputGroup.Text>seconds</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
}

export default Recipes;