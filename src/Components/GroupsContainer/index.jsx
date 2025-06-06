import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    openAddGroupModal, 
    closeAddGroupModal, 
    openAddPersonalModal, 
    closeAddPersonalModal,
    openAddVehicleModal,
    closeAddVehicleModal,
    openAddTechniqueModal,
    closeAddTechniqueModal
} from '../../store/modalSlice';
import Styles from './styles';
import Button from '../Button';
import AddGroupModal from '../AddGroupModal';
import AddPersonalModal from '../AddPersonalModal';
import AddVehicleModal from '../AddVehicleModal';
import AddTechniqueModal from '../AddTechniqueModal';
import GroupsList from '../GroupsList';

export default function GroupsContainer() {
    const dispatch = useDispatch();
    const isAddGroupModalVisible = useSelector((state) => state.modals.isAddGroupModalVisible);
    const isAddPersonalModalVisible = useSelector((state) => state.modals.isAddPersonalModalVisible);
    const isAddVehicleModalVisible = useSelector((state) => state.modals.isAddVehicleModalVisible);
    const isAddTechniqueModalVisible = useSelector((state) => state.modals.isAddTechniqueModalVisble);

    return (
        <>
            <Styles.wrapper>
                {/* <Styles.block>
                    <Styles.title>Список груп</Styles.title>
                </Styles.block> */}
                <Styles.block>
                    <Button text={'Створити групу'} onClick={() => dispatch(openAddGroupModal())} /> 
                    <Button text={'Додати працівника'} onClick={() => dispatch(openAddPersonalModal())}/>
                    <Button text={'Додати транспорт'} onClick={() => dispatch(openAddVehicleModal())}/>
                    <Button text={'Додати техніку'} onClick={() => dispatch(openAddTechniqueModal())}/>
                </Styles.block>
                <GroupsList />
            </Styles.wrapper>

            {isAddGroupModalVisible && <AddGroupModal onClose={() => dispatch(closeAddGroupModal())}/>} 
            {isAddPersonalModalVisible && <AddPersonalModal onClose={() => dispatch(closeAddPersonalModal())}/>} 
            {isAddVehicleModalVisible && <AddVehicleModal onClose={() => dispatch(closeAddVehicleModal())}/>} 
            {isAddTechniqueModalVisible && <AddTechniqueModal onClose={() => dispatch(closeAddTechniqueModal())}/>}
        </>
    );
}
