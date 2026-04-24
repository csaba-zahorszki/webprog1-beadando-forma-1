import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://f1beadando.nhely.hu/api.php'

export default function App() {
  const [eredmenyek, setEredmenyek] = useState([])
  const [formData, setFormData] = useState({ datum: '', pilotaaz: '', helyezes: '', hiba: '', csapat: '', tipus: '', motor: '' })
  const [editingId, setEditingId] = useState(null)

  // Lapozás és Rendezés Állapotai
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortCol, setSortCol] = useState('id')
  const [sortDir, setSortDir] = useState('desc')

  // Ez figyeli, ha lapozunk vagy rendezünk, és azonnal frissíti az adatokat!
  useEffect(() => { 
    fetchData() 
  }, [currentPage, sortCol, sortDir])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${currentPage}&sort=${sortCol}&dir=${sortDir}`)
      setEredmenyek(response.data.data || [])
      setTotalPages(Math.ceil((response.data.total || 0) / (response.data.limit || 100)) || 1)
    } catch (error) { console.error(error) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) { await axios.put(`${API_URL}/${editingId}`, formData) }
      else { await axios.post(API_URL, formData) }
      setFormData({ datum: '', pilotaaz: '', helyezes: '', hiba: '', csapat: '', tipus: '', motor: '' })
      setEditingId(null)
      fetchData() 
    } catch (error) { console.error(error) }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Biztosan törlöd ezt az eredményt?")) {
      try { await axios.delete(`${API_URL}/${id}`); fetchData() } catch (error) { console.error(error) }
    }
  }

  const handleEdit = (item) => {
    setFormData({ datum: item.datum !== 'null' ? item.datum : '', pilotaaz: item.pilotaaz !== 'null' ? item.pilotaaz : '', helyezes: item.helyezes !== 'null' ? item.helyezes : '', hiba: item.hiba !== 'null' ? item.hiba : '', csapat: item.csapat !== 'null' ? item.csapat : '', tipus: item.tipus !== 'null' ? item.tipus : '', motor: item.motor !== 'null' ? item.motor : '' })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const requestSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
    setCurrentPage(1) // Rendezésnél mindig ugrunk az 1. oldalra!
  }

  const getSortIcon = (col) => {
    if (sortCol !== col) return ' ↕️'
    return sortDir === 'asc' ? ' ⬆️' : ' ⬇️'
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f4f4f4', minHeight: '100vh', color: 'black' }}>
      <h2 style={{ color: '#c82323', marginTop: 0 }}>React + Axios CRUD (Eredmények)</h2>
      
      <div style={{ background: '#eee', padding: '20px', borderRadius: '5px', marginBottom: '20px', color: 'black' }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? "Eredmény Szerkesztése" : "Új Eredmény Hozzáadása"}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <input type="text" placeholder="Dátum" value={formData.datum} onChange={e => setFormData({...formData, datum: e.target.value})} required style={inputStyle} />
          <input type="number" placeholder="Pilóta ID" value={formData.pilotaaz} onChange={e => setFormData({...formData, pilotaaz: e.target.value})} required style={inputStyle} />
          <input type="number" placeholder="Helyezés" value={formData.helyezes} onChange={e => setFormData({...formData, helyezes: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Hiba" value={formData.hiba} onChange={e => setFormData({...formData, hiba: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Csapat" value={formData.csapat} onChange={e => setFormData({...formData, csapat: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Típus" value={formData.tipus} onChange={e => setFormData({...formData, tipus: e.target.value})} style={inputStyle} />
          <input type="text" placeholder="Motor" value={formData.motor} onChange={e => setFormData({...formData, motor: e.target.value})} style={inputStyle} />
          <button type="submit" style={editingId ? btnUpdateStyle : btnAddStyle}>{editingId ? "Mentés" : "Hozzáadás"}</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({ datum: '', pilotaaz: '', helyezes: '', hiba: '', csapat: '', tipus: '', motor: '' })}} style={{...btnAddStyle, background: 'gray'}}>Mégse</button>}
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', color: 'black', fontSize: '0.9em' }}>
        <thead>
          <tr style={{ background: '#15151e' }}>
            <th onClick={() => requestSort('datum')} style={thStyle}>Dátum {getSortIcon('datum')}</th>
            <th onClick={() => requestSort('pilota_neve')} style={thStyle}>Pilóta Neve {getSortIcon('pilota_neve')}</th>
            <th onClick={() => requestSort('helyezes')} style={thStyle}>Helyezés {getSortIcon('helyezes')}</th>
            <th onClick={() => requestSort('hiba')} style={thStyle}>Hiba {getSortIcon('hiba')}</th>
            <th onClick={() => requestSort('csapat')} style={thStyle}>Csapat {getSortIcon('csapat')}</th>
            <th onClick={() => requestSort('tipus')} style={thStyle}>Típus {getSortIcon('tipus')}</th>
            <th onClick={() => requestSort('motor')} style={thStyle}>Motor {getSortIcon('motor')}</th>
            <th style={{...thStyle, cursor: 'default'}}>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {eredmenyek.map(item => {
            // Egy kis okos segédfüggvény: ha az adat üres, 0, vagy "null" szöveg, akkor adjon vissza egy kötőjelet!
            const formatData = (val) => (!val || val === '0' || val === 0 || val === 'null') ? '-' : val;

            return (
              <tr key={item.id}>
                <td style={tdStyle}>{formatData(item.datum)}</td>
                <td style={tdStyle}><strong>{item.pilota_neve ? item.pilota_neve : 'ID: ' + item.pilotaaz}</strong></td>
                <td style={tdStyle}>{formatData(item.helyezes)}</td>
                <td style={tdStyle}>{formatData(item.hiba)}</td>
                <td style={tdStyle}>{formatData(item.csapat)}</td>
                <td style={tdStyle}>{formatData(item.tipus)}</td>
                <td style={tdStyle}>{formatData(item.motor)}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(item)} style={{...btnUpdateStyle, padding: '5px 10px', marginRight: '5px'}}>Módosít</button>
                  <button onClick={() => handleDelete(item.id)} style={{...btnDeleteStyle, padding: '5px 10px'}}>Töröl</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* LAPOZÓ GOMBOK */}
      <div style={{ textAlign: 'center', marginTop: '25px', padding: '10px' }}>
        {currentPage > 10 && <button style={pageBtnStyle} onClick={() => setCurrentPage(currentPage - 10)}>&laquo; -10</button>}
        <button style={pageBtnStyle} disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>Előző</button>
        <span style={{ margin: '0 15px', fontWeight: 'bold', fontSize: '1.1em' }}>{currentPage}. oldal a {totalPages}-ből</span>
        <button style={pageBtnStyle} disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Következő</button>
        {currentPage <= totalPages - 10 && <button style={pageBtnStyle} onClick={() => setCurrentPage(currentPage + 10)}>+10 &raquo;</button>}
      </div>
    </div>
  )
}

// Stílusok a tiszta kódhoz
const inputStyle = { flex: '1', minWidth: '120px', padding: '8px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px' }
const btnAddStyle = { background: '#e10600', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '3px', whiteSpace: 'nowrap' }
const btnUpdateStyle = { background: '#f39c12', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '3px', whiteSpace: 'nowrap' }
const btnDeleteStyle = { background: '#333', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '3px', whiteSpace: 'nowrap' }
const thStyle = { padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: 'white', cursor: 'pointer', userSelect: 'none' }
const tdStyle = { padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', color: 'black' }
const pageBtnStyle = { background: '#15151e', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', margin: '0 5px', borderRadius: '3px' }