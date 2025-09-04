// import styled from 'styled-components';

// const styles = {
//     DatePickerWrapper: styled.div`
//         position: relative;
//         display: inline-block;
//     `,
//     DateButton: styled.button`
//         width: 120px;
//         height: 40px;
//         display: block;
//         box-sizing: border-box;
//         padding: 0 4px;
//         background: black;
//         border: none;
//         font-family: Arial, Helvetica, sans-serif;
//         font-size: 14px;
//         color: white;
//         cursor: pointer;
//         border: 2px solid gray;
//         &:active{
//             transform: translateY(2px);
//         }
//         &:hover{
//             border: 2px solid white;
//         }
//     `,
    
//     CalendarWrapper: styled.div`
//         /* position: absolute;
//         top: 100%;
//         left: 0;
//         z-index: 10;
//         background: white;
//         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         border-radius: 4px;
//         overflow: hidden; */
//         position: relative;
//         width: 300px;
//         box-sizing: border-box;
//         overflow: hidden;
//         background: white;
//         border: 2px solid gray;
//         height: auto;
//     `,
// };

// export default styles;


import styled from "styled-components";

const styles = {
  DatePickerWrapper: styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
  `,
  
  CalendarWrapper: styled.div`
    width: 100%;
    background: #212121; /* темний фон MUI */
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-family: 'Roboto', sans-serif;

    /* Основний календар */
    .react-calendar {
      width: 100%;
      background: #212121;
      color: white;
      border: none;
    }

    /* Навігація (місяць/рік) */
    .react-calendar__navigation {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      button {
        color: white;
        background: transparent;
        border: none;
        font-weight: 500;
        &:hover {
          color: #90caf9; /* акцентний колір MUI */
        }
      }
    }

    /* Дні */
    .react-calendar__tile {
      background: transparent;
      color: white;
      border-radius: 6px;
      transition: all 0.2s;
      &:hover {
        background: #1976d2; /* MUI primary main */
        color: white;
      }
    }

    /* Активна дата */
    .react-calendar__tile--active {
      background: #90caf9; /* light blue MUI */
      color: black;
    }

    /* Сьогодні */
    .react-calendar__tile--now {
      border: 1px solid #90caf9;
      border-radius: 6px;
    }

    /* Вихідні */
    .react-calendar__month-view__days__day--weekend {
      color: #f48fb1; /* рожевий MUI */
    }
  `,
};

export default styles;
