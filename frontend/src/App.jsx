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

  /* неактивні */
  .dim-marker {
    opacity: 0.75;
    filter: grayscale(40%);
    transition: all 0.2s ease;
  }

  /* активний */
  .active-marker {
    filter: drop-shadow(0 0 10px #00bfff);
    z-index: 1000 !important;
    transition: all 0.2s ease;
  }

  /* щоб масштабування виглядало красиво */
  .leaflet-marker-icon {
    transform-origin: bottom center;
  }
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
