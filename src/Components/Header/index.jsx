import { StyledHeader } from './styled'; 
import DatePickerComponent from '../DatePicker';
import Button from '../Button';
import { openAddRatesModal, closeAddRatesModal } from '../../store/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddRatesModal from '../AddRatesModal';

export default function Header() {
    const dispatch = useDispatch();
    const isAddRatesModal = useSelector((state) => state.modals.isAddRatesModal);
    

    return (
        <>
            <StyledHeader>
                <DatePickerComponent />
                <Button text={'Тарифи'} onClick={() => dispatch(openAddRatesModal())}/>
            </StyledHeader>

            {isAddRatesModal && <AddRatesModal onClose={() => dispatch(closeAddRatesModal())} />} 
        </>
    );
}
