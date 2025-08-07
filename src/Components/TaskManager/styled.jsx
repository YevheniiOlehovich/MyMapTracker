// import { styled } from 'styled-components';

// const Styles = {
//     wrapper: styled.div`
//         position: relative;
//         left: 50%;
//         transform: translateX(-50%);
//         max-width: 1200px;
//         width: 100%;
//         height: 100vh;
//         padding: 120px 20px 20px 20px;
//         display: flex;
//         flex-direction: column;
//         justify-content: space-between;
//     `,

//     header: styled.div`
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 10px;
//     `,

//     searchInput: styled.input`
//         padding: 5px 10px;
//         width: 250px;
//         font-size: 14px;
//         border: 1px solid #ccc;
//         border-radius: 4px;

//         &::placeholder {
//             color: #aaa;
//         }
//     `,

//     button: styled.button`
//         width: 20px;
//         height: 20px;
//         border: none;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         background-color: white;
//         padding: 0;
//         cursor: pointer;
//         transition: border 0.2s ease;

//         &:hover {
//             border: 2px solid black;
//         }
//     `,

//     ico: styled.div`
//         width: 12px;
//         height: 12px;
//         background-image: url(${(props) => props.$pic});
//         background-size: cover;
//         background-position: center;
//         transition: transform 0.2s ease;
//         transform: rotate(${(props) => props.$rotation || 0}deg);
//     `,

//     tableContainer: styled.div`
//         flex-grow: 1;
//         overflow-y: auto;
//         border: 1px solid #ccc;
//     `,

//     table: styled.table`
//         border-collapse: collapse;
//         width: 100%;
//         min-width: 800px;

//         thead th {
//             position: sticky;
//             top: 0;
//             background-color: white;
//             z-index: 1;
//             border-bottom: 2px solid #ddd;
//             cursor: pointer;
//             user-select: none;

//             &:hover {
//                 background-color: #f2f2f2;
//             }
//         }

//         th, td {
//             padding: 6px 8px;
//             border: 1px solid #ddd;
//             text-align: left;
//         }

//         /* 1: № */
//         th:nth-child(1), td:nth-child(1) {
//             width: 40px;
//             max-width: 40px;
//             text-align: center;
//             white-space: nowrap;
//         }

//         /* 2: Назва задачі */
//         th:nth-child(2), td:nth-child(2) {
//             width: 250px;
//             max-width: 250px;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//         }

//         /* 3: Статус */
//         th:nth-child(3), td:nth-child(3) {
//             width: 120px;
//             max-width: 120px;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//         }

//         /* 4: Виконавець */
//         th:nth-child(4), td:nth-child(4) {
//             width: 180px;
//             max-width: 180px;
//             white-space: nowrap;
//             overflow: hidden;
//             text-overflow: ellipsis;
//         }

//         /* 5: Дії */
//         th:nth-child(5), td:nth-child(5) {
//             width: 80px;
//             max-width: 80px;
//             text-align: center;
//             white-space: nowrap;
//         }

//         tbody tr:hover {
//             background-color: #f9f9f9;
//         }
//     `,
// };

// export default Styles;

import { styled } from 'styled-components';

const Styles = {
  wrapper: styled.div`
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1400px;
    height: 100vh;
    padding: 120px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* background-color: #fefefe; */
    background-color: rgba(0, 0, 0, 0.2);
  `,

  header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  `,

  searchInput: styled.input`
    padding: 8px 12px;
    width: 280px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    transition: border 0.2s;

    &:focus {
      border-color: #888;
      outline: none;
    }

    &::placeholder {
      color: #aaa;
    }
  `,

  button: styled.button`
    width: 28px;
    height: 28px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 0;
    cursor: pointer;
    transition: border 0.2s ease;

    &:hover {
      border: 2px solid black;
      border-radius: 4px;
    }
  `,

  ico: styled.div`
    width: 14px;
    height: 14px;
    background-image: url(${(props) => props.$pic});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform: rotate(${(props) => props.$rotation || 0}deg);
    transition: transform 0.2s ease;
  `,

  tableContainer: styled.div`
    flex-grow: 1;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
  `,

  table: styled.table`
    width: 100%;
    min-width: 800px;
    border-collapse: collapse;
    font-size: 14px;

    thead th {
      position: sticky;
      top: 0;
      background-color: #fafafa;
      z-index: 2;
      border-bottom: 2px solid #ddd;
      cursor: pointer;
      user-select: none;
      padding: 10px;
      font-weight: 600;
      transition: background 0.2s ease;

      &:hover {
        background-color: #f1f1f1;
      }
    }

    tbody tr {
      transition: background-color 0.2s ease;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    th, td {
      padding: 8px 12px;
      border: 1px solid #ddd;
      text-align: left;
      vertical-align: middle;
    }

    /* 1: № */
    th:nth-child(1), td:nth-child(1) {
      width: 40px;
      max-width: 40px;
      text-align: center;
    }

    /* 2: Назва задачі */
    th:nth-child(2), td:nth-child(2) {
      width: 250px;
      max-width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 3: Статус */
    th:nth-child(3), td:nth-child(3) {
      width: 140px;
      max-width: 140px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 4: Виконавець */
    th:nth-child(4), td:nth-child(4) {
      width: 200px;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 5: Дії */
    th:nth-child(5), td:nth-child(5) {
      width: 80px;
      max-width: 80px;
      text-align: center;
      white-space: nowrap;
    }
  `,

  pagination: styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  button {
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }

    &:not(:disabled):hover {
      background-color: #f0f0f0;
    }
  }
`,
};

export default Styles;
