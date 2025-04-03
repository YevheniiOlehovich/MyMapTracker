import styled from 'styled-components';

const Styles = {
    wrapper: styled.div`
        position: absolute;
        top: 0;
        /* right: ${({ isVisible }) => (isVisible ? '0' : '-270px')}; */
        right: ${({ $isVisible }) => ($isVisible ? '0' : '-270px')};
        width: 330px;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 5;
        transition: right 0.3s ease-in-out;
        padding: 10px 10px 10px 30px;
    `,
    showBtn: styled.div`
        position: absolute;
        width: 20px;
        height: 20px;
        left: 5px;
        top: 50%;
        /* transform: translateY(-50%) rotate(${({ isVisible }) => (isVisible ? '180deg' : '0deg')}); */
        transform: translateY(-50%) rotate(${({ $isVisible }) => ($isVisible ? '180deg' : '0deg')});

        cursor: pointer;
        border: 1px solid black;
        transition: transform 0.3s ease-in-out;
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
    maplist: styled.div`
        display: flex;
        flex-direction: column;
        margin: 0 0 20px 20px;
    `,
    Block: styled.div`
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        margin-bottom: 12px;
    `,
    label: styled.label`
        &:not(:last-child) {
            margin-bottom: 12px;
        }
    `,
    btn: styled.div`
        width: 20px;
        height: 20px;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        box-sizing: border-box;
        padding: 0;
        cursor: pointer;
        transition: border 0.2s ease;
        &:hover{
            border: 2px solid black;
        }
        &:not(:first-child){
            margin-left: 8px;
        }
    `,
    btnIco: styled.img`
        width: 12px;
        height: 12px;
        background-image: url(${props => props.$pic});
        background-size: cover;
        background-position: center;
        transition: 0.2s ease;
        /* transform: rotate(${props => props.rotation}deg); */
        transform: rotate(${props => props.$rotation}deg);
    `,
    
};

export default Styles;