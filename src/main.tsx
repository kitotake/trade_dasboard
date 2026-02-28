import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import RootNavigator from './navigation/RootNavigator';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RootNavigator />
  </StrictMode>
);