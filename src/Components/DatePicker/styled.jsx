import styled from 'styled-components';

const styles = {
    DatePickerWrapper: styled.div`
        position: relative;
        display: inline-block;
    `,
    DateButton: styled.button`
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
    `,
    
    CalendarWrapper: styled.div`
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 10;
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
    `,
};

export default styles;