import { styled } from 'styled-components';

const Styles = {
    mainList: styled.div`
        position: absolute;
        top: 0px;
        left: 60px;
        width: 300px;
        padding: 0 8px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.2);
    `,
    header: styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        cursor: pointer;
        border-bottom: 1px solid #ccc;
    `,
    title: styled.h3`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 16px;
        margin: 0;
    `,
    list: styled.ul`
        list-style: none;
        padding: 0;
        margin: 8px 0 0 0;
        width: 100%;
    `,
    listItem: styled.li`
        margin-bottom: 4px;
        border: ${({ $hasBorder }) => ($hasBorder ? '1px solid #ccc' : 'none')};
        border-radius: 4px;
        padding: 6px 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f9f9f9;
    `,
    block: styled.div`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,
    subtitle: styled.h4`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 14px;
        margin: 0;
    `,
    buttonBlock: styled.div`
        display: flex;
        gap: 8px;
    `,
    button: styled.button`
        width: 20px;
        height: 20px;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        padding: 0;
        cursor: pointer;
        transition: border 0.2s ease;

        &:hover {
            border: 2px solid black;
        }
    `,
    ico: styled.div`
        width: 12px;
        height: 12px;
        background-image: url(${(props) => props.$pic});
        background-size: cover;
        background-position: center;
        transition: transform 0.2s ease;
        transform: rotate(${(props) => props.$rotation || 0}deg);
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
        background-image: ${({ $imageUrl }) => ($imageUrl ? `url(${$imageUrl})` : 'none')};
    `,
};

export default Styles;
