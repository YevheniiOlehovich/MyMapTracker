import styled from 'styled-components';

const Styles = {
    wrapper: styled.div`
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 8px;
    `,
    Title: styled.h3`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 16px;
        display: block;
        margin: 0;
        margin-bottom: 12px;
    `,
    fieldBlock: styled.div`
        display: flex;
        justify-content: space-between;
        width: 100%;
        
        &:not(:last-child){
            margin-bottom: 12px;
        } 
    `,
    fieldName: styled.div`
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 15px;
        display: block;
        margin: 0 8px 12px;
        cursor: pointer;
    `,
    btnBlock: styled.div`
        display: flex;
        width: auto;
        justify-content: space-between;
    `,
    btn: styled.button`
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
        &:not(:first-child){
            margin-left: 8px;
        }
    `,
    btnIco: styled.img`
        width: 12px;
        height: 12px;
        /* background-image: url(${props => props.pic}); */
        background-image: url(${props => props.$pic});
        background-size: cover;
        background-position: center;
        transition: 0.2s ease;
        /* transform: rotate(${props => props.rotation}deg); */
        transform: rotate(${props => props.$rotation}deg);
    `,
    block: styled.div`
        display: flex;
        width: 100%;
        justify-content: space-between;
        
    `,
    list: styled.div`
        display: flex;
        flex-direction: column;
        width: 100%;
        /* height: 700px;  */
        height: 100%;
        max-height: 450px;
        overflow-y: auto; 
        white-space: nowrap;  
        margin-bottom: 20px;
        padding: 0 8px;
    `,
    searchInput: styled.input`
        width: 100%;
        height: 30px;
        padding: 4px;
        margin-bottom: 20px;
        &:active{
            border: none;
            padding: none;
        }  
    `
};

export default Styles;