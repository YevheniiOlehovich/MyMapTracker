import styled from 'styled-components';
import ClosePic from '../../assets/ico/close-icon.png';

const Styles = {
    StyledWrapper: styled.div`
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
        z-index: 10;
    `,

    StyledModal: styled.div`
        width: 820px;
        background: white;
        padding: 40px 10px 10px 10px;
        display: flex;
        flex-direction: column;
        position: relative;
    `,

    StyledCloseButton: styled.button`
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
        transition: 0.4s;

        &:hover {
            transform: rotate(180deg);
        }
    `,

    StyledColumn: styled.div`
        display: flex;
        flex-direction: column;
        width: 400px;
    `,

    StyledTitle: styled.h4`
        font-family: Arial, sans-serif;
        font-weight: 700;
        font-size: 17px;
        color: black;
        margin: 0;
        margin-bottom: 20px;
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1; 
    `,

    StyledLabel: styled.label`
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        margin: 0 0 20px 0`,

    StyledSubtitle: styled.h5`
        font-family: Arial, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: black;
        margin: 0;
        margin-bottom: 10px;
        display: block;
    `,

    StyledBlock : styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
    `,

    StyledMapBlock: styled.div`
        width: 400px;
        height: 400px;
        border: 1px solid grey;
        box-sizing: border-box;
        margin-bottom: 20px;
        position: relative;
    `,

    // StyledInput: styled.input`
    //     width: 200px;
    //     border: 1px solid grey;
    //     height: 20px;
    //     padding: 4px;

    //     &:focus {
    //         border: 1px solid black;
    //         border-radius: 0;
    //     }
    // `,

    StyledTextArea: styled.textarea`
        width: 100%;
        height: 100px;
        border: 1px solid grey;
        resize: none; 
        word-wrap: break-word; 
        overflow: auto; 
    `,

    // StyledPhotoBlock: styled.div`
    //     position: relative;
    //     height: 200px;
    //     display: flex;
    //     justify-content: space-between;
    //     box-sizing: border-box;
    //     margin: 0;
    //     margin-bottom: 20px;
    // `,

    // PhotoBlock: styled.div`
    //     width: 150px;
    //     height: 200px;
    //     border: 1px solid grey;
    // `,

    // BlockColumn: styled.div`
    //     display: flex;
    //     flex-direction: column;
    // `,

    // PhotoPic: styled.img`
    //     width: 100%;
    //     height: 100%;
    // `,

    // StyledButtonLabel: styled.label`
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     width: 120px;
    //     height: 40px;
    //     box-sizing: border-box;
    //     padding: 0 4px;
    //     background: black;
    //     border: none;
    //     cursor: pointer;
    //     border: 2px solid gray;

    //     &:active {
    //         transform: translateY(2px);
    //     }

    //     &:hover {
    //         border: 2px solid white;
    //     }

    //     margin-top: 20px;
    // `,

    // StyledInputFile: styled.input`
    //     width: 0;
    //     height: 0;
    // `,

    // StyledText: styled.span`
    //     font-family: Arial, Helvetica, sans-serif;
    //     font-size: 14px;
    //     color: white;
    //     display: block;
    // `
};

export default Styles;
