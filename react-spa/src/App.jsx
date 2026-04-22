import { useState, useEffect } from 'react'

function App() {
  const [view, setView] = useState('home');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ datum: '', nev: '', helyszin: '' });

  const API_URL = 'http://localhost:3001/nagydijak';

  const loadData = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Szerver hiba:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormData({ datum: '', nev: '', helyszin: '' });
      loadData();
      setView('list');
    } catch (err) {
      console.error("Mentési hiba:", err);
    }
  };

  // --- STÍLUSOK FRISSÍTÉSE ---
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const btnStyle = { background: '#e10600', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold', borderRadius: '4px' };
  
  // A FEJLÉC MOST MÁR VILÁGOS (Light Gray) ÉS FEKETE SZÖVEGŰ
  const thStyle = { 
    padding: '12px', 
    textAlign: 'left', 
    color: 'black', 
    backgroundColor: '#eeeeee', 
    borderBottom: '3px solid #e10600', // Egy piros csík a fejléc alatt
    fontWeight: 'bold'
  }; 
  
  const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'left', color: 'black' };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh', color: 'black' }}>
      <h2 style={{ color: '#e10600', textAlign: 'center' }}>F1 SPA - Adatbázis Kezelő</h2>
      
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e10600', paddingBottom: '10px', textAlign: 'center' }}>
        <button onClick={() => setView('home')} style={btnStyle}>Főoldal</button>
        <button onClick={() => setView('list')} style={btnStyle}>Adatok listázása</button>
        <button onClick={() => setView('add')} style={btnStyle}>Új felvétele</button>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', color: 'black' }}>
        
        {view === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h3>Üdvözöljük az SPA modulban!</h3>
            <p>Ez az oldal közvetlenül a <code>db.json</code>-ből dolgozik.</p>
            <p>Szerver: <span style={{color: 'green'}}>Online (3001)</span></p>
          </div>
        )}

        {view === 'list' && (
          <div>
            <h3 style={{ textAlign: 'center' }}>Nagydíjak az adatbázisból</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Dátum</th>
                  <th style={thStyle}>Név</th>
                  <th style={thStyle}>Helyszín</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td style={tdStyle}>{item.datum}</td>
                    <td style={tdStyle}>{item.nev}</td>
                    <td style={tdStyle}>{item.helyszin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'add' && (
          <form onSubmit={handleSave} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3>Új bejegyzés hozzáadása</h3>
            <label>Dátum:</label>
            <input type="text" placeholder="pl. 1994.05.15" value={formData.datum} onChange={e => setFormData({...formData, datum: e.target.value})} style={inputStyle} required />
            <label>Név:</label>
            <input type="text" placeholder="Nagydíj neve" value={formData.nev} onChange={e => setFormData({...formData, nev: e.target.value})} style={inputStyle} required />
            <label>Helyszín:</label>
            <input type="text" placeholder="Város/Pálya" value={formData.helyszin} onChange={e => setFormData({...formData, helyszin: e.target.value})} style={inputStyle} required />
            <button type="submit" style={btnStyle}>Mentés az adatbázisba</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default App;