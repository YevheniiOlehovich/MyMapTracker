import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { setSelectedDate } from "../../store/calendarSlice";

export default function DatePickerComponent({ onDateChange }) {
    const dispatch = useDispatch();
    const selectedDateFromStore = useSelector((state) => state.calendar.selectedDate);

    // Стан для локальної дати
    const [date, setDateState] = useState(new Date());

    // Оновлюємо локальний стан, якщо дата в Redux змінюється
    useEffect(() => {
        if (selectedDateFromStore) {
            setDateState(new Date(selectedDateFromStore));
        }
    }, [selectedDateFromStore]);

    // Обробник зміни дати
    const handleDateChange = (newDate) => {
        setDateState(newDate);

        // Форматуємо дату без зсуву (YYYY-MM-DD)
        const localDate = newDate.toLocaleDateString("en-CA");

        // Перевіряємо, чи дата змінилася перед оновленням Redux
        if (localDate !== selectedDateFromStore) {
            dispatch(setSelectedDate(localDate));
        }

        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    return (
        <div>
            <Calendar 
                value={date}
                onChange={handleDateChange}
            />
        </div>
    );
}
