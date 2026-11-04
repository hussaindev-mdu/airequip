import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/Layout'
import { QuoteProvider } from './QuoteContext'
import Home from './pages/Home'
import Products from './pages/Products'
import { loadCollection } from './pages/lazy'
import Services from './pages/Services'
import Industries from './pages/Industries'
import Locations from './pages/Locations'
import District from './pages/District'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const Collection = lazy(loadCollection)

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <QuoteProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="collection" element={<Collection />} />
            <Route path="services" element={<Services />} />
            <Route path="industries" element={<Industries />} />
            <Route path="locations" element={<Locations />} />
            <Route path="locations/:slug" element={<District />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </QuoteProvider>
    </BrowserRouter>
  )
}
