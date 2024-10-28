import { styled, css }from 'styled-components'

export const StyledTitle = styled.h3`
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 16px;
    display: block;
    margin: 0 8px 12px;
`

export const StyledBlock = styled.div`
    width: 100%;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export const StyledButtonBlock = styled.div`
    display: flex;
    width: 50px;
    justify-content: space-between;
`
export const StyledSubtitle = styled.h4`
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 14px;
    display: block;
    margin: 0;
    display: block;
`

export const StyledButton = styled.button`
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

export const StyledList = styled.ul`
    list-style: none;
    padding: 0 0 0 12px;
    margin: 0;
    width: 100%;
`

export const StyledListItem = styled.li`
    list-style: none;
    margin-bottom: 4px;
`

export const StyledMainList = styled.ul`
    list-style: none;
    padding: 0 8px;
    margin: 0;
    width: 100%;
    height: 600px;
    overflow-y: auto;
`

export const StyledSpan = styled.span`
    margin: 0 0 8px 0;
    display: block;
`