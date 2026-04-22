import { useState } from 'react'

function App() {
  const [view, setView] = useState('home'); // Ez vezérli az SPA navigációt

  // Adatok a nézetekhez
  const [pilots] = useState([
    { id: 1, name: 'Charles Leclerc', team: 'Ferrari' },
    { id: 2, name: 'Max Verstappen', team: 'Red Bull' }
  ]);

  // Fehér mező stílus beállítása
  const inputStyle = { 
    width: '100%', padding: '10px', marginBottom: '10px', 
    backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px' 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh', color: 'black' }}>
      <h2 style={{ color: '#e10600' }}>F1 Single Page Application (SPA)</h2>
      
      {/* SPA Navigációs sáv - Nincs oldalújratöltés! */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e10600', paddingBottom: '10px' }}>
        <button onClick={() => setView('home')} style={btnStyle}>Kezdőlap</button>
        <button onClick={() => setView('pilots')} style={btnStyle}>Pilóták</button>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        {view === 'home' && (
          <div>
            <h3>Üdvözöljük!</h3>
            <p>Ez egy Single Page Application. A fenti gombokkal válthatsz nézetet anélkül, hogy a böngésző frissítene.</p>
            <input type="text" placeholder="Írj ide valamit (fehér mező teszt)..." style={inputStyle} />
          </div>
        )}

        {view === 'pilots' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{background:'#15151e', color:'white'}}><th style={tdStyle}>ID</th><th style={tdStyle}>Név</th><th style={tdStyle}>Csapat</th></tr></thead>
            <tbody>
              {pilots.map(p => <tr key={p.id}><td style={tdStyle}>{p.id}</td><td style={tdStyle}>{p.name}</td><td style={tdStyle}>{p.team}</td></tr>)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const btnStyle = { background: '#e10600', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold', borderRadius: '4px' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'left' };

export default App