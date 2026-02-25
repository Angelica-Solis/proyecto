import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import TableMovies from './components/Subasta/TableMovies'
import { ListMovies } from './components/Subasta/ListMovies'
import { DetailMovie } from './components/Subasta/DetailMovie'
import { UserTable } from './components/User/UserTable' 

import { UserDetail } from './components/User/UserDetail'

import { ObjetoTable } from './components/Objetos/ListadoObjetos'
import { ObjetoDetalle } from './components/Objetos/DetalleObjeto'


const rutas = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      // Ruta principal
      { index: true, element: <Home /> },

      // Ruta comodín (404)
      { path: "*", element: <PageNotFound /> },
       //Rutas componentes
      {path:"movie/table", element: <TableMovies/>},
      {path:"movie", element: <ListMovies/>},
      {path:"movie/detail/:id", element: <DetailMovie />},
      //Ruta para listar y detallar usuarios
      {path:"user/table", element: <UserTable />},

      { path: "user/detail/:id", element: <UserDetail /> },

      {path: "objeto/listado", element: <ObjetoTable />},
      {path: "objeto/detalle/:id", element: <ObjetoDetalle/>},
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
