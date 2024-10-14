import { useEffect } from 'react';
import { StyledWrapper, StyledModal, StyledCloseButton } from './styles';

export default function ModalFieldCreator({ onClose }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleWrapperClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} />
            </StyledModal>
        </StyledWrapper>
    );
}
