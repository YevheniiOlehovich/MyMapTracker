import { StyledHeader } from './styled'; 
import Button from '../Button';
import { 
    openAddRatesModal, 
    openAddMileagle, 
    openLandBankReportModal 
} from '../../store/modalSlice';
import { setMapCenter } from '../../store/mapCenterSlice'; // Для центру карти
import { setCurrentLocation, setLocationError } from '../../store/currentLocationSlice'; // Для маркера поточного місцезнаходження
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleNavigateToTasks = () => {
        navigate('/tasks'); // Переходимо на сторінку Tasks
    };

    const handleNavigateToLibraries = () => {
        navigate('/libraries'); // Переходимо на сторінку Libraries     
    };

    return (
        <StyledHeader>
            {/* <DatePickerComponent /> */}
            <Button text={'Карта'} onClick={() => navigate('/')} />
            <Button text={'Бібліотеки'} onClick={handleNavigateToLibraries} />
            <Button text={'Завдання'} onClick={handleNavigateToTasks} />
            <Button text={'Тарифи'} onClick={() => dispatch(openAddRatesModal())} />
            <Button text={'Пробіг'} onClick={() => dispatch(openAddMileagle())} />
            <Button text={'Земельний банк'} onClick={() => dispatch(openLandBankReportModal())} />
            <Button text={'Де я?'} onClick={handleLocateMe} /> {/* Центруємо карту та додаємо маркер */}
            <Button text={'Вийти'} onClick={handleLogout} />
        </StyledHeader>
    );
}