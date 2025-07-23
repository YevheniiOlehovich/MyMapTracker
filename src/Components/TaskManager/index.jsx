import Header from "../Header";
import Button from "../Button";
import { useNavigate } from 'react-router-dom';
import Styles from "./styled";
import { useDispatch } from 'react-redux';
import { openAddTaskModal } from '../../store/modalSlice';
import Modals from "../Modals";

export default function TaskManager() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAddTask = () => {
        console.log('click')
        dispatch(openAddTaskModal());
    };

    const handleNavigateToMain = () => {
        navigate('/');
    };

    return (
        <>
            <Header />
            <Styles.wrapper>
                <Styles.menu>
                    <Button text="Додати" onClick={handleAddTask} />
                    {/* <Button text="Назад" onClick={handleNavigateToMain} /> */}
                </Styles.menu>
                <Styles.block>
                    {/* Тут буде таблиця тасків або інші елементи */}
                </Styles.block>
            </Styles.wrapper>
            <Modals />
        </>
    );
}
