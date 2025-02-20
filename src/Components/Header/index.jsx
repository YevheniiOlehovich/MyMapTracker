import { StyledHeader } from './styled'; 
import DatePickerComponent from '../DatePicker';
import Button from '../Button';
import { openAddRatesModal, closeAddRatesModal, openAddMileagle, closeAddMileagle } from '../../store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddRatesModal from '../AddRatesModal';
import AddMileagleModal from '../AddMileagleModal';

export default function Header() {
    const dispatch = useDispatch();
    const isAddRatesModal = useSelector((state) => state.modals.isAddRatesModal);
    const isAddMileagleModal = useSelector((state) => state.modals.isAddMileagleModal);

    return (
        <>
            <StyledHeader>
                <DatePickerComponent />
                <Button text={'Тарифи'} onClick={() => dispatch(openAddRatesModal())}/>
                <Button text={'Пробіг'} onClick={() => dispatch(openAddMileagle())} />
                
            </StyledHeader>

            {isAddRatesModal && <AddRatesModal onClose={() => dispatch(closeAddRatesModal())} />} 
            {isAddMileagleModal && <AddMileagleModal onClose={() => dispatch(closeAddMileagle())} />} 
        </>
    );
}
