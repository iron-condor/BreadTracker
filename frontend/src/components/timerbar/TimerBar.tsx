import { ProgressBar } from 'react-bootstrap';
import { Timer } from '../../types/types';
import './TimerBar.css'

export interface TimerBarProps {
  timers: Timer[];
  startTime: number;
}

function TimerBar(props: TimerBarProps) {

  const getTimerElems = () => {
    let ret: JSX.Element[] = [];

    for (let i = 0; i < props.timers.length; i++) {
      let timer = props.timers[i];
      let lowerPerc = timer.lowerLimit / timer.upperLimit * 100;
      let upperPerc = 100 - lowerPerc;
      console.log(timer.lowerLimit + " / " + timer.upperLimit + "\n" + lowerPerc + " " + upperPerc);
      ret.push(
        <div>
          <span>{timer.label}</span>
          <ProgressBar>
            <ProgressBar
              striped={timer.active}
              animated={timer.active}
              variant={"warning"}
              now={lowerPerc}
              label={getTimeLabel(timer.lowerLimit)}
              // key={i}
              />
            <ProgressBar
              striped={timer.active}
              animated={timer.active}
              variant={"danger"}
              now={upperPerc}
              label={getTimeLabel(timer.upperLimit)}
              visuallyHidden={timer.lowerLimit == timer.upperLimit}
              // key={i}
              />
          </ProgressBar>
        </div>
      );
    }

    return ret;
  }

  const getTotalTime = () => {
    let total = 0;

    for (let timer of props.timers) {
      total += timer.upperLimit;
    }

    return total;
  }

  const getTimeLabel = (duration: number): string => {
    let ms = duration % 1000;
    duration = (duration - ms) / 1000;
    let secs = duration % 60;
    duration = (duration - secs) / 60;
    let mins = duration % 60;
    let hrs = (duration - mins) / 60;
  
    let str = "";
    if (hrs != 0) {
      str += hrs + " hour" + (hrs > 1 ? "s " : " ");
    }
    if (mins != 0) {
      str += mins + " minute" + (mins > 1 ? "s " : " ");
    }
    if (secs != 0) {
      str += secs + " second" + (secs > 1 ? "s " : " ");
    }
    return str;
  }

  return (
    // <ProgressBar>
    <div>
      {getTimerElems()}
    </div>
    //{/* </ProgressBar> */}
  )
}


export default TimerBar;