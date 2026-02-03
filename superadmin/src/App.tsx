import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout'
import Overview from './pages/Overview'
import Providers from './pages/Providers'

const App = () => {
  return (
     <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path='/providers' element={<Providers />} />
            </Route>
          </Routes>
        </BrowserRouter>
  )
}

export default App