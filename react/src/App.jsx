import { useState } from 'react'
import './App.css'

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
    <div className="mini-app">
      <h2>Kő-Papír-Olló Játék</h2>
      <div className="score-board">
        <p>Játékos: <b>{score.player}</b> | Gép: <b>{score.computer}</b></p>
      </div>
      <div className="choices">
        {choices.map(c => (
          <button key={c} onClick={() => playGame(c)} className="action-btn">{c}</button>
        ))}
      </div>
      {playerChoice && (
        <div className="results">
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
    <div className="mini-app">
      <h2>Napi Teendők</h2>
      <form onSubmit={addTask} className="todo-form">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Új feladat beírása..." 
        />
        <button type="submit" className="action-btn">Hozzáadás</button>
      </form>
      <ul className="todo-list">
        {tasks.map(task => (
          <li key={task.id}>
            {task.text}
            <button onClick={() => deleteTask(task.id)} className="delete-btn">Törlés</button>
          </li>
        ))}
        {tasks.length === 0 && <p style={{color: '#777'}}>Nincsenek teendők. Adj hozzá egyet!</p>}
      </ul>
    </div>
  )
}

export default function App() {
  const [activeApp, setActiveApp] = useState('rps')

  return (
    <div className="spa-container">
      <header className="spa-header">
        <h1>React SPA Alkalmazás</h1>
        <nav className="spa-nav">
          <button className={activeApp === 'rps' ? 'active' : ''} onClick={() => setActiveApp('rps')}>🎮 Kő-Papír-Olló</button>
          <button className={activeApp === 'todo' ? 'active' : ''} onClick={() => setActiveApp('todo')}>📝 Teendőlista</button>
        </nav>
      </header>
      <main className="spa-main">
        {activeApp === 'rps' ? <RockPaperScissors /> : <TodoList />}
      </main>
    </div>
  )
}