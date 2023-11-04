import { Starter } from '../../types/types';
import './StarterPreview.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleWhole, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import '../../common.css';
import DeleteStarterModal from '../modals/deletestarter/DeleteStarterModal';
import connector from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';

export interface StarterPreviewProps {
  starter: Starter;
  // img?: string;
  deleteStarterFunc: () => void;
  feedStarterFunc: () => void;
}

const SECONDS_IN_A_MINUTE = 60;
const SECONDS_IN_AN_HOUR = SECONDS_IN_A_MINUTE * 60;
const SECONDS_IN_A_DAY = SECONDS_IN_AN_HOUR * 24;

function StarterPreview(props: StarterPreviewProps) {
  const [showDeleteStarterModal, setShowDeleteStarterModal] = useState<boolean>(false);

  const feedStarter = async () => {
    connector.put('starters/' + props.starter.uuid).then((result) => {
      if (result.status == 200 && result.data.success) {
        // TODO: Remove this toast
        toast.success("Starter fed");
        props.feedStarterFunc();
      } else {
        toast.error("There was an error feeding this starter.");
      }
    }).catch((error) => {
      toast.error("There was an error feeding this starter.");
    });
  }

  return (
    <div className="starterPreviewDiv">
      {/* <div className="starterPreviewImageBg">
        <img className="starterPreviewImage" src={(props.img != null) ? props.img : placeholderImage}/>
      </div> */}
      {/* <img className="starterPreviewImage" src={placeholderImage}/> */}
      <div className="starterPreviewBelowImage">
        <div className="flex-space-between flex-baseline">
          <h2 className="starterPreviewTitle">{props.starter.name}</h2>
          <FontAwesomeIcon
            icon={faTrashCan} className="twenty-pt primaryColorIcon"
            onClick={() => {setShowDeleteStarterModal(true)}}
          />
        </div>
        <h5>{props.starter.flourType} Starter</h5>
        <h5>Last fed {(new Date(props.starter.timeLastFed)).toLocaleDateString()}</h5>
        <h5>Needs feeding in {getTimeString((props.starter.nextFeedingTime ?? getCurrentTime()) - getCurrentTime(), "hours")}</h5>
        <Button onClick={() => feedStarter()} className="primaryBtn"><FontAwesomeIcon icon={faAppleWhole}/> Feed Starter</Button>
      </div>
      <DeleteStarterModal showModal={showDeleteStarterModal} setShowModalFunc={setShowDeleteStarterModal} starterUUID={props.starter.uuid} deleteStarterFunc={props.deleteStarterFunc}/>
    </div>
  );
}

const getCurrentTime = (): number => {return (new Date().getTime())}

const getTimeString = (time: number, precision: "days" | "hours" | "minutes" | "seconds") => {
  // Convert to seconds
  time = time / 1000;
  let days = Math.floor(time / SECONDS_IN_A_DAY);
  time -= days * SECONDS_IN_A_DAY;
  let hours = Math.floor(time / SECONDS_IN_AN_HOUR);
  time -= hours * SECONDS_IN_AN_HOUR;
  let minutes = Math.floor(time / SECONDS_IN_A_MINUTE);
  time -= minutes * SECONDS_IN_A_MINUTE;
  let seconds = Math.floor(time);

  let ret = "";
  switch (precision) {
    case "seconds":
      ret = ` and ${seconds} seconds` + ret;
    case "minutes":
      ret = ` ${minutes} minutes` + ret;
    case "hours":
      ret = ` ${hours} hours` + ret;
    case "days":
      ret = `${days} days` + ret;
  }
  return ret;
}

export default StarterPreview;