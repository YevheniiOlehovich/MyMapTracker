import { StyledWrapper, StyledBlock, StyledTitle, StyledButton, StyledIco } from './styles';
import TriangleIco from '../../assets/ico/triangle.png';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import VehicleList from '../VehicleList';
import AddVehicleModal from '../AddVehicleModal'
import {openAddVehicleModal, closeAddVehicleModal} from '../../store/modalSlice'

export default function Vehicles(){
    const [rotation, setRotation] = useState(0);
    const [isContainerVisible, setIsContainerVisible] = useState(false);

    const dispatch = useDispatch()
    const isAddVehicleModalVisible = useSelector((state) => state.modals.isAddVehicleModalVisible);

    const handleClick = () => {
        setRotation(prev => prev + 180); 
        setIsContainerVisible(prev => !prev);
    };
    return(
        <> 
            <StyledWrapper>
                <StyledBlock>
                    <StyledTitle>Техніка</StyledTitle>
                    <StyledButton>
                        <StyledIco pic={TriangleIco} rotation={rotation} onClick={handleClick}></StyledIco>
                    </StyledButton>
                </StyledBlock>
                <StyledBlock>
                        <Button text={'Додати техніку'} onClick={() => dispatch(openAddVehicleModal())}/> 
                </StyledBlock>
                {isContainerVisible && <VehicleList />}
            </StyledWrapper>
            {isAddVehicleModalVisible && <AddVehicleModal onClose={() => dispatch(closeAddVehicleModal())}/>} 
        </>
    )
}