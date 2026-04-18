import { useState, useEffect } from 'react';

export default function Crud() {
  const [pilotak, setPilotak] = useState([]);
  const [nev, setNev] = useState('');
  const [nem, setNem] = useState('F');

  useEffect(() => {
    fetch('/pilota.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n');
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "") continue;
          const cols = lines[i].split('\t');
          if (cols.length >= 5) {
            data.push({ id: parseInt(cols[0]), nev: cols[1], nem: cols[2] });
          }
        }
        setPilotak(data.slice(0, 10)); 
      })
      .catch(err => console.error("Hiba a txt beolvasásakor:", err));
  }, []);

  const addPilota = () => {
    if (!nev) return;
    const newId = pilotak.length > 0 ? Math.max(...pilotak.map(p => p.id)) + 1 : 1;
    setPilotak([...pilotak, { id: newId, nev, nem }]);
    setNev('');
  };

  const deletePilota = (id) => {
    setPilotak(pilotak.filter(p => p.id !== id));
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Pilóta CRUD (Helyi txt fájlból)</h2>
      <div style={{ marginBottom: '20px' }}>
        <input value={nev} onChange={e => setNev(e.target.value)} placeholder="Pilóta neve" style={{ padding: '8px', marginRight: '10px' }} />
        <select value={nem} onChange={e => setNem(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="F">Férfi</option>
          <option value="N">Nő</option>
        </select>
        <button onClick={addPilota} style={{ padding: '8px 15px', backgroundColor: '#e10600', color: 'white', border: 'none', borderRadius: '4px' }}>Hozzáadás</button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead><tr><th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>ID</th><th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Név</th><th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Művelet</th></tr></thead>
        <tbody>
          {pilotak.map(p => (
            <tr key={p.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{p.id}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{p.nev}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}><button onClick={() => deletePilota(p.id)} style={{ padding: '5px 10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px' }}>Törlés</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}