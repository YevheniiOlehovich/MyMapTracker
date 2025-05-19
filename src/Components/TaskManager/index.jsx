import Header from "../Header";
import Button from "../Button";
import { useNavigate } from 'react-router-dom';

export default function TaskManager() {
    const navigate = useNavigate(); // Ініціалізуємо useNavigate для навігації
    
    const handleNavigateToTasks = () => {
        navigate('/'); // Переходимо на сторінку Tasks
    };

    return (
        <div>
            {/* <Header /> */}
            <Button text={'Головна'} onClick={handleNavigateToTasks} />
            <h1>Task Manager</h1>
            <p>Manage your tasks here.</p>
        </div>
    );
}