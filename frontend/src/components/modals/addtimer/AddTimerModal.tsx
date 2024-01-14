import { Button, ButtonGroup, Form, InputGroup, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import './AddTimerModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faInfoCircle, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { Timer } from "../../../types/types";
import { useForm } from "react-hook-form";
import '../../../common.css';

interface AddTimerModalProps {
  showModal: boolean;
  setShowModalFunc: (state: boolean) => any;
  timersObj: Timer[];
  setTimersFunc: (newTimers: Timer[]) => any;
}

interface AddTimerFormData {
  name: string;
  overnight?: boolean;
  softLimitHours?: number;
  softLimitMinutes?: number;
  hardLimitHours?: number;
  hardLimitMinutes?: number;
}

function AddTimerModal(props: AddTimerModalProps) {
  const [isOvernightTimer, setIsOvernightTimer] = useState<boolean>(false);
  const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm();
  const [numSoftHours, setNumSoftHours] = useState<number>(0);
  const [numSoftMinutes, setNumSoftMinutes] = useState<number>(0);
  const [numHardHours, setNumHardHours] = useState<number>(0);
  const [numHardMinutes, setNumHardMinutes] = useState<number>(0);
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
      <br/>
      <br/>
      A step timer can also represent an Overnight step. When Overnight is selected, the recipe will pause at this step and wait until it is resumed the next day.
    </Popover.Body>
  </Popover>);

  const hoursToMs = (hours: number): number => {return hours * 60 * 60 * 1000};
  const minutesToMs = (minutes: number): number => {return minutes * 60 * 1000};

  const updateTimers = (data: AddTimerFormData) => {
    const lowerLimit = (data.softLimitHours != undefined && data.softLimitMinutes) ? (hoursToMs(data.softLimitHours) + minutesToMs(data.softLimitMinutes)) : -1;
    const upperLimit = (data.hardLimitHours != undefined && data.hardLimitMinutes) ? (hoursToMs(data.hardLimitHours) + minutesToMs(data.hardLimitMinutes)) : -1;
    const newTimer: Timer = {
      label: data.name,
      lowerLimit: lowerLimit,
      upperLimit: upperLimit,
      overnight: isOvernightTimer ? isOvernightTimer : false
    };
    props.setTimersFunc([...props.timersObj, newTimer]);
    props.setShowModalFunc(false);
  }

  useEffect(() => {
    if (numHardHours < numSoftHours) {
      setNumHardHours(numSoftHours);
    }
    if (numHardMinutes < numSoftMinutes && numHardHours <= numSoftHours) {
      setNumHardMinutes(numSoftMinutes);
    }
  }, [numSoftHours, numSoftMinutes]);

  useEffect(() => {
    if (numHardHours < numSoftHours) {
      setNumSoftHours(numHardHours);
    }
    if (numHardMinutes < numSoftMinutes && numHardHours <= numSoftHours) {
      setNumSoftMinutes(numHardMinutes);
    }
  }, [numHardHours, numHardMinutes]);

  return (
    // TODO: Add validation
    <Modal className="breadModal" show={props.showModal} onHide={() => props.setShowModalFunc(false)}>
      <Form onSubmit={handleSubmit(updateTimers)}>

        <Modal.Header closeButton>
          <Modal.Title>Add Step Timer
            <OverlayTrigger trigger={["hover", "focus"]} placement="right" overlay={popover}>
              <FontAwesomeIcon icon={faInfoCircle} className="infoTooltipButton"/>
            </OverlayTrigger>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Name</Form.Label>
          <Form.Control required placeholder="Name" {...register("name")}></Form.Control>
          <br/>
          <ButtonGroup>
            <Button className={isOvernightTimer ? "primaryBtn" : ""} variant={isOvernightTimer ? "primary" : "secondary"} onClick={() => setIsOvernightTimer(true)}>Overnight</Button>
            <Button className={!isOvernightTimer ? "primaryBtn" : ""} variant={!isOvernightTimer ? "primary" : "secondary"} onClick={() => setIsOvernightTimer(false)}>Limit based</Button>
          </ButtonGroup>
          <Form.Group hidden={isOvernightTimer}>
            <br/>
            <Form.Label>Soft limit</Form.Label>
            <InputGroup className="timerLimitInputGroup">
              <Form.Control defaultValue={0} inputMode="numeric" type="number" min={0} value={numSoftHours} {...register("softLimitHours")} onChange={(e) => {setNumSoftHours(Number(e.target.value))}}/>
              <InputGroup.Text>hours</InputGroup.Text>
              <Form.Control defaultValue={0} inputMode="numeric" type="number" min={0} value={numSoftMinutes} max={59} {...register("softLimitMinutes")} onChange={(e) => {setNumSoftMinutes(Number(e.target.value))}}/>
              <InputGroup.Text>minutes</InputGroup.Text>
            </InputGroup>
            <br/>
            <Form.Label>Hard limit</Form.Label>
            <InputGroup className="timerLimitInputGroup">
              <Form.Control required defaultValue={0} inputMode="numeric" type="number" min={0} value={numHardHours} {...register("hardLimitHours")} onChange={(e) => {setNumHardHours(Number(e.target.value))}}/>
              <InputGroup.Text>hours</InputGroup.Text>
              <Form.Control required defaultValue={0} inputMode="numeric" type="number" min={0} value={numHardMinutes} max={59} {...register("hardLimitMinutes")} onChange={(e) => {setNumHardMinutes(Number(e.target.value))}}/>
              <InputGroup.Text>minutes</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="primaryBtn" type="submit">
            Save
          </Button>
          <Button variant="secondary" onClick={() => props.setShowModalFunc(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}


export default AddTimerModal;