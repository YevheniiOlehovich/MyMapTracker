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
        /* max-height: 400px; */
        border: 1px solid #ccc;
    `,

    table: styled.table`
        border-collapse: collapse;
        width: 100%;
        
        /* min-width: 900px; */

        thead th {
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 1;
        border-bottom: 2px solid #ddd;
        }

        th, td {
        padding: 8px 12px;
        border: 1px solid #ddd;
        text-align: left;
        vertical-align: middle;
        white-space: nowrap;
        }

        th:nth-child(1), td:nth-child(1) {
            width: 20px;
            max-width: 40px;
            text-align: center;
            padding: 2px
        }

        th:nth-child(2), td:nth-child(2) { /* Група */
            width: 20%;
            /* min-width: 120px;
            max-width: 180px; */
            overflow: hidden;
            text-overflow: ellipsis;
        }

        th:nth-child(3), td:nth-child(3) { /* Назва */
            width: 20%;
            min-width: 100px;
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        th:nth-child(4), td:nth-child(4) { /* RFID */
            width: 20%;
            min-width: 100px;
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        th:nth-child(5), td:nth-child(5) { /* Унікальний № */
            width: 10%;
            min-width: 80px;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        th:nth-child(6), td:nth-child(6) { /* Унікальний № */
            width: 10%;
            min-width: 80px;
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tbody tr:hover {
            background-color: #f9f9f9;
        }
    `,
    sortButtons: styled.div`
        display: flex;
        gap: 8px;
        button {
            padding: 4px 8px;
            font-size: 12px;
            border: 1px solid #ccc;
            background-color: white;
            cursor: pointer;

            &:hover {
            background-color: #eee;
            }
        }
        `,
};

export default Styles;
