import { styled, css }from 'styled-components' 

export const StyledButton = styled.button`
    width: 120px;
    height: 40px;
    display: block;
    box-sizing: border-box;
    padding: 0 4px;
    background: black;
    border: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: white;
    cursor: pointer;
    border: 2px solid gray;
    &:active{
        transform: translateY(2px);
    }
    &:hover{
        border: 2px solid white;
    }
`