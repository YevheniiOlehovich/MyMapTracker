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
    /* background-color: rgba(0, 0, 0, 0.2); */
    background-color: transparent;
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
    background-color: transparent;
  `,

  table: styled.table`
    width: 100%;
    min-width: 800px;
    border-collapse: collapse;
    font-size: 14px;

    thead th {
      position: sticky;
      top: 0;
      background-color: transparent;
      z-index: 2;
      border-bottom: 2px solid #ddd;
      cursor: pointer;
      user-select: none;
      padding: 4px 8px;
      font-weight: 600;
      font-size: 12px;
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
      padding: 4px 8px;
      border: 1px solid #ddd;
      text-align: left;
      vertical-align: middle;
      font-size: 12px;
    }

    /* 1: № */
    th:nth-child(1), td:nth-child(1) {
      width: 40px;
      max-width: 40px;
      text-align: center;
    }

    /* 2: Група */
    th:nth-child(2), td:nth-child(2) {
      /* width: 100%; */
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 3: Поле */
    th:nth-child(3), td:nth-child(3) {
      /* width: 140px; */
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 4: Операція */
    th:nth-child(4), td:nth-child(4) {
      /* width: 200px; */
      max-width: 120px;
      white-space: wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }

    /* 5: Статус */
    th:nth-child(5), td:nth-child(5) {
      /* width: 80px; */
      max-width: 100px;
      text-align: center;
      white-space: nowrap;
    }

    /* 6: Транспорт */
    th:nth-child(6), td:nth-child(6) {
      /* width: 80px; */
      max-width: 140px;
      white-space: wrap;
      text-align: left;
    }

    /* 7: Техніка */
    th:nth-child(7), td:nth-child(7) {
      /* width: 80px; */
      max-width: 160px;
      white-space: wrap;
      text-align: left;
    }

    /* 8: Виконавець */
    th:nth-child(8), td:nth-child(8) {
      /* width: 80px; */
      max-width: 100px;
      white-space: wrap;
      text-align: left;
    }

    /* 9: Культура */
    th:nth-child(9), td:nth-child(9) {
      /* width: 80px; */
      max-width: 80px;
      white-space: wrap;
      text-align: left;
    }

    /* 10: Сорт */
    th:nth-child(10), td:nth-child(10) {
      /* width: 80px; */
      max-width: 60px;
      white-space: wrap;
      text-align: left;
    }

    /* 11: Примітка */
    th:nth-child(11), td:nth-child(11) {
      /* width: 80px; */
      max-width: 100px;
      white-space: wrap;
      text-align: left;
    }

    /* 12: Дата створення */
    th:nth-child(12), td:nth-child(12) {
      /* width: 80px; */
      max-width: 95px;
      white-space: wrap;
      text-align: left;
    }

    /* 13: Дата створення */
    th:nth-child(13), td:nth-child(13) {
      /* width: 80px; */
      max-width: 70px;
      white-space: wrap;
      text-align: left;
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
