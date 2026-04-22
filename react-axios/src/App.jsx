import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3001/nagydijak'

export default function App() {
  const [nagydijak, setNagydijak] = useState([])
  const [formData, setFormData] = useState({ datum: '', nev: '', helyszin: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL)
      setNagydijak(response.data) 
    } catch (error) { console.error(error) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) { await axios.put(`${API_URL}/${editingId}`, formData) }
      else { await axios.post(API_URL, formData) }
      setFormData({ datum: '', nev: '', helyszin: '' }); setEditingId(null); fetchData() 
    } catch (error) { console.error(error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Törlöd?")) {
      try { await axios.delete(`${API_URL}/${id}`); fetchData() } catch (error) { console.error(error) }
    }
  }

  const handleEdit = (gp) => {
    setFormData({ datum: gp.datum, nev: gp.nev, helyszin: gp.helyszin })
    setEditingId(gp.id); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh', color: 'black' }}>
      <h2 style={{ color: '#e10600' }}>React + Axios CRUD (Nagydíjak)</h2>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', marginBottom: '20px', color: 'black' }}>
        <h3>{editingId ? "Nagydíj Szerkesztése" : "Új Nagydíj Hozzáadása"}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Dátum" value={formData.datum} onChange={e => setFormData({...formData, datum: e.target.value})} required style={inputStyle} />
          <input type="text" placeholder="Név" value={formData.nev} onChange={e => setFormData({...formData, nev: e.target.value})} required style={inputStyle} />
          <input type="text" placeholder="Helyszín" value={formData.helyszin} onChange={e => setFormData({...formData, helyszin: e.target.value})} required style={inputStyle} />
          <button type="submit" style={btnStyle}>{editingId ? "Mentés" : "Hozzáadás"}</button>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', color: 'black' }}>
        <thead>
          <tr style={{ background: '#15151e', color: 'white' }}>
            <th style={tdStyle}>Dátum</th><th style={tdStyle}>Név</th><th style={tdStyle}>Helyszín</th><th style={tdStyle}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {nagydijak.map(gp => (
            <tr key={gp.id}>
              <td style={tdStyle}>{gp.datum}</td><td style={tdStyle}>{gp.nev}</td><td style={tdStyle}>{gp.helyszin}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(gp)} style={{...btnStyle, background: '#f39c12', padding: '5px 10px'}}>Szerkeszt</button>
                <button onClick={() => handleDelete(gp.id)} style={{...btnStyle, background: '#333', padding: '5px 10px'}}>Töröl</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px', margin: '5px 0 15px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px' };
const btnStyle = { background: '#e10600', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', marginRight: '5px' };
const tdStyle = { padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'left' };