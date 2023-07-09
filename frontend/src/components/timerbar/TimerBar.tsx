import { ProgressBar } from 'react-bootstrap';
import { Timer } from '../../types/types';
import './TimerBar.css'
import { getTimeLabel } from '../../utils/timeFuncs';

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
      ret.push(
        <div key={"timerBarDiv" + i}>
          <span>{timer.label}</span>
          <ProgressBar>
            <ProgressBar
              striped={timer.active}
              animated={timer.active}
              variant={"warning"}
              now={lowerPerc}
              label={getTimeLabel(timer.lowerLimit)}
              />
            <ProgressBar
              striped={timer.active}
              animated={timer.active}
              variant={"danger"}
              now={upperPerc}
              label={getTimeLabel(timer.upperLimit)}
              visuallyHidden={timer.lowerLimit == timer.upperLimit}
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

  return (
    // <ProgressBar>
    <div>
      {getTimerElems()}
    </div>
    //{/* </ProgressBar> */}
  )
}


export default TimerBar;