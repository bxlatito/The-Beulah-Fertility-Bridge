import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'
import Disclaimer from './pages/Disclaimer.tsx'
import Donate from './pages/Donate.tsx'
import GetInvolved from './pages/GetInvolved.tsx'
import GetSupport from './pages/GetSupport.tsx'
import Learn from './pages/Learn.tsx'
import PrivacyNotice from './pages/PrivacyNotice.tsx'
import Safeguarding from './pages/Safeguarding.tsx'
import WhatWeDo from './pages/WhatWeDo.tsx'
import { HelmetProvider } from 'react-helmet-async'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Navigate to="/" replace /> },
      { path: "about", element: <About /> },
      { path: "what-we-do", element: <WhatWeDo /> },
      { path: "learn", element: <Learn /> },
      { path: "get-support", element: <GetSupport /> },
      { path: "get-involved", element: <GetInvolved /> },
      { path: "contact", element: <Contact /> },
      { path: "donate", element: <Donate /> },
      { path: "privacy-notice", element: <PrivacyNotice /> },
      { path: "safeguarding", element: <Safeguarding /> },
      { path: "disclaimer", element: <Disclaimer /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
<StrictMode>
  <HelmetProvider>
    <RouterProvider router={router} />
  </HelmetProvider>
</StrictMode>,
)