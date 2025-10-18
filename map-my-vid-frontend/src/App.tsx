import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import useRouteElements from './useRouteElement'

function App() {
  const routeElement = useRouteElements()
  return (
    <div>
      {routeElement}
      <ToastContainer />
    </div>
  )
}

export default App
