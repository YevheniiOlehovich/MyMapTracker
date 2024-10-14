import { useState } from "react";
import { StyledWrapper, StyledBlock, StyledTitle, StyledButton } from "./styles";
import ModalFieldCreator from "../ModalFieldCreator";

export default function MapsContainer() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Стан для контролю модалки

    const handleButtonClick = () => {
        setIsModalOpen(true); // Відкриваємо модалку
    };

    const closeModal = () => {
        setIsModalOpen(false); // Закриваємо модалку
    };

    return (
        <>
        <StyledWrapper>
            <StyledBlock>
                <StyledTitle>Діючі поля</StyledTitle>
                <StyledButton onClick={handleButtonClick}>Відмітити поле</StyledButton>
            </StyledBlock>
            <StyledBlock></StyledBlock>
            
        </StyledWrapper>
        
        {isModalOpen && (
            <ModalFieldCreator onClose={closeModal} /> // Передаємо функцію закриття модалки
        )}
        </>
    );
}
