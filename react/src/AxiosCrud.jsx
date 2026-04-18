import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AxiosCrud() {
    const [pilotak, setPilotak] = useState([]);
    const [nev, setNev] = useState('');
    
    // Ez a json-servered címe!
    const API_URL = 'http://localhost:3000/pilotak';

    // 1. READ - Adatok lekérése
    const fetchPilotak = () => {
        axios.get(API_URL)
            .then(valasz => {
                setPilotak(valasz.data); // Az axios automatikusan JSON-t csinál a válaszból
            })
            .catch(hiba => console.error("Hiba a lekérésnél:", hiba));
    };

    // Amikor betölt a komponens, egyből le is kérjük az adatokat
    useEffect(() => {
        fetchPilotak();
    }, []);

    // 2. CREATE - Új pilóta hozzáadása
    const hozzaadPilota = () => {
        if (!nev) return alert("Kérlek írj be egy nevet!");

        axios.post(API_URL, {
            nev: nev,
            nem: "F",
            szuldat: "ismeretlen",
            nemzet: "ismeretlen"
        }).then(() => {
            setNev(''); // Mező kiürítése
            fetchPilotak(); // Lista frissítése
        });
    };

    // 3. DELETE - Pilóta törlése
    const torolPilota = (id) => {
        if (!window.confirm("Biztosan törlöd a szerverről?")) return;

        axios.delete(`${API_URL}/${id}`)
            .then(() => fetchPilotak()); // Lista frissítése törlés után
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', color: 'black' }}>
            <h2>Axios CRUD (Szerveres mentés)</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <input 
                    value={nev} 
                    onChange={e => setNev(e.target.value)} 
                    placeholder="Új pilóta neve..." 
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }} 
                />
                <button onClick={hozzaadPilota} style={{ padding: '8px 15px', backgroundColor: '#e10600', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Hozzáadás
                </button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' }}>Azonosító</th>
                        <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' }}>Név</th>
                        <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' }}>Művelet</th>
                    </tr>
                </thead>
                <tbody>
                    {pilotak.map(p => (
                        <tr key={p.id}>
                            <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{p.id}</td>
                            <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{p.nev}</td>
                            <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                                <button onClick={() => torolPilota(p.id)} style={{ padding: '5px 10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
                                    Törlés
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}