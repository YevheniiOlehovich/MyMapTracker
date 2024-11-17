import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { StyledTitle, StyledBlock, StyledSubtitle, StyledButton, StyledIco, StyledButtonBlock, StyledList, StyledListItem, StyledMainList, StyledSpan, StyledImgBlock } from './styles';
import QuestionIco from '../../assets/ico/10965421.webp'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups, deleteGroup, deleteVehicle } from '../../store/groupSlice'; 
import { openAddVehicleModal, openAddGroupModal} from '../../store/modalSlice';

export default function VehicleList(){
    const dispatch = useDispatch();
    const groups = useSelector(selectAllGroups);

    console.log(groups)

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const formatPhotoPath = (photoPath) => {
        // Перевірка наявності шляху і форматування для правильного відображення
        return photoPath 
            ? '/src/' + photoPath.substring(3).replace(/\\/g, '/') 
            : '/src/defaultImage.jpg'; // Шлях до дефолтного зображення, якщо фото немає
    };

    const handleOpenEditGroupModal = (groupId) => {
        dispatch(openAddGroupModal(groupId)); // Передаємо ID групи
    };

    const handleOpenEditVehicleModal = (groupId, vehicleId) => {
        // Викликаємо модалку, передаючи тільки групу та id персони
        dispatch(openAddVehicleModal({ groupId, vehicleId }));
    };

    const handleDeleteVehicle = (groupId, vehicleId) => {
        dispatch(deleteVehicle({ groupId, vehicleId }))
            .then(() => {
                dispatch(fetchGroups());
            })
            .catch((error) => console.error('Помилка при видаленні транспорту:', error));
    };

    return(
        <>
            <StyledTitle>Список Груп</StyledTitle>
            {groups.length === 0 ? (
                <StyledSpan>Групи не знайдено.</StyledSpan>
            ) : (
                <StyledMainList>
                    {groups.map(group => (
                        <StyledListItem key={group._id}>
                            <StyledBlock>
                                <StyledSubtitle>{group.name}</StyledSubtitle>
                                
                                <StyledButtonBlock>
                                    
                                    <StyledButton onClick={() => handleOpenEditGroupModal(group._id)}>
                                        <StyledIco pic={EditIco} />
                                    </StyledButton>
                                    {/* <StyledButton onClick={() => handleDeleteGroup(group._id)}> */}
                                    <StyledButton>
                                        <StyledIco pic={DelIco} />
                                    </StyledButton>
                                </StyledButtonBlock>
                            </StyledBlock>

                            {group.vehicles && group.vehicles.length > 0 ? (
                                <StyledList>
                                    {group.vehicles.map(vehicle => (
                                        <StyledBlock key={vehicle._id}>
                                            <StyledImgBlock imageUrl={vehicle.photoPath ? formatPhotoPath(vehicle.photoPath) : QuestionIco} />
                                            <StyledListItem>
                                                {vehicle.mark}
                                                {/* {transport.mark} {transport.vehicleType} */}
                                            </StyledListItem>
                                            <StyledButtonBlock>
                                                <StyledButton onClick={() => handleOpenEditVehicleModal(group._id, vehicle._id)}>
                                                    <StyledIco pic={EditIco} />
                                                </StyledButton>
                                                <StyledButton onClick={() => handleDeleteVehicle(group._id, vehicle._id)}>
                                                    <StyledIco pic={DelIco} />
                                                </StyledButton>
                                            </StyledButtonBlock>
                                        </StyledBlock>
                                    ))}
                                </StyledList>
                            ) : (
                                <StyledSpan>Техніку не знайдено</StyledSpan>
                            )}
                        </StyledListItem>
                    ))}
                </StyledMainList>
            )}
        </>
    )
}