import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Layout'
import Overview from './pages/Overview'

const App = () => {
  return (
     <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Overview />} />
            </Route>
          </Routes>
        </BrowserRouter>
  )
}

export default App