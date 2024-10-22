import Main from "./Components/Main";
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux'; // Імпортуємо Provider
import store from './store/store'; // Імпортуємо ваш store

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
`;

function App() {
  return (
    <Provider store={store}> {/* Обгортаємо ваш компонент в Provider */}
      <GlobalStyle />
      <Main />
    </Provider>
  );
}

export default App;
