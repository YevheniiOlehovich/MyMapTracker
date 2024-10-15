import React, { useState } from 'react';
import { StyledWrapper, StyledTitle, StyledBlock, StyledButton, StyledIco, StyledContainer } from './styles';
import TriangleIco from '../../assets/ico/triangle.png';
import Button from '../Button';
import AddGroupModal from '../AddGroupModal';

export default function Personal() {
    const [rotation, setRotation] = useState(0);
    const [isContainerVisible, setIsContainerVisible] = useState(false);
    const [isAddGroupModalVisible, setIsAddGroupModalVisible] = useState(false);

    const handleClick = () => {
        setRotation(prev => prev + 180); 
        setIsContainerVisible(prev => !prev);
    };

    const showGroupModal = () => {
        setIsAddGroupModalVisible(true);
    };

    const closeGroupModal = () => {
        setIsAddGroupModalVisible(false); 
    };

    return (
        <>
            <StyledWrapper>
                <StyledBlock>
                    <StyledTitle>Персонал</StyledTitle>
                    <StyledButton>
                        <StyledIco pic={TriangleIco} rotation={rotation} onClick={handleClick}></StyledIco>
                    </StyledButton>
                </StyledBlock>
                <StyledBlock>
                    <Button text={'Створити групу'} onClick={showGroupModal} /> 
                    <Button text={'Додати працівника'} />
                </StyledBlock>

                {isContainerVisible && <StyledContainer />}
                
            </StyledWrapper>

            {isAddGroupModalVisible && <AddGroupModal onClose={closeGroupModal}/>} 
        </>
    );
}
