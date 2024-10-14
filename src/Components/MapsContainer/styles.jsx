import styled from 'styled-components'
import AddPic from '../../assets/ico/add-icon-black.png'

export const StyledWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`

export const StyledBlock = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
`

export const StyledTitle = styled.h3`
    font-family: Arial, sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: black;
`

export const StyledButton = styled.button`
    font-family: Arial, sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: black;
    box-sizing: border-box;
    position: relative;
    width: 100px;
    height: 40px;
    padding: 8px;
    border: 1px solid black;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    border: 1px solid yellow;
    background-color: green;
    border-radius: 8px;
    &:hover{
        border: 1px solid green;
        background-color: lightgreen;
    }
    &:active{
        border: 1px solid lightgreen;
    }
    &::before {
        content: '';
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background-image: url(${AddPic});
        background-size: contain;
        background-repeat: no-repeat; 
    }
`