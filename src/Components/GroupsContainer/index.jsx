import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    openAddGroupModal, 
    closeAddGroupModal, 
    openAddPersonalModal, 
    closeAddPersonalModal,
    openAddVehicleModal,
    closeAddVehicleModal
} from '../../store/modalSlice';
import { StyledWrapper, StyledTitle, StyledBlock } from './styles';
import Button from '../Button';
import AddGroupModal from '../AddGroupModal';
import AddPersonalModal from '../AddPersonalModal';
import AddVehicleModal from '../AddVehicleModal'
import GroupsList from '../GroupsList';

export default function GroupsContainer() {
    const dispatch = useDispatch();
    const isAddGroupModalVisible = useSelector((state) => state.modals.isAddGroupModalVisible);
    const isAddPersonalModalVisible = useSelector((state) => state.modals.isAddPersonalModalVisible);
    const isAddVehicleModalVisible = useSelector((state) => state.modals.isAddVehicleModalVisible)

    return (
        <>
            <StyledWrapper>
                <StyledBlock>
                    <StyledTitle>Список груп</StyledTitle>
                </StyledBlock>
                <StyledBlock>
                    <Button text={'Створити групу'} onClick={() => dispatch(openAddGroupModal())} /> 
                    <Button text={'Додати працівника'} onClick={() => dispatch(openAddPersonalModal())}/>
                    <Button text={'Додати техніку'} onClick={() => dispatch(openAddVehicleModal())}/>
                </StyledBlock>
                <GroupsList />
            </StyledWrapper>

            {isAddGroupModalVisible && <AddGroupModal onClose={() => dispatch(closeAddGroupModal())}/>} 
            {isAddPersonalModalVisible && <AddPersonalModal onClose={() => dispatch(closeAddPersonalModal())}/>} 
            {isAddVehicleModalVisible && <AddVehicleModal onClose={() => dispatch(closeAddVehicleModal())}/>} 
        </>
    );
}
