import { StyledButton } from "./styles";

export default function Button({ text, onClick }) {  // Додаємо onClick
    return (
        <StyledButton onClick={onClick}>{text}</StyledButton>  // Використовуємо onClick
    );
}
