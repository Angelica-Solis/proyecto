//uso de sonner
import { Toaster } from 'sonner';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import { UserTable } from './components/User/UserTable'

import { UserDetail } from './components/User/UserDetail'

import { ObjetoTable } from './components/Objetos/ListadoObjetos'
import { ObjetoDetalle } from './components/Objetos/DetalleObjeto'
import { SubastaTable } from './components/Subasta/SubastaTable'
import { SubastaDetalle } from './components/Subasta/DetalleSubasta'
import { PujaTable } from './components/Pujas/ListadoPujas'
import { SubastaMantenimiento } from './components/Subasta/SubastaMantenimiento'
import { CrearSubasta } from "./components/Subasta/CrearSubasta";
import { UpdateUser } from './components/User/UserUpdate';
import { CreateObjeto } from './components/Objetos/CreateObjeto';


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

      { path: "objeto/create", element: <CreateObjeto /> },
      { path: "user/detail/:id", element: <UserDetail /> },
      { path: "user/update/:id", element: <UpdateUser /> },
      { path: "objeto/detalle/:id", element: <ObjetoDetalle /> },
      { path: "subasta/detalle/:id", element: <SubastaDetalle /> },
      //ruta para mantenimiento de subastas
      { path: "mantenimiento/subastas", element: <SubastaMantenimiento />},
      { path: "mantenimiento/subastas/crear", element: <CrearSubasta /> }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
    <Toaster richColors position="top-center" />
  </StrictMode>,
)
