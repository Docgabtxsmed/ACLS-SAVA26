import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BLSSurveyPage from './pages/BLSSurveyPage'
import CardiacArrestPage from './pages/CardiacArrestPage'
import BradycardiaPage from './pages/BradycardiaPage'
import TachycardiaPage from './pages/TachycardiaPage'
import ACSPage from './pages/ACSPage'
import StrokePage from './pages/StrokePage'
import LocalAnestheticToxicityPage from './pages/LocalAnestheticToxicityPage'
import MalignantHyperthermiaPage from './pages/MalignantHyperthermiaPage'
import PostCardiacArrestCarePage from './pages/PostCardiacArrestCarePage'
import PediatricCardiacArrestPage from './pages/PediatricCardiacArrestPage'
import AnaphylaxisPage from './pages/AnaphylaxisPage'
import PregnantCardiacArrestPage from './pages/PregnantCardiacArrestPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bls" element={<BLSSurveyPage />} />
      <Route path="/cardiac-arrest" element={<CardiacArrestPage />} />
      <Route path="/bradycardia" element={<BradycardiaPage />} />
      <Route path="/tachycardia" element={<TachycardiaPage />} />
      <Route path="/acs" element={<ACSPage />} />
      <Route path="/stroke" element={<StrokePage />} />
      <Route path="/local-anesthetic-toxicity" element={<LocalAnestheticToxicityPage />} />
      <Route path="/malignant-hyperthermia" element={<MalignantHyperthermiaPage />} />
      <Route path="/post-cardiac-arrest" element={<PostCardiacArrestCarePage />} />
      <Route path="/pediatric-cardiac-arrest" element={<PediatricCardiacArrestPage />} />
      <Route path="/anaphylaxis" element={<AnaphylaxisPage />} />
      <Route path="/pregnant-cardiac-arrest" element={<PregnantCardiacArrestPage />} />
    </Routes>
  )
}

export default App

