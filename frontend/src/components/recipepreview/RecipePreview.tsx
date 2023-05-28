import { Recipe } from '../../types/types';
import './RecipePreview.css';
import placeholderImage from '../../assets/placeholder.png';
import TimerBar from '../timerbar/TimerBar';
import { Button, Collapse } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../../common.css';

export interface RecipePreviewProps {
  recipe: Recipe;
  // img: ImageBitmap;
}

function RecipePreview(props: RecipePreviewProps) {
  const [timersExpanded, setTimersExpanded] = useState<boolean>(false);

  return (
    <div className="recipePreviewDiv">
      <img className="recipePreviewImage" src={placeholderImage}/>
      <div className="recipePreviewBelowImage">
        <h2 className="recipePreviewTitle">{props.recipe.name}</h2>
        <p className="recipePreviewDescription">{props.recipe.description}</p>
        <Collapse in={timersExpanded}>
          <div>
            <TimerBar timers={props.recipe.timers} startTime={Date.now() - (2 * 60 * 1000)}/>
          </div>
        </Collapse>
        <Button className="timerCollapseBtn themeBtn" onClick={() => setTimersExpanded(!timersExpanded)}><FontAwesomeIcon icon={timersExpanded ? faChevronUp : faChevronDown}/></Button>
      </div>
    </div>
  );
}

export default RecipePreview;