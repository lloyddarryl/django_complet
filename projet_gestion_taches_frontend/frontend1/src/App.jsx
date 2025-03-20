import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Accueil from './components/Accueil';
import Connexion from './components/Connexion';
import Inscription from './components/Inscription';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ProfesseurDashboard from './pages/ProfesseurDashboard';
import Projets from './pages/Projets';
import Taches from './pages/Taches';
import StatistiquesEtudiant from './pages/StatistiquesEtudiant';
import StatistiquesProfesseur from './pages/StatistiquesProfesseur';
import { EtudiantProvider } from './context/EtudiantContext';
import { ProfProvider } from './context/ProfContext';
import { tabStorage } from './utils/sessionStorage';
import ProfilUtilisateur from './pages/ProfilUtilisateur';


function RequireAuth({ children }) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
}

function App() {
    // Utiliser tabStorage pour la séparation selon le role
    const role = tabStorage.getItem('role'); 

    return (
        <Router>
            <Routes>
                {/* Route par défaut */}
                <Route path="/" element={<Accueil />} />

                {/* Route de connexion */}
                <Route path="/login" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />

                {/* Routes étudiant avec Provider */}
                <Route path="/etudiant" element={
                    <RequireAuth>
                        <EtudiantProvider>
                            <EtudiantDashboard />
                        </EtudiantProvider>
                    </RequireAuth>
                } />

                {/* Routes professeur avec Provider */}
                <Route path="/professeur" element={
                    <RequireAuth>
                        <ProfProvider>
                            <ProfesseurDashboard />
                        </ProfProvider>
                    </RequireAuth>
                } />

                <Route path="/profil" element={
                    <RequireAuth>
                     {role === 'PROFESSEUR' ? (
                      <ProfProvider>
                         <ProfilUtilisateur />
                     </ProfProvider>
                                ) : (
                        <EtudiantProvider>
                            <ProfilUtilisateur />
                         </EtudiantProvider>
                             )}
                    </RequireAuth>
                                    } />

                {/* Routes projets et tâches avec Provider approprié en fonction du rôle */}
                <Route path="/projets" element={
                    <RequireAuth>
                        {role === 'PROFESSEUR' ? (
                            <ProfProvider>
                                <Projets />
                            </ProfProvider>
                        ) : (
                            <EtudiantProvider>
                                <Projets />
                            </EtudiantProvider>
                        )}
                    </RequireAuth>
                } />

                <Route path="/taches" element={
                    <RequireAuth>
                        {role === 'PROFESSEUR' ? (
                            <ProfProvider>
                                <Taches />
                            </ProfProvider>
                        ) : (
                            <EtudiantProvider>
                                <Taches />
                            </EtudiantProvider>
                        )}
                    </RequireAuth>
                } />

                {/* routes statistiques avec Provider approprié */}
                <Route path="/statistiques" element={
                    <RequireAuth>
                        {role === 'PROFESSEUR' ? (
                            <ProfProvider>
                                <StatistiquesProfesseur />
                            </ProfProvider>
                        ) : (
                            <EtudiantProvider>
                                <StatistiquesEtudiant />
                            </EtudiantProvider>
                        )}
                    </RequireAuth>
                } />
            </Routes>
        </Router>
    );
}

export default App;