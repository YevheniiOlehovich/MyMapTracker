import { styled }from 'styled-components'

const Styles = {
    wrapper: styled.div`
        box-sizing: border-box;
        position: relative;
        width: 60px;
        height: 200px;
        background: rgba(0, 0, 0, 0.2);
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;    
        justify-content: space-between;
    `,
    
    button: styled.button`
        width: 40px;
        height: 40px;
        display: block;
        background: ${({ $bgImage }) => `url(${$bgImage}) no-repeat center/contain`};
        border: none;

        ${({ $active }) =>
            $active &&
            `
            border: 2px solid #000;
            border-radius: 20%;
            background-color: rgba(0, 0, 0, 0.1);
            `}

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            border: 1px solid black;
            border-radius: 20%;
        }
    `
}

export default Styles;