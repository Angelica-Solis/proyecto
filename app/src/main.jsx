//uso de sonner
import { Toaster } from 'sonner';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'

import { UserTable } from './components/User/UserTable'
import { UserDetail } from './components/User/UserDetail'
import { UpdateUser } from './components/User/UserUpdate'
import { CreateUsuario } from './components/User/UserCreate'
import { Login } from './components/User/UserLogin'

import { ObjetoTable } from './components/Objetos/ListadoObjetos'
import { ObjetoDetalle } from './components/Objetos/DetalleObjeto'
import { CreateObjeto } from './components/Objetos/CreateObjeto'
import { UpdateObjeto } from './components/Objetos/UpdateObjeto'

import { SubastaTable } from './components/Subasta/SubastaTable'
import { SubastaDetalle } from './components/Subasta/DetalleSubasta'
import { CrearSubasta } from "./components/Subasta/CrearSubasta"
import { EditarSubasta } from './components/Subasta/EditarSubasta'
import { SubastaEnCurso } from './components/Subasta/SubastaEnCurso'

import { PujaTable } from './components/Pujas/ListadoPujas'

import { RoleRoute } from './components/Auth/RoleRoute'
import UserProvider from './context/UserProvider';

const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <PageNotFound /> },

      // 🔓 RUTAS PÚBLICAS
      { path: "user/login", element: <Login /> },
      { path: "user/create", element: <CreateUsuario /> },
      { path: "subastas", element: <SubastaTable /> },
      { path: "objeto/listado", element: <ObjetoTable /> },

      // 🔐 SOLO ADMIN
      {
        path: "user/table",
        element: (
          <RoleRoute requiredRoles={["Administrador"]}>
            <UserTable />
          </RoleRoute>
        )
      },
      {
        path: "user/detail/:id",
        element: (
          <RoleRoute requiredRoles={["Administrador"]}>
            <UserDetail />
          </RoleRoute>
        )
      },
      {
        path: "user/update/:id",
        element: (
          <RoleRoute requiredRoles={["Administrador"]}>
            <UpdateUser />
          </RoleRoute>
        )
      },
      {
        path: "puja/listado/:id",
        element: (
          <RoleRoute requiredRoles={["Administrador"]}>
            <PujaTable />
          </RoleRoute>
        )
      },

      // 🔐 ADMIN y VENDEDOR (mantenimiento subastas)
      {
        path: "mantenimiento/subastas/crear",
        element: (
          <RoleRoute requiredRoles={["Administrador", "Vendedor"]}>
            <CrearSubasta />
          </RoleRoute>
        )
      },
      {
        path: "mantenimiento/subastas/editar/:id",
        element: (
          <RoleRoute requiredRoles={["Administrador", "Vendedor"]}>
            <EditarSubasta />
          </RoleRoute>
        )
      },

      // 🔐 SOLO COMPRADOR (pujar)
      {
        path: "subastas/participar/:id",
        element: (
          <RoleRoute requiredRoles={["Comprador"]}>
            <SubastaEnCurso />
          </RoleRoute>
        )
      },

      // 🔐 TODOS LOGUEADOS
      {
        path: "subasta/detalle/:id",
        element: (
          <RoleRoute>
            <SubastaDetalle />
          </RoleRoute>
        )
      },
      {
        path: "objeto/detalle/:id",
        element: (
          <RoleRoute>
            <ObjetoDetalle />
          </RoleRoute>
        )
      },

      // 🔐 MANTENIMIENTO OBJETOS (SOLO ADMIN)
      {
        path: "objeto/create",
        element: (
          <RoleRoute requiredRoles={["Administrador"]}>
            <CreateObjeto />
          </RoleRoute>
        )
      },
      {
        path: "objeto/update/:id",
        element: (
          <RoleRoute requiredRoles={["Administrador"]}>
            <UpdateObjeto />
          </RoleRoute>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
      <Toaster richColors position="top-center" />
    </UserProvider>
  </StrictMode>,
)