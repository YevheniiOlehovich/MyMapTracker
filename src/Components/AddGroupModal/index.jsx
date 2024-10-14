import {StyledWrapper, StyledModal, StyledCloseButton} from './styles';
import closeModal from "../../helpres/closeModal";

export default function AddGroupModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} /> 
            </StyledModal>
        </StyledWrapper>
    );
}
