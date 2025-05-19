import { styled }from 'styled-components'

const Styles = {
    wrapper: styled.div`
        box-sizing: border-box;
        position: relative;
        width: 100%;
        max-height: calc(100% - 320px);
    `,
    title: styled.h3`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 16px;
        display: block;
        margin: 0;
    `,
    block: styled.div`
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        margin-bottom: 12px;
    `,
}

export default Styles;