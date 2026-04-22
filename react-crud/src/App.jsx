import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [nagydijak, setNagydijak] = useState([])
  const [formData, setFormData] = useState({ id: '', datum: '', nev: '', helyszin: '' })
  const [isEditing, setIsEditing] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetch('gp.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const data = [];
        let internalId = 1; 
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "") continue;
          const cols = lines[i].split('\t');
          if (cols.length >= 3) {
            data.push({
              id: internalId++,
              datum: cols[0] || '',
              nev: cols[1] || '',
              helyszin: cols[2] ? cols[2].trim() : ''
            });
          }
        }
        setNagydijak(data);
      })
      .catch(err => console.error("Hiba a fájl beolvasásakor", err));
  }, []);

  const filteredNagydijak = nagydijak.filter(gp => {
    if (!gp.nev) return false;
    return gp.nev.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedNagydijak = [...filteredNagydijak].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key].toLowerCase();
    const valueB = b[sortConfig.key].toLowerCase();
    if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  const totalPages = Math.ceil(sortedNagydijak.length / rowsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages) || 1;
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const currentNagydijak = sortedNagydijak.slice(startIndex, startIndex + rowsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSave = (e) => {
    e.preventDefault(); 
    if (!formData.datum || !formData.nev || !formData.helyszin) return;
    if (isEditing) {
      setNagydijak(nagydijak.map(gp => gp.id === formData.id ? formData : gp));
    } else {
      const newId = nagydijak.length > 0 ? Math.max(...nagydijak.map(gp => gp.id)) + 1 : 1;
      setNagydijak([...nagydijak, { ...formData, id: newId }]);
    }
    resetForm();
  }

  const handleDelete = (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a nagydíjat?")) {
      setNagydijak(nagydijak.filter(gp => gp.id !== id));
    }
  }

  const handleEdit = (gp) => {
    setFormData(gp);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const resetForm = () => {
    setFormData({ id: '', datum: '', nev: '', helyszin: '' });
    setIsEditing(false);
  }

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽';
    return ' ↕️'; 
  };

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#e10600' }}>React CRUD - Forma-1 Nagydíjak</h2>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Keresés nagydíj neve alapján</h3>
        {/* A KERESŐMEZŐ KIVILÁGÍTÁSA */}
        <input 
          type="text" 
          placeholder="Gépeld be a nagydíj nevét..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>{isEditing ? "Nagydíj Szerkesztése" : "Új Nagydíj Hozzáadása"}</h3>
        <form onSubmit={handleSave}>
          <input type="text" name="datum" placeholder="Dátum (pl. 1994.05.15)" value={formData.datum} onChange={handleInputChange} required style={inputStyle} />
          <input type="text" name="nev" placeholder="Nagydíj neve" value={formData.nev} onChange={handleInputChange} required style={inputStyle} />
          <input type="text" name="helyszin" placeholder="Helyszín" value={formData.helyszin} onChange={handleInputChange} required style={inputStyle} />
          <button type="submit" style={btnStyle}>{isEditing ? "Mentés" : "Hozzáadás"}</button>
          {isEditing && <button type="button" onClick={resetForm} style={{...btnStyle, background: '#7f8c8d'}}>Mégse</button>}
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ background: '#15151e', color: 'white' }}>
            <th onClick={() => requestSort('datum')} style={{...tdStyle, cursor: 'pointer'}}>Dátum {getSortIndicator('datum')}</th>
            <th onClick={() => requestSort('nev')} style={{...tdStyle, cursor: 'pointer'}}>Nagydíj Neve {getSortIndicator('nev')}</th>
            <th onClick={() => requestSort('helyszin')} style={{...tdStyle, cursor: 'pointer'}}>Helyszín {getSortIndicator('helyszin')}</th>
            <th style={tdStyle}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {currentNagydijak.map((gp) => (
            <tr key={gp.id}>
              <td style={tdStyle}>{gp.datum}</td><td style={tdStyle}>{gp.nev}</td><td style={tdStyle}>{gp.helyszin}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(gp)} style={{...btnStyle, background: '#f39c12', padding: '5px 10px'}}>Szerkeszt</button>
                <button onClick={() => handleDelete(gp.id)} style={{...btnStyle, background: '#c0392b', padding: '5px 10px'}}>Töröl</button>
              </td>
            </tr>
          ))}
          {currentNagydijak.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nincs találat.</td></tr>}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={safeCurrentPage <= 1} style={{...btnStyle, background: safeCurrentPage <= 1 ? '#ccc' : '#e10600'}}>Előző</button>
        <span style={{ margin: '0 20px', fontWeight: 'bold', color: 'black' }}>{safeCurrentPage}. oldal a {totalPages}-ből</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={safeCurrentPage >= totalPages} style={{...btnStyle, background: safeCurrentPage >= totalPages ? '#ccc' : '#e10600'}}>Következő</button>
      </div>
    </div>
  )
}

/* AZ ŰRLAP MEZŐK KIVILÁGÍTÁSA A STÍLUSOKNÁL */
const inputStyle = { width: '100%', padding: '10px', margin: '5px 0 15px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = { background: '#e10600', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold', borderRadius: '4px' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'left', color: 'black' };

export default App