import styled from 'styled-components';

const Styles = {
    wrapper: styled.div`
        width: 100vw;
        height: 100vh; 
        position: relative;
        top: 0;
        right: 0;
        z-index: 3;
    `,
    fieldLabelContainer: `
        background: white;
        padding: 5px 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        width: 100px;
    `,
    fieldLabelDot: `
        background: blue;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    `,
    fieldPolygonStyle: {
        color: 'blue',
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.05,
    },
};

export default Styles;