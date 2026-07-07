import { Routes, Route, Link } from 'react-router-dom';
import PlayersPage from './pages/PlayersPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import PlayerDetailPage from './pages/PlayerDetailPage';
import PlayerFormPage from './pages/PlayerFormPage';
import TeamFormPage from './pages/TeamFormPage';
import './App.css';
import NoticeBanner from './components/NoticeBanner';

function App() {
  return (
    <div className="app">
      <NoticeBanner />
      <nav className="navbar">
        <Link to="/" className="nav-title">SMB4 Database</Link>
        <Link to="/" className="nav-logo-center">
          <img src="/misc/smb4_logo.png" alt="Super Mega Baseball 4" className="nav-logo"></img>
        </Link>
        <div className="nav-links">
          <Link to="/">Players</Link>
          <Link to="/teams">Teams</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<PlayersPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/players/:playerId" element={<PlayerDetailPage />} />
          <Route path="/admin/players/new" element={<PlayerFormPage />} />
          <Route path="/admin/players/:playerId/edit" element={<PlayerFormPage />} />
          <Route path="/admin/teams/new" element={<TeamFormPage />} />
          <Route path="/admin/teams/:teamId/edit" element={<TeamFormPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;