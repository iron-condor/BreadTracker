import { useEffect, useRef, useState } from "react";
import { BaseResponse, Recipe, Timer } from "../../types/types";
import connector from "../../utils/axiosConfig";
import RecipePreview from "../../components/recipepreview/RecipePreview";
import './Recipes.css';
import { Button, Collapse, Form } from "react-bootstrap";
import addBreadIcon from "../../assets/addBreadIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import AddTimerModal from "../../components/modals/addtimer/AddTimerModal";
import { getTimeLabel, toBase64 } from "../../utils/usefulFuncs";
import '../../common.css';
import { toast } from "react-toastify";

interface GetRecipesResponse extends BaseResponse {
  recipeList: Recipe[];
}

interface AddRecipeRequest {
  name: string;
  description: string;
  timers?: Timer[];
  image?: string;
}

function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [addBreadExpanded, setAddBreadExpanded] = useState<boolean>(false);
  const [timers, setTimers] = useState<Timer[]>([]);
  const [addedImage, setAddedImage] = useState<File>();
  const imageInputRef = useRef<any>(null);
  const [showAddTimerModal, setShowAddTimerModal] = useState<boolean>(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const loadRecipes = async () => {
    await connector.get('recipes')
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

  const resetAddBreadMenu = () => {
    setAddBreadExpanded(false);
    setAddedImage(undefined);
    setValue("name", "");
    setValue("description", "");
    imageInputRef.current.value = null;
  }

  const saveRecipe: SubmitHandler<AddRecipeRequest> = async (data: AddRecipeRequest) => {
    data.timers = timers;
    data.image = (addedImage == null) ? undefined : (await toBase64(addedImage));
    await connector.post('recipes', data)
      .then((result) => {
        if (result.status == 200 && result.data.success) {
          setRecipes([...recipes, result.data.newRecipe])
          resetAddBreadMenu();
        } else {
          toast.error("There with an issue saving this recipe.")
        }
      }).catch((error) => {
        // TODO: Handle error
      });
  }

  const renderRecipePreviews = (recipes: Recipe[]) => {
    let ret: JSX.Element[] = [];

    for (let recipe of recipes) {
      if (recipe.image != null) {
        ret.push(<RecipePreview recipe={recipe} key={recipe.uuid} img={recipe.image} deleteRecipeFunc={() => deleteRecipe(recipe.uuid)} />)
      } else {
        ret.push(<RecipePreview recipe={recipe} key={recipe.uuid} deleteRecipeFunc={() => deleteRecipe(recipe.uuid)} />)
      }
    }

    return ret;
  }

  const deleteRecipe = (recipeUUID: string): void => {
    let clone = recipes.filter((recipe) => recipe.uuid !== recipeUUID);
    console.log(recipes);
    console.log(clone);
    setRecipes(clone);
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
      {/* TODO: Add loading icon */}
      {/* Element used for adding another recipe */}
      <div className="recipePreviewDiv newRecipeDiv">
        <div className="imageIconOverlay">
          <img className="recipePreviewImage recipeImageUpload"
            src={addedImage == null ? addBreadIcon : URL.createObjectURL(addedImage)}
            onClick={() => { imageInputRef.current!.click() }}
          />
          <div className="editImageIcon" hidden={addedImage == null}>
            <FontAwesomeIcon icon={faPencil} />
          </div>
        </div>
        <input type="file" name="imageUpload" ref={imageInputRef}
          onChange={(event) => {
            setAddedImage(event.target.files![0]);
          }}
          hidden
        />
        <div className="recipePreviewBelowImage">
          <h2 className="recipePreviewTitle">New Recipe</h2>
          <p className="recipePreviewDescription">Add new recipes to keep track of their steps and timing.</p>
          <Collapse in={addBreadExpanded}>
            <div>
              <Form onSubmit={handleSubmit(saveRecipe as any)}>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" {...register("name")}></Form.Control>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Description" {...register("description")}></Form.Control>

                {timers.length > 0 && <Form.Label>Steps</Form.Label>}
                <div className="editingTimersGroup">
                  {renderTimers(timers)}
                </div>
                <div className="formButtonFooter">
                  <Button className="themeBtn" onClick={() => setShowAddTimerModal(true)}><FontAwesomeIcon icon={faPlus} className="mr-5" />Add step</Button>
                  <div className="floatRightBtnGroup">
                    <Button type="submit" className="primaryBtn">Save</Button>
                    <Button variant="secondary" onClick={() => resetAddBreadMenu()} type="reset">Cancel</Button>
                  </div>
                </div>
              </Form>
            </div>
          </Collapse>
          <Button className="addBreadCollapseBtn themeBtn" onClick={() => setAddBreadExpanded(true)} hidden={addBreadExpanded}><FontAwesomeIcon icon={faPlus} /></Button>
        </div>
      </div>
      {/* Render all the saved recipes */}
      {renderRecipePreviews(recipes)}
      <AddTimerModal showModal={showAddTimerModal} setShowModalFunc={setShowAddTimerModal} timersObj={timers} setTimersFunc={setTimers} />
    </div>
  )
}

export default Recipes;