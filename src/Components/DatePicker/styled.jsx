import { styled, css }from 'styled-components'

export const DatePickerWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const DateButton = styled.button`
    padding: 8px 12px;
    font-size: 16px;
    background: inherit;
    border: 1px solid #000000;
    border-radius: 5px;
    cursor: pointer;
    width: 150px;
    text-align: center;
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