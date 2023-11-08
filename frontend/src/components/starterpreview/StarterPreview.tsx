import { Starter } from '../../types/types';
import './StarterPreview.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleWhole, faBasketShopping, faSnowflake, faTemperatureHalf, faTrashCan, faWheatAlt } from '@fortawesome/free-solid-svg-icons';
import '../../common.css';
import DeleteStarterModal from '../modals/deletestarter/DeleteStarterModal';
import connector from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';

export interface StarterPreviewProps {
  starter: Starter;
  // img?: string;
  deleteStarterFunc: () => void;
  feedStarterFunc: (starter: Starter) => void;
  moveStarterFunc: (starter: Starter) => void;
}

const MILLISECONDS_IN_A_MINUTE = 1000 * 60;
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * 60;
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * 24;

function StarterPreview(props: StarterPreviewProps) {
  const [showDeleteStarterModal, setShowDeleteStarterModal] = useState<boolean>(false);
  const hungry = needsFeedingToday((props.starter.nextFeedingTime ?? getCurrentTime()) - getCurrentTime());

  const feedStarter = async () => {
    connector.put('starters/feed/' + props.starter.uuid).then((result) => {
      if (result.status == 200 && result.data.success) {
        console.log(result.data.starter);
        props.feedStarterFunc(result.data.starter);
      } else {
        toast.error("There was an error feeding this starter.");
      }
    }).catch((error) => {
      toast.error("There was an error feeding this starter.");
    });
  }

  const moveStarter = async () => {
    connector.put('starters/move/' + props.starter.uuid + '?inFridge=' + !props.starter.inFridge).then((result) => {
      if (result.status == 200 && result.data.success) {
        console.log(result.data.starter);
        props.moveStarterFunc(result.data.starter);
      } else {
        toast.error("There was an error feeding this starter.");
      }
    }).catch((error) => {
      toast.error("There was an error feeding this starter.");
    });
  }

  return (
    <div className={`${hungry ? "hungryStarterPreview" : ""} starterPreviewDiv`}>
      {/* <div className="starterPreviewImageBg">
        <img className="starterPreviewImage" src={(props.img != null) ? props.img : placeholderImage}/>
      </div> */}
      {/* <img className="starterPreviewImage" src={placeholderImage}/> */}
      <div className="starterPreviewBelowImage">
        <div className="flex-space-between flex-baseline">
          <h2 className="starterPreviewTitle">{props.starter.name + (hungry ? " is hungry" : "")}</h2>
          <FontAwesomeIcon
            icon={faTrashCan} className="twenty-pt primaryColorIcon"
            onClick={() => {setShowDeleteStarterModal(true)}}
          />
        </div>
        <h5><FontAwesomeIcon icon={faWheatAlt}/> {props.starter.flourType} Starter</h5>
        {/* The time it was last fed */ }
        <h5>{getTimeString(getCurrentTime() - props.starter.timeLastFed, false)}</h5>
        {/* When it needs to be fed again */ }
        <h5>{getTimeString((props.starter.nextFeedingTime ?? getCurrentTime()) - getCurrentTime(), true)}</h5>
        <div className="locationFeedDiv">
          <div className="starterLocationDiv">
            <p>Location</p>
            <div className="locationSwitchContainer">
              <div className="locationIconLabelBox">
                <FontAwesomeIcon icon={faBasketShopping}/>
                <span>Counter</span>
              </div>
              <Form.Switch checked={props.starter.inFridge} onChange={moveStarter} className="fridgeCounterSwitch"/>
              <div className="locationIconLabelBox">
                <FontAwesomeIcon icon={faSnowflake}/>
                <span>Fridge</span>
              </div>
            </div>
          </div>
          <Button onClick={() => feedStarter()} className="themeBtn squareButton feedStarterBtn">
            <FontAwesomeIcon icon={faAppleWhole}/>
            <br/>
            Feed Starter
            </Button>
        </div>
      </div>
      <DeleteStarterModal showModal={showDeleteStarterModal} setShowModalFunc={setShowDeleteStarterModal} starterUUID={props.starter.uuid} deleteStarterFunc={props.deleteStarterFunc}/>
    </div>
  );
}

const getCurrentTime = (): number => {return (new Date().getTime())}

const needsFeedingToday = (time: number): boolean => { return Math.round(time / MILLISECONDS_IN_A_DAY) <= 0 };

const getTimeString = (time: number, future: boolean) => {
  let days = Math.round(time / MILLISECONDS_IN_A_DAY);
  let ret = `${Math.abs(days)} days`;

  if (days == 0) {
    ret = "today";
  } else if (days == -1) {
    ret = "yesterday";
  } else if (days == 1) {
    if (future) {
      ret = "tomorrow";
    } else {
      ret = "yesterday";
    }
  } else {
    if (future && days > 0) {
      ret = "in " + ret;
    } else {
      ret = ret + " ago";
    }
  }

  if (future) {
    if (days < 0) {
      ret = "Needed feeding " + ret;
    } else {
      ret = "Needs feeding " + ret;
    }
  } else {
    ret = "Last fed " + ret;
  }

  return ret;
}

export default StarterPreview;