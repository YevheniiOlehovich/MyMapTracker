import Main from "./Components/Main";
import TaskManager from "./Components/TaskManager";
import Libraries from "./Components/Libraries";
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux'; // Імпортуємо Provider
import store from './store/store'; // Імпортуємо ваш store
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Імпортуємо React Router


const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box; 
  }

  body {
    margin: 0; 
    padding: 0; 
    width: 100%; 
    height: 100vh; 
    overflow: hidden;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.2);
  }

  /* ================= MAP MARKERS ================= */
`;


function App() {
  return (
    <Provider store={store}> {/* Обгортаємо ваш компонент в Provider */}
      <GlobalStyle />
      {/* <Main /> */}
      <Router> {/* Додаємо Router */}
        <Routes>
          <Route path="/" element={<Main />} /> {/* Головна сторінка */}
          <Route path="/tasks" element={<TaskManager />} /> {/* Сторінка Tasks */}
          <Route path="/libraries" element={<Libraries />} /> {/* Сторінка Libraries */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;