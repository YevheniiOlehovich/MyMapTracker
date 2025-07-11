import { styled } from 'styled-components';

const Styles = {
    mainList: styled.div`
        position: absolute;
        top: 0;
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
        height: 50px;
    `,

    title: styled.h3`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 18px;
        margin: 0;
        color: #222;
    `,

    list: styled.ul`
        list-style: none;
        padding: 0;
        margin: 8px 0 0 0;
        width: 100%;
        max-height: calc(100vh - 70px);
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #999 #f0f0f0;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #999;
            border-radius: 3px;
        }

        &::-webkit-scrollbar-track {
            background: #f0f0f0;
        }
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
        transition: background-color 0.2s ease;
        &:hover {
            background-color: #f0f0f0;
        }
    `,

    block: styled.div`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `,

    groupTitle: styled.h4`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: 13px;
        margin: 12px 0 4px 0;
        color: black;
    `,

    functionTitle: styled.h5`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
        font-size: 12px;
        margin: 8px 0 4px 12px;
        color: black;
    `,

    personName: styled.p`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 500;
        font-size: 13px;
        margin: 0;
        color: #222;
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
        font-size: 13px;
        color: #333;
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
