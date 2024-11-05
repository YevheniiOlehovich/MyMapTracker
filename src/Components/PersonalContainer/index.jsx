import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    openAddGroupModal, 
    closeAddGroupModal, 
    openAddPersonalModal, 
    closeAddPersonalModal 
} from '../../store/modalSlice';
import { StyledWrapper, StyledTitle, StyledBlock, StyledButton, StyledIco, StyledContainer } from './styles';
import TriangleIco from '../../assets/ico/triangle.png';
import Button from '../Button';
import AddGroupModal from '../AddGroupModal';
import AddPersonalModal from '../AddPersonalModal';
import PersonalList from '../PersonalList';

export default function Personal() {
    const [rotation, setRotation] = useState(0);
    const [isContainerVisible, setIsContainerVisible] = useState(false);

    const dispatch = useDispatch();
    const isAddGroupModalVisible = useSelector((state) => state.modals.isAddGroupModalVisible);
    const isAddPersonalModalVisible = useSelector((state) => state.modals.isAddPersonalModalVisible);

    const handleClick = () => {
        setRotation(prev => prev + 180); 
        setIsContainerVisible(prev => !prev);
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
                    <Button text={'Створити групу'} onClick={() => dispatch(openAddGroupModal())} /> 
                    <Button text={'Додати працівника'} onClick={() => dispatch(openAddPersonalModal())}/>
                </StyledBlock>

                {isContainerVisible && <PersonalList />}
                
            </StyledWrapper>

            {isAddGroupModalVisible && <AddGroupModal onClose={() => dispatch(closeAddGroupModal())}/>} 
            {isAddPersonalModalVisible && <AddPersonalModal onClose={() => dispatch(closeAddPersonalModal())}/>} 
        </>
    );
}
