import { useState } from 'react';
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
import GroupsList from '../GroupsList';
import VehicleList from '../VehicleList';
import PersonnelList from '../PersonnelList';
import TechniqueList from '../TechniqueList';
import GroupsIco from '../../assets/ico/groups.png'
import PersonnelIco from '../../assets/ico/personnel.png'
import VehicleIco from '../../assets/ico/vehicles.png'
import TechniqueIco from '../../assets/ico/techniques.png';



export default function GroupsContainer() {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState(null);

    const handleTabClick = (tabName) => {
        setActiveTab((prev) => (prev === tabName ? null : tabName));
    };

    return (
        <>
            <Styles.wrapper>
                <Styles.button
                    $bgImage={GroupsIco}
                    $active={activeTab === 'groups'}
                    onClick={() => handleTabClick('groups')}
                />
                <Styles.button
                    $bgImage={PersonnelIco}
                    $active={activeTab === 'personnel'}
                    onClick={() => handleTabClick('personnel')}
                />
                <Styles.button
                    $bgImage={VehicleIco}
                    $active={activeTab === 'vehicles'}
                    onClick={() => handleTabClick('vehicles')}
                />
                <Styles.button
                    $bgImage={TechniqueIco}
                    $active={activeTab === 'techniques'}
                    onClick={() => handleTabClick('techniques')}
                />
            </Styles.wrapper>

            {activeTab === 'groups' && <GroupsList />}
            {activeTab === 'personnel' && <PersonnelList />}
            {activeTab === 'vehicles' && <VehicleList />}
            {activeTab === 'techniques' && <TechniqueList />}
        </>
    );
}
