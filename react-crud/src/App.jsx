import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [nagydijak, setNagydijak] = useState([])
  const [formData, setFormData] = useState({ id: '', datum: '', nev: '', helyszin: '' })
  const [isEditing, setIsEditing] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10;

  useEffect(() => {
    fetch('/gp.txt')
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
  
  const totalPages = Math.ceil(filteredNagydijak.length / rowsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages) || 1;
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const currentNagydijak = filteredNagydijak.slice(startIndex, startIndex + rowsPerPage);

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
      setCurrentPage(Math.ceil((nagydijak.length + 1) / rowsPerPage)); 
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

  return (
    <div className="container">
      <h2>React CRUD - Forma-1 Nagydíjak</h2>

      <div className="form-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Keresés nagydíj neve alapján</h3>
        <input 
          type="text" 
          placeholder="Gépeld be a nagydíj nevét..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>

      <div className="form-card">
        <h3>{isEditing ? "Nagydíj Szerkesztése" : "Új Nagydíj Hozzáadása"}</h3>
        <form onSubmit={handleSave}>
          <input type="text" name="datum" placeholder="Dátum (pl. 1994.05.15)" value={formData.datum} onChange={handleInputChange} required />
          <input type="text" name="nev" placeholder="Nagydíj neve (pl. Monacoi)" value={formData.nev} onChange={handleInputChange} required />
          <input type="text" name="helyszin" placeholder="Helyszín (pl. Monaco)" value={formData.helyszin} onChange={handleInputChange} required />
          
          <button type="submit">{isEditing ? "Mentés" : "Hozzáadás"}</button>
          {isEditing && <button type="button" onClick={resetForm} style={{backgroundColor: '#7f8c8d'}}>Mégse</button>}
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Dátum</th>
            <th>Nagydíj Neve</th>
            <th>Helyszín</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {currentNagydijak.map((gp) => (
            <tr key={gp.id}>
              <td>{gp.datum}</td>
              <td>{gp.nev}</td>
              <td>{gp.helyszin}</td>
              <td>
                <button onClick={() => handleEdit(gp)} style={{backgroundColor: '#f39c12'}}>Szerkesztés</button>
                <button onClick={() => handleDelete(gp.id)} style={{backgroundColor: '#c0392b'}}>Törlés</button>
              </td>
            </tr>
          ))}
          {currentNagydijak.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nincs találat a keresésre.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="form-card" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={safeCurrentPage <= 1}
          style={{ backgroundColor: safeCurrentPage <= 1 ? '#ccc' : '#e10600' }}
        >
          Előző oldal
        </button>
        <span style={{ margin: '0 20px', fontWeight: 'bold' }}>
          {safeCurrentPage}. oldal a {totalPages}-ből ({filteredNagydijak.length} találat)
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={safeCurrentPage >= totalPages}
          style={{ backgroundColor: safeCurrentPage >= totalPages ? '#ccc' : '#e10600' }}
        >
          Következő oldal
        </button>
      </div>
    </div>
  )
}

export default App