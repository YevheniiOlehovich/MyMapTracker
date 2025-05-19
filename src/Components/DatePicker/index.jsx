// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { setSelectedDate } from "../../store/calendarSlice";
// import styles from './styled';

// export default function DatePickerComponent({ onDateChange }) {
//     const dispatch = useDispatch();
//     const selectedDateFromStore = useSelector((state) => state.calendar.selectedDate);

//     const [date, setDateState] = useState(new Date());
//     const [isOpen, setIsOpen] = useState(false);

//     useEffect(() => {
//         if (selectedDateFromStore) {
//             setDateState(new Date(selectedDateFromStore));
//         }
//     }, [selectedDateFromStore]);

//     const handleDateChange = (newDate) => {
//         setDateState(newDate);
//         const localDate = newDate.toLocaleDateString("en-CA");

//         if (localDate !== selectedDateFromStore) {
//             dispatch(setSelectedDate(localDate));
//         }

//         if (onDateChange) {
//             onDateChange(newDate);
//         }

//         setIsOpen(false); // Закриваємо календар після вибору дати
//     };

//     return (
//         <styles.DatePickerWrapper>
//             <styles.DateButton onClick={() => setIsOpen(!isOpen)}>
//                 {date.toLocaleDateString("en-CA")}
//             </styles.DateButton>
//             {isOpen && (
//                 <styles.CalendarWrapper>
//                     <Calendar 
//                         value={date}
//                         onChange={handleDateChange}
//                     />
//                 </styles.CalendarWrapper>
//             )}
//         </styles.DatePickerWrapper>
//     );
// }








import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { setSelectedDate } from "../../store/calendarSlice";
import styles from './styled';

export default function DatePickerComponent({ onDateChange }) {
    const dispatch = useDispatch();
    const selectedDateFromStore = useSelector((state) => state.calendar.selectedDate);

    const [date, setDateState] = useState(new Date());

    useEffect(() => {
        if (selectedDateFromStore) {
            setDateState(new Date(selectedDateFromStore));
        }
    }, [selectedDateFromStore]);

    const handleDateChange = (newDate) => {
        setDateState(newDate);
        const localDate = newDate.toLocaleDateString("en-CA");

        if (localDate !== selectedDateFromStore) {
            dispatch(setSelectedDate(localDate));
        }

        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    return (
        <styles.DatePickerWrapper>
            <styles.CalendarWrapper>
                <Calendar 
                    value={date}
                    onChange={handleDateChange}
                />
            </styles.CalendarWrapper>
        </styles.DatePickerWrapper>
    );
}