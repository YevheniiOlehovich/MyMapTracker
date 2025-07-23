import { useState } from 'react';
import Styles from './styled';
import closeModal from '../../helpres/closeModal';
import SelectComponent from '../Select';
import { useGroupsData } from '../../hooks/useGroupsData';
import { usePersonnelData } from '../../hooks/usePersonnelData';
import { useTechniquesData } from '../../hooks/useTechniquesData';
import { useFieldsData } from '../../hooks/useFieldsData';
import { useOperationsData } from '../../hooks/useOperationsData'; // хуки для операцій
import { useCropsData } from '../../hooks/useCropsData'; // хуки для культур
import { useVarietiesData } from '../../hooks/useVarietiesData'; // хуки для сортів
import { useVehiclesData } from '../../hooks/useVehiclesData';

export default function AddTaskModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    const { data: groups = [] } = useGroupsData();
    const { data: personnel = [] } = usePersonnelData();
    const { data: techniques = [] } = useTechniquesData();
    const { data: fieldsData = []} = useFieldsData();
    const { data: operations = [] } = useOperationsData();
    const { data: crops = [] } = useCropsData();
    const { data: varieties = [] } = useVarietiesData();
    const { data: vehicles = [] } = useVehiclesData();

    console.log('Groups Data:', groups);
    console.log('Personnel Data:', personnel);
    console.log('Techniques Data:', techniques);
    console.log('Vehicles Data:', vehicles);
    console.log('Fields Data:', fieldsData);
    console.log('Operations Data:', operations);
    console.log('Varieties Data:', varieties);
    console.log('Crops Data:', crops);
    return (
        <Styles.StyledWrapper onClick={handleWrapperClick}>
            <Styles.StyledModal>
                <Styles.StyledCloseButton onClick={handleWrapperClick} />
                <Styles.StyledTitle>Додавання нового завдання</Styles.StyledTitle>
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}
