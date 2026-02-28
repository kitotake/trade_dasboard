import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import RootNavigator from './navigation/RootNavigator';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RootNavigator />
  </StrictMode>
);
