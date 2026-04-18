import { useState } from 'react'
import Crud from './Crud'
import AxiosCrud from './AxiosCrud'

// --- A TI KÓDOTOK: KŐ-PAPÍR-OLLÓ ---
function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [result, setResult] = useState('')
  const [score, setScore] = useState({ player: 0, computer: 0 })

  const choices = ['Kő', 'Papír', 'Olló']

  const playGame = (choice) => {
    const computerRandom = choices[Math.floor(Math.random() * choices.length)]
    setPlayerChoice(choice)
    setComputerChoice(computerRandom)

    if (choice === computerRandom) {
      setResult('Döntetlen!')
    } else if (
      (choice === 'Kő' && computerRandom === 'Olló') ||
      (choice === 'Papír' && computerRandom === 'Kő') ||
      (choice === 'Olló' && computerRandom === 'Papír')
    ) {
      setResult('Te nyertél!')
      setScore(prev => ({ ...prev, player: prev.player + 1 }))
    } else {
      setResult('A gép nyert!')
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Kő-Papír-Olló Játék</h2>
      <div style={{ fontSize: '1.2em', margin: '20px 0' }}>
        <p>Játékos: <b style={{color: 'green'}}>{score.player}</b> | Gép: <b style={{color: 'red'}}>{score.computer}</b></p>
      </div>
      <div>
        {choices.map(c => (
          <button key={c} onClick={() => playGame(c)} style={{ padding: '10px 20px', margin: '5px', fontSize: '1.1em', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>
            {c}
          </button>
        ))}
      </div>
      {playerChoice && (
        <div style={{ marginTop: '30px' }}>
          <p>Te választásod: <b>{playerChoice}</b></p>
          <p>Gép választása: <b>{computerChoice}</b></p>
          <h3 style={{ color: result === 'Te nyertél!' ? 'green' : result === 'A gép nyert!' ? 'red' : 'gray' }}>
            {result}
          </h3>
        </div>
      )}
    </div>
  )
}

// --- A TI KÓDOTOK: TEENDŐLISTA ---
function TodoList() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setTasks([...tasks, { id: Date.now(), text: inputValue }])
    setInputValue('')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Napi Teendők</h2>
      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Új feladat beírása..." 
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#e10600', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Hozzáadás
        </button>
      </form>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd', marginBottom: '5px', borderRadius: '4px' }}>
            {task.text}
            <button onClick={() => deleteTask(task.id)} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
              Törlés
            </button>
          </li>
        ))}
        {tasks.length === 0 && <p style={{color: '#777', textAlign: 'center'}}>Nincsenek teendők. Adj hozzá egyet!</p>}
      </ul>
    </div>
  )
}

// --- FŐ ALKALMAZÁS MENÜVEL (ÖSSZESÍTVE) ---
export default function App() {
  const [activeTab, setActiveTab] = useState('crud')

  // Gombok stílusa
  const btnStyle = { padding: '10px 15px', margin: '5px', cursor: 'pointer', backgroundColor: '#15151e', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' };
  const activeBtnStyle = { ...btnStyle, backgroundColor: '#e10600' };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #e10600', paddingBottom: '20px' }}>
        <h1 style={{ color: '#e10600' }}>React SPA – Összesített Feladatok</h1>
        
        <nav style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={activeTab === 'crud' ? activeBtnStyle : btnStyle} onClick={() => setActiveTab('crud')}>
            Pilóta CRUD
          </button>
          <button style={activeTab === 'rps' ? activeBtnStyle : btnStyle} onClick={() => setActiveTab('rps')}>
            🎮 Kő-Papír-Olló
          </button>
          <button style={activeTab === 'todo' ? activeBtnStyle : btnStyle} onClick={() => setActiveTab('todo')}>
            📝 Teendőlista
          </button>
          <button style={activeTab === 'axios' ? activeBtnStyle : btnStyle} onClick={() => setActiveTab('axios')}>
            Axios CRUD
          </button>
          
          <a href="../../index.html" style={{...btnStyle, textDecoration: 'none', backgroundColor: '#7f8c8d', display: 'inline-block'}}>
            Vissza a főoldalra
          </a>
        </nav>
      </header>

      <main style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minHeight: '400px' }}>
        {/* Feltételes megjelenítés aszerint, melyik gombra kattintottunk */}
        {activeTab === 'crud' && <Crud />}
        {activeTab === 'rps' && <RockPaperScissors />}
        {activeTab === 'todo' && <TodoList />}
        {activeTab === 'axios' && <AxiosCrud />}
      </main>

    </div>
  )
}