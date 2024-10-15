import styled from 'styled-components'
import ClosePic from '../../assets/ico/close-icon.png'

export const StyledWrapper = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
`

export const StyledModal = styled.div`
    width: 400px;
    height: 350px;
    background: white;
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
`

export const StyledCloseButton = styled.button`
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    border: 1px solid black;
    background-image: url(${ClosePic});
    background-size: contain;
    background-repeat: no-repeat; 
    cursor: pointer;
`

export const StyledTitle = styled.h4`
    font-family: Arial, sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: black;
    margin: 0;
    margin-bottom: 20px;
`

export const StyledLabel = styled.label`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`

export const StyledSubtitle = styled.h5`
    font-family: Arial, sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: black;
    margin: 0;
    display: block;
`

export const StyledInput = styled.input`
    width: 200px;
    border: 1px solid grey;
    height: 20px;
    padding: 4px;
    &:focus{
        border: 1px solid black;
        border-radius: none;
    }
`

export const StyledTextArea = styled.textarea`
    width: 100%;
    height: 100px;
    border: 1px solid grey;
    resize: none; 
    word-wrap: break-word; 
    overflow: auto; 
`