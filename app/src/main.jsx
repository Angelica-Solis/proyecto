import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { DetailMovie } from './components/Subasta/DetailMovie'
import { UserTable } from './components/User/UserTable'

import { UserDetail } from './components/User/UserDetail'

import { ObjetoTable } from './components/Objetos/ListadoObjetos'
import { ObjetoDetalle } from './components/Objetos/DetalleObjeto'
import { SubastaTable } from './components/Subasta/SubastaTable'
import { SubastaDetalle } from './components/Subasta/DetalleSubasta'
import { PujaTable } from './components/Pujas/ListadoPujas'



const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Ruta principal
      { index: true, element: <Home /> },

      // Ruta comodín (404)
      { path: "*", element: <PageNotFound /> },
      //Rutas componentes
      { path: "subastas", element: <SubastaTable /> },
      //Ruta para listar y detallar usuarios
      { path: "user/table", element: <UserTable /> },


      { path: "objeto/listado", element: <ObjetoTable /> },

      { path: "puja/listado/:id", element: <PujaTable /> },

      { path: "user/detail/:id", element: <UserDetail /> },
      { path: "objeto/detalle/:id", element: <ObjetoDetalle /> },
      { path: "subasta/detalle/:id", element: <SubastaDetalle /> }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
