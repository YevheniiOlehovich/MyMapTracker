import styled from 'styled-components';
import backgroundImage from '../../assets/field.webp';

const Styles = {
    wrapper: styled.div`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
        background-image: url(${backgroundImage}); /* Шлях до вашого зображення */
        background-size: cover; /* Масштабування зображення */
        background-position: center; /* Центрування зображення */
        background-repeat: no-repeat; /* Заборона повторення */
    `,
    form: styled.form`
        background: #fff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 300px;
        text-align: center;
    `,
    title: styled.h2`
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
    `,
    input: styled.input`
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    `,
    button: styled.button`
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }
    `,
    errorMessage: styled.p`
        color: red;
        font-size: 14px;
    `,
};

export default Styles;