import { styled, css } from 'styled-components';

const Styles = {
    title: styled.h3`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 16px;
        display: block;
        margin: 0 8px 12px;
    `,
    subTitle: styled.h4`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 15px;
        display: block;
        margin: 0 8px 12px;
    `,
    block: styled.div`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 40px;
        padding: 0;
    `,
    buttonBlock: styled.div`
        display: flex;
        width: auto;
        justify-content: space-between;
    `,
    subtitle: styled.h4`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 14px;
        display: block;
        margin: 0;
        display: block;
    `,
    button: styled.button`
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
        &:hover {
            border: 2px solid black;
        }
        &:not(:first-child) {
            margin-left: 8px;
        }
    `,
    ico: styled.div`
        width: 12px;
        height: 12px;
        background-image: url(${props => props.pic});
        background-size: cover;
        background-position: center;
        transition: 0.2s ease;
        transform: rotate(${props => props.rotation}deg);
    `,
    list: styled.ul`
        list-style: none;
        padding: 0px;
        margin: 0;
        width: 100%;
    `,
    listItem: styled.li`
        list-style: none;
        margin-bottom: 4px;
        box-sizing: border-box;
        padding: 0;
        border: ${({ hasBorder }) => (hasBorder ? '1px solid black' : 'none')};
    `,
    mainList: styled.ul`
        list-style: none;
        padding: 0 8px;
        margin: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    `,
    span: styled.span`
        margin: 0 0 8px 0;
        display: block;
    `,
    imgBlock: styled.div`
        width: 32px;
        height: 32px;
        margin-right: 12px;
        background-size: cover;
        background-position: center;
        background-image: ${({ imageUrl }) => `url(${imageUrl})`};
    `,
};

export default Styles;