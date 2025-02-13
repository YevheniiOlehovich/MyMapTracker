import { styled, css }from 'styled-components'

export const DatePickerWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const DateButton = styled.button`
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
`;

export const CalendarWrapper = styled.div`
    position: absolute;
    top: 100px;
    left: 0;
    background: white;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    z-index: 100;
`;