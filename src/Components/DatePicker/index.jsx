import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Імпортуємо useSelector для отримання даних з Redux store
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { setSelectedDate } from "../../store/calendarSlice"; // Імпортуємо дію setSelectedDate

export default function DatePickerComponent({ onDateChange }) {
    const dispatch = useDispatch(); // Ініціалізація диспетчера
    const selectedDateFromStore = useSelector((state) => state.calendar.selectedDate); // Отримуємо дату з Redux store

    const [date, setDateState] = useState(new Date()); // Локальний стан дати

    // Якщо дата з Redux є, оновлюємо локальний стан
    useEffect(() => {
        if (selectedDateFromStore) {
            setDateState(selectedDateFromStore); // Встановлюємо дату з Redux
        }
    }, [selectedDateFromStore]); // Викликається при зміні selectedDate з Redux

    const handleDateChange = (newDate) => {
        setDateState(newDate); // Оновлення локальної дати

        // Оновлюємо дату в Redux store
        dispatch(setSelectedDate(newDate)); // Використовуємо правильну дію

        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    return (
        <div>
            <Calendar 
                value={date}  // Використовуємо value для відображення поточної дати
                onChange={handleDateChange}
            />
        </div>
    );
}
