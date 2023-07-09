import { Recipe } from '../../types/types';
import './RecipePreview.css';
import placeholderImage from '../../assets/placeholder.png';
import TimerBar from '../timerbar/TimerBar';
import { Button, Collapse } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import '../../common.css';
import { fromBase64 } from '../../utils/usefulFuncs';
import DeleteRecipeModal from '../modals/deleterecipe/DeleteRecipeModal';

export interface RecipePreviewProps {
  recipe: Recipe;
  img?: string;
  deleteRecipeFunc: () => void;
}

function RecipePreview(props: RecipePreviewProps) {
  const [timersExpanded, setTimersExpanded] = useState<boolean>(false);
  const [showDeleteRecipeModal, setShowDeleteRecipeModal] = useState<boolean>(false);

  return (
    <div className="recipePreviewDiv">
      <div className="recipePreviewImageBg">
        <img className="recipePreviewImage" src={(props.img != null) ? props.img : placeholderImage}/>
      </div>
      {/* <img className="recipePreviewImage" src={placeholderImage}/> */}
      <div className="recipePreviewBelowImage">
        <div className="flex-space-between flex-baseline">
          <h2 className="recipePreviewTitle">{props.recipe.name}</h2>
          <FontAwesomeIcon
            icon={faTrashCan} className="twenty-pt primaryColorIcon"
            onClick={() => {setShowDeleteRecipeModal(true)}}
          />
        </div>
        <p className="recipePreviewDescription">{props.recipe.description}</p>
        <Collapse in={timersExpanded}>
          <div>
            <TimerBar timers={props.recipe.timers} startTime={Date.now() - (2 * 60 * 1000)}/>
          </div>
        </Collapse>
        <Button className="timerCollapseBtn themeBtn" onClick={() => setTimersExpanded(!timersExpanded)}><FontAwesomeIcon icon={timersExpanded ? faChevronUp : faChevronDown}/></Button>
      </div>
      <DeleteRecipeModal showModal={showDeleteRecipeModal} setShowModalFunc={setShowDeleteRecipeModal} recipeUUID={props.recipe.uuid} deleteRecipeFunc={props.deleteRecipeFunc}/>
    </div>
  );
}

export default RecipePreview;