import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import App from "./App"
import { HeroItem } from "./components/HeroItem/HeroItem"

export const Root = () => (
  <Router basename="/Star-Wars">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/hero/:heroId" element={<HeroItem />} />
    </Routes>
  </Router>
)