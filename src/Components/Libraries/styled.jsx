import styled from 'styled-components';

const Styles = {
    wrapper: styled.div`
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        max-width: 1200px;
        width: 100%;
        height: 100vh;
        padding: 120px 20px 20px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    `,
    menu: styled.div`
        position: relative;
        width: 100%;
        height: 60px;
        padding: 10px;
        border: 1px solid black;
        display: flex;
        justify-content: space-between;
    `,
    block: styled.div`
        position: relative;
        width: 100%;
        height: calc(100% - 80px);
        border: 1px solid black;
        overflow-y: auto;
    `
};

export default Styles;