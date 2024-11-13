import { styled, css }from 'styled-components'

export const StyledWrapper = styled.div`
    box-sizing: border-box;
    position: relative;
    width: 100%;
    padding: 4px 0 4px 0;
    border: 1px solid rgba(0, 0, 0, 0.5);
    margin-bottom: 12px;
    &:hover{
        border: 1px solid black;
    }
    
`

export const StyledTitle = styled.h3`
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 16px;
    display: block;
    margin: 0;
`

export const StyledBlock = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    margin-bottom: 12px;
`

export const StyledButton = styled.button`
    width: 20px;
    height: 20px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: grey;
    box-sizing: border-box;
    padding: 0;
    cursor: pointer;
    transition: border 0.2s ease;
    &:hover{
        border: 2px solid black;
    }
`;

export const StyledIco = styled.div`
    width: 12px;
    height: 12px;
    background-image: url(${props => props.pic});
    background-size: cover;
    background-position: center;
    transition: 0.2s ease;
    transform: rotate(${props => props.rotation}deg);
`

// export const StyledContainer = styled.div`
//     width: 100%;
//     height: 100px;
//     box-sizing: border-box;
//     border: 1px solid black;
// `