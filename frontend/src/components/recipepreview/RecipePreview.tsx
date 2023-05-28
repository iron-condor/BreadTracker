import { Recipe, Timer } from '../../types/types';
import './RecipePreview.css';
import placeholderImage from '../../assets/placeholder.png';
import TimerBar from '../timerbar/TimerBar';

export interface RecipePreviewProps {
  recipe: Recipe;
  // img: ImageBitmap;
}

function RecipePreview(props: RecipePreviewProps) {
  return (
    <div className="recipePreviewDiv">
      <img className="recipePreviewImage" src={placeholderImage}/>
      <div className="recipePreviewBelowImage">
        <h2 className="recipePreviewTitle">{props.recipe.name}</h2>
        <p className="recipePreviewDescription">{props.recipe.description}</p>
        <TimerBar timers={props.recipe.timers} startTime={Date.now() - (2 * 60 * 1000)}/>
      </div>
    </div>
  );
}

export default RecipePreview;