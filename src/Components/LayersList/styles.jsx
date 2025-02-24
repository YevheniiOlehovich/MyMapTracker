import styled from 'styled-components';

const Styles = {
    wrapper: styled.div`
        position: absolute;
        top: 0;
        right: ${({ isVisible }) => (isVisible ? '0' : '-270px')};
        width: 300px;
        height: 100vh;
        background-color: gray;
        z-index: 5;
        transition: right 0.3s ease-in-out;
        padding: 10px;
    `,
    showBtn: styled.div`
        position: absolute;
        width: 20px;
        height: 20px;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        border: 1px solid black;
    `,
    showBtnImg: styled.img`
        width: 100%;
        height: 100%;
        object-fit: contain;
    `,
    Title: styled.h3`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 16px;
        display: block;
        margin: 0;
    `,
};

export default Styles;