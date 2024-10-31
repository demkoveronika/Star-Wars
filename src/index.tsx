import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Root } from './Root';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Root />);

reportWebVitals();
