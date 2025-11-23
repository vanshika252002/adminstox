import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";

const CustomModal = ({
  open,
  setOpen,
  inputAttribute,
  setInputAttribute,
  handleAddAttribute,
    isEditMode = false,
}) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>Add Attribute</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAttribute();
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Attribute Name</FormLabel>
              <Input
                placeholder="Enter name"
                value={inputAttribute}
                onChange={(e) => setInputAttribute(e.target.value.toLowerCase())}
              />
            </FormControl>

            <button type="submit" className="btn common-button">
              Submit
            </button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default CustomModal;
