import styled from 'styled-components';
import ClosePic from '../../assets/ico/close-icon.png'

const Styles = {
    wrapper: styled.div`
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    `,
    modal: styled.div`
        width: 400px;
        height: 750px;
        background: white;
        padding: 10px;
        display: flex;
        flex-direction: column;
        position: relative;
    `,
    closeButton: styled.button`
        width: 20px;
        height: 20px;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 50%;
        border: 1px solid black;
        background-image: url(${ClosePic});
        background-size: contain;
        background-repeat: no-repeat; 
        cursor: pointer;
        transition: 0.4s;
        &:hover{
            transform: rotate(180deg);
        }
    `,
    title: styled.h4`
        font-family: Arial, sans-serif;
        font-weight: 700;
        font-size: 17px;
        color: black;
        margin: 0;
        margin-bottom: 20px;
    `,
    label: styled.label`
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `,
    subtitle: styled.h5`
        font-family: Arial, sans-serif;
        font-weight: 700;
        font-size: 15px;
        color: black;
        margin: 0;
    `,
    input: styled.input`
        width: 200px;
        height: 30px;
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
        font-family: Arial, sans-serif;
        font-size: 15px;
        background-color: ${(props) => (props.disabled ? 'lightgrey' : 'white')}; // Додаємо фон для заблокованого інпуту
    `,
    textarea: styled.textarea`
        width: 100%;
        height: 100px;
        border: 1px solid grey;
        resize: none; 
        word-wrap: break-word; 
        overflow: auto; 
        background-color: ${(props) => (props.disabled ? 'lightgrey' : 'white')}; // Додаємо фон для заблокованого textarea
    `,
};

export default Styles;