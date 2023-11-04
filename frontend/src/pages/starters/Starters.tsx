import { useEffect, useRef, useState } from "react";
import { BaseResponse, Recipe, Starter, Timer } from "../../types/types";
import connector from "../../utils/axiosConfig";
import RecipePreview from "../../components/recipepreview/RecipePreview";
import './Starters.css';
import { Button, Collapse, Form } from "react-bootstrap";
import addBreadIcon from "../../assets/addBreadIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import AddTimerModal from "../../components/modals/addtimer/AddTimerModal";
import { getTimeLabel, toBase64 } from "../../utils/usefulFuncs";
import '../../common.css';
import { toast } from "react-toastify";
import StarterPreview from "../../components/starterpreview/StarterPreview";

interface GetStartersResponse extends BaseResponse {
  starterList: Starter[];
}

interface AddStarterRequest {
  flourType: String;
  inFridge: boolean;
  timeLastFed: number;
}

interface AddStarterRequest extends BaseResponse {
  newStarter: Starter;
}

function Starters() {
  const [starters, setStarters] = useState<Starter[]>([]);
  const [addStarterExpanded, setAddStarterExpanded] = useState<boolean>(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const loadStarters = async () => {
    await connector.get('starters')
      .then((result) => {
        if (result.status == 200 && result.data.success) {
          let data: GetStartersResponse = result.data;
          setStarters(data.starterList);
        } else {
          // TODO: Handle error
        }
      }).catch((error) => {
        // TODO: Handle error
      });
  }

  const resetAddStarterMenu = () => {
    setAddStarterExpanded(false);
    // setValue("name", "");
    // setValue("description", "");
    // imageInputRef.current.value = null;
  }

  const saveStarter: SubmitHandler<AddStarterRequest> = async (data: AddStarterRequest) => {
    await connector.post('starters', data)
      .then((result) => {
        if (result.status == 200 && result.data.success) {
          setStarters([...starters, result.data.newStarter])
          resetAddStarterMenu();
        } else {
          toast.error("There with an issue saving this starter.")
        }
      }).catch((error) => {
        // TODO: Handle error
      });
  }

  const renderStarterPreviews = (starters: Starter[]) => {
    let ret: JSX.Element[] = [];

    for (let starter of starters) {
      ret.push(<StarterPreview starter={starter}  key={starter.uuid} /* img={recipe.image} */ deleteStarterFunc={() => deleteStarter(starter.uuid)} feedStarterFunc={() => feedStarter(starter.uuid)} />)
      // if (recipe.image != null) {
      //   ret.push(<RecipePreview recipe={recipe} key={recipe.uuid} img={recipe.image} deleteRecipeFunc={() => deleteRecipe(recipe.uuid)} />)
      // } else {
      //   ret.push(<RecipePreview recipe={recipe} key={recipe.uuid} deleteRecipeFunc={() => deleteRecipe(recipe.uuid)} />)
      // }
    }

    return ret;
  }

  const deleteStarter = (starterUUID: string): void => {
    let clone = starters.filter((starter) => starter.uuid !== starterUUID);
    console.log(starters);
    console.log(clone);
    setStarters(clone);
  }

  const feedStarter = (starterUUID: string): void => {
    // TODO: Do any special activities here
  }

  useEffect(() => {
    loadStarters();
  }, []);

  return (
    <div className="starterPreviewContainer">
      {/* TODO: Add loading icon */}
      {/* Element used for adding another starter */}
      <div className="starterPreviewDiv newStarterDiv">
        <div className="starterPreviewBelowImage">
          <h2 className="starterPreviewTitle">New Starter</h2>
          <p className="starterPreviewDescription">Add new starters to keep track of their feeding schedules.</p>
          <Collapse in={addStarterExpanded}>
            <div>
              <Form onSubmit={handleSubmit(saveStarter as any)}>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Name" {...register("name")}></Form.Control>
                <Form.Label>Flour type</Form.Label>
                <Form.Select {...register("flourType")}>
                  <option>Bread flour</option>
                  <option>Whole wheat flour</option>
                  <option>Rye flour</option>
                </Form.Select>
                {/* TODO: Make this an icon, with a counter on one side and a snowflake on the other */}
                <div className="sameRow">
                  <Form.Label>In fridge</Form.Label>
                  <Form.Check defaultChecked={true} className="ml-5" {...register("inFridge")}></Form.Check>
                </div>

                <div className="formButtonFooter">
                  <div className="floatRightBtnGroup">
                    <Button type="submit" className="primaryBtn">Save</Button>
                    <Button variant="secondary" onClick={() => resetAddStarterMenu()} type="reset">Cancel</Button>
                  </div>
                </div>
              </Form>
            </div>
          </Collapse>
          <Button className="addBreadCollapseBtn themeBtn" onClick={() => setAddStarterExpanded(true)} hidden={addStarterExpanded}><FontAwesomeIcon icon={faPlus} /></Button>
        </div>
      </div>
      {/* Render all the saved starters */}
      {renderStarterPreviews(starters)}
    </div>
  )
}

export default Starters;