import { styled, css }from 'styled-components' 

export const StyledButton = styled.button`
    display: block;
    box-sizing: border-box;
    padding: 0 4px;
    height: 30px; 
    background: black;
    border: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: white;
    cursor: pointer;
    border: 1px solid gray;
    &:active{
        transform: translateY(2px);
    }
    &:hover{
        border: 2px solid white;
    }
`