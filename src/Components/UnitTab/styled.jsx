import { styled } from 'styled-components';

const Styles = {
    wrapper: styled.div`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    `,

    header: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    `,

    searchInput: styled.input`
        padding: 5px 10px;
        width: 250px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;

        &::placeholder {
        color: #aaa;
        }
    `,

    button: styled.button`
        width: 20px;
        height: 20px;
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
        }
    `,

    ico: styled.div`
        width: 12px;
        height: 12px;
        background-image: url(${(props) => props.$pic});
        background-size: cover;
        background-position: center;
        transition: transform 0.2s ease;
        transform: rotate(${(props) => props.$rotation || 0}deg);
    `,

    tableContainer: styled.div`
        flex-grow: 1;
        overflow-y: auto;
        /* max-height: 400px;  */
        border: 1px solid #ccc;
    `,

    table: styled.table`
        border-collapse: collapse;
        width: 100%;
        min-width: 600px; /* для уникнення зсувів, можна підкоригувати */

        thead th {
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 1;
        border-bottom: 2px solid #ddd;
        }

        th, td {
        padding: 6px 8px;
        border: 1px solid #ddd;
        text-align: left;
        }

        /* Ширина колонок по порядку */
        /* 1 колонка - номер */
        th:nth-child(1),
        td:nth-child(1) {
        width: 40px; /* фіксована ширина */
        max-width: 40px;
        white-space: nowrap;
        }

        /* 2 колонка - Назва */
        th:nth-child(2),
        td:nth-child(2) {
        width: 180px;
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        }

        /* 3 колонка - Власність */
        th:nth-child(3),
        td:nth-child(3) {
        width: 140px;
        max-width: 140px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        }

        /* 4 колонка - Опис */
        th:nth-child(4),
        td:nth-child(4) {
        width: 240px;
        max-width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        }

        /* 5 колонка - Дії */
        th:nth-child(5),
        td:nth-child(5) {
        width: 40px;
        max-width: 40px;
        white-space: nowrap;
        text-align: center;
        }

        tbody tr:hover {
        background-color: #f9f9f9;
        }
    `,
};

export default Styles;
