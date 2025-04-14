import { StyledHeader } from './styled'; 
import DatePickerComponent from '../DatePicker';
import Button from '../Button';
import { 
    openAddRatesModal, 
    closeAddRatesModal, 
    openAddMileagle, 
    closeAddMileagle, 
    openLandBankReportModal, 
    closeLandBankReportModal 
} from '../../store/modalSlice';
import { setMapCenter } from '../../store/mapCenterSlice'; // Для центру карти
import { setCurrentLocation, setLocationError } from '../../store/currentLocationSlice'; // Для маркера поточного місцезнаходження
import { useDispatch, useSelector } from 'react-redux';
import AddRatesModal from '../AddRatesModal';
import AddMileagleModal from '../AddMileagleModal';
import LandBankModal from '../LandBankModal';

export default function Header() {
    const dispatch = useDispatch();
    const isAddRatesModal = useSelector((state) => state.modals.isAddRatesModal);
    const isAddMileagleModal = useSelector((state) => state.modals.isAddMileagleModal);
    const isLandBankReportModalVisible = useSelector((state) => state.modals.isLandBankReportModalVisible);

    // Функція для виходу з аккаунта
    const handleLogout = () => {
        sessionStorage.removeItem('token'); // Видаляємо токен із sessionStorage
        window.location.reload(); // Перезавантажуємо сторінку, щоб повернутися на сторінку авторизації
    };

    // Функція для визначення поточного місцезнаходження
    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const coordinates = [latitude, longitude];
                    console.log(`Поточне місцезнаходження: широта ${latitude}, довгота ${longitude}`);
                    dispatch(setMapCenter(coordinates)); // Центруємо карту
                    dispatch(setCurrentLocation(coordinates)); // Додаємо маркер поточного місцезнаходження
                },
                (error) => {
                    console.error('Помилка визначення місцезнаходження:', error);
                    dispatch(setLocationError('Не вдалося визначити місцезнаходження.'));
                }
            );
        } else {
            dispatch(setLocationError('Ваш браузер не підтримує визначення місцезнаходження.'));
        }
    };

    return (
        <>
            <StyledHeader>
                <DatePickerComponent />
                <Button text={'Тарифи'} onClick={() => dispatch(openAddRatesModal())} />
                <Button text={'Пробіг'} onClick={() => dispatch(openAddMileagle())} />
                <Button text={'Земельний банк'} onClick={() => dispatch(openLandBankReportModal())} />
                <Button text={'Де я?'} onClick={handleLocateMe} /> {/* Центруємо карту та додаємо маркер */}
                <Button text={'Вийти'} onClick={handleLogout} />
            </StyledHeader>

            {isAddRatesModal && <AddRatesModal onClose={() => dispatch(closeAddRatesModal())} />} 
            {isAddMileagleModal && <AddMileagleModal onClose={() => dispatch(closeAddMileagle())} />} 
            {isLandBankReportModalVisible && <LandBankModal onClose={() => dispatch(closeLandBankReportModal())} />}
        </>
    );
}