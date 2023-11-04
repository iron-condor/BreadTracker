import { Button, Modal } from "react-bootstrap";
import './DeleteRecipeModal.css'
import { useState } from "react";
import { Timer } from "../../../types/types";
import '../../../common.css';
import connector from "../../../utils/axiosConfig";
import { toast } from "react-toastify";

interface DeleteRecipeModalProps {
  showModal: boolean;
  setShowModalFunc: (state: boolean) => any;
  recipeUUID: string;
  deleteRecipeFunc: () => void;
}

function DeleteRecipeModal(props: DeleteRecipeModalProps) {

  const deleteRecipe = async () => {
    connector.delete('recipes/' + props.recipeUUID).then((result) => {
      if (result.status == 200 && result.data.success) {
        toast.success("Recipe successfully deleted");
        props.setShowModalFunc(false);
        props.deleteRecipeFunc();
      } else {
        toast.error("There was an error deleting this recipe. Please try again later.");
      }
    }).catch((error) => {
      toast.error("There was an error deleting this recipe. Please try again later.");
    });
  }

  return (
    // TODO: Add validation
    <Modal className="breadModal" show={props.showModal} onHide={() => props.setShowModalFunc(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this recipe?
        <br/>
        <br/>
        <strong>This action cannot be undone.</strong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="submit" onClick={() => deleteRecipe()}>
          Delete
        </Button>
        <Button variant="secondary" onClick={() => props.setShowModalFunc(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export default DeleteRecipeModal;