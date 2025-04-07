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
        localStorage.removeItem('token'); // Видаляємо токен
        window.location.reload(); // Перезавантажуємо сторінку, щоб повернутися на сторінку авторизації
    };

    return (
        <>
            <StyledHeader>
                <DatePickerComponent />
                <Button text={'Тарифи'} onClick={() => dispatch(openAddRatesModal())}/>
                <Button text={'Пробіг'} onClick={() => dispatch(openAddMileagle())} />
                <Button text={'Земельний банк'} onClick={() => dispatch(openLandBankReportModal())} />
                <Button text={'Де я?'} />
                <Button text={'Вийти'} onClick={handleLogout} />
            </StyledHeader>

            {isAddRatesModal && <AddRatesModal onClose={() => dispatch(closeAddRatesModal())} />} 
            {isAddMileagleModal && <AddMileagleModal onClose={() => dispatch(closeAddMileagle())} />} 
            {isLandBankReportModalVisible && <LandBankModal onClose={() => dispatch(closeLandBankReportModal())} />}
        </>
    );
}