import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
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
  title = "Add Attribute",
  label = "Attribute Name",
  placeholder = "Enter name",
  error = "",
}) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>{title}</DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddAttribute();
          }}
        >
          <Stack spacing={2}>
            <FormControl error={!!error}>
              <FormLabel>{label}</FormLabel>
              <Input
                placeholder={placeholder}
                value={inputAttribute}
                onChange={(e) => setInputAttribute(e.target.value.toLowerCase())}
                error={!!error}
              />
              {error && (
                <p style={{ color: "red", fontSize: "0.875rem", margin: "4px 0 0 0" }}>
                  {error}
                </p>
              )}
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