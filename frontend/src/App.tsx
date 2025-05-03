import TracksPage from './pages/TracksPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './scss/main.scss';

function App() {
  return (
    <div className="App">
      <TracksPage />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        data-testid="toast-container"
      />
    </div>
  );
}

export default App;