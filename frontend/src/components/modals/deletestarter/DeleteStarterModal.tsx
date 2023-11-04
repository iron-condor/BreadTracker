import { Button, Modal } from "react-bootstrap";
import './DeleteStarterModal.css'
import '../../../common.css';
import { toast } from "react-toastify";
import connector from "../../../utils/axiosConfig";

interface DeleteStarterModalProps {
  showModal: boolean;
  setShowModalFunc: (state: boolean) => any;
  starterUUID: string;
  deleteStarterFunc: () => void;
}

function DeleteStarterModal(props: DeleteStarterModalProps) {

  const deleteStarter = async () => {
    connector.delete('starters/' + props.starterUUID).then((result) => {
      if (result.status == 200 && result.data.success) {
        toast.success("Starter successfully deleted");
        props.setShowModalFunc(false);
        props.deleteStarterFunc();
      } else {
        toast.error("There was an error deleting this starter. Please try again later.");
      }
    }).catch((error) => {
      toast.error("There was an error deleting this starter. Please try again later.");
    });
  }

  return (
    // TODO: Add validation
    <Modal className="breadModal" show={props.showModal} onHide={() => props.setShowModalFunc(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Starter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this starter?
        <br/>
        <br/>
        <strong>This action cannot be undone.</strong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="submit" onClick={() => deleteStarter()}>
          Delete
        </Button>
        <Button variant="secondary" onClick={() => props.setShowModalFunc(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export default DeleteStarterModal;