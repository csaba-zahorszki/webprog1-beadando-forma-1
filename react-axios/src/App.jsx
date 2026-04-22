import { useState, useEffect } from 'react'
import axios from 'axios'

// 1. JAVÍTÁS: Átírtuk 3001-es portra, mert itt fut a nagydijak.db.json!
const API_URL = 'http://localhost:3001/nagydijak'

export default function App() {
  const [nagydijak, setNagydijak] = useState([])
  const [formData, setFormData] = useState({ datum: '', nev: '', helyszin: '' })
  const [editingId, setEditingId] = useState(null)

  // READ: Adatok betöltése az adatbázisból induláskor
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL)
      setNagydijak(response.data) 
    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error)
    }
  }

  // CREATE & UPDATE: Mentés az adatbázisba
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData)
      } else {
        await axios.post(API_URL, formData)
      }
      setFormData({ datum: '', nev: '', helyszin: '' })
      setEditingId(null)
      fetchData() 
    } catch (error) {
      console.error("Hiba mentéskor:", error)
    }
  }

  // DELETE: Törlés az adatbázisból
  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törlöd ezt a nagydíjat az adatbázisból?")) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        fetchData() 
      } catch (error) {
        console.error("Hiba törléskor:", error)
      }
    }
  }

  // Szerkesztés előkészítése
  const handleEdit = (gp) => {
    setFormData({ datum: gp.datum, nev: gp.nev, helyszin: gp.helyszin })
    setEditingId(gp.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ color: '#e10600' }}>React + Axios CRUD (Nagydíjak)</h2>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3>{editingId ? "Nagydíj Szerkesztése" : "Új Nagydíj Hozzáadása"}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Dátum (pl. 2024.05.15)" value={formData.datum} onChange={e => setFormData({...formData, datum: e.target.value})} required style={inputStyle} />
          <input type="text" placeholder="Nagydíj neve" value={formData.nev} onChange={e => setFormData({...formData, nev: e.target.value})} required style={inputStyle} />
          <input type="text" placeholder="Helyszín" value={formData.helyszin} onChange={e => setFormData({...formData, helyszin: e.target.value})} required style={inputStyle} />
          <button type="submit" style={btnStyle}>{editingId ? "Mentés" : "Hozzáadás az adatbázishoz"}</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({datum:'', nev:'', helyszin:''})}} style={{...btnStyle, background: 'gray'}}>Mégse</button>}
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <thead>
          {/* 2. JAVÍTÁS: A white szót betettük idézőjelek közé! */}
          <tr style={{ background: '#15151e', color: 'white' }}>
            <th style={tdStyle}>Dátum</th>
            <th style={tdStyle}>Név</th>
            <th style={tdStyle}>Helyszín</th>
            <th style={tdStyle}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {nagydijak.map(gp => (
            <tr key={gp.id}>
              <td style={tdStyle}>{gp.datum}</td>
              <td style={tdStyle}>{gp.nev}</td>
              <td style={tdStyle}>{gp.helyszin}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(gp)} style={{...btnStyle, background: '#f39c12', padding: '5px 10px', fontSize: '0.8em'}}>Szerkesztés</button>
                <button onClick={() => handleDelete(gp.id)} style={{...btnStyle, background: '#333', padding: '5px 10px', fontSize: '0.8em'}}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 3. JAVÍTÁS: A stílusokat egyszer definiáljuk, tisztán, a fájl legalján.
const inputStyle = { width: '100%', padding: '10px', margin: '5px 0 15px', boxSizing: 'border-box' } 
const btnStyle = { background: '#e10600', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' } 
const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'left' }