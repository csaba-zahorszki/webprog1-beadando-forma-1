const fs = require('fs');

try {
    // Beolvassuk a pilota.txt fájlt
    const txtAdat = fs.readFileSync('pilota.txt', 'utf-8');
    const sorok = txtAdat.split('\n');

    const eredmeny = [];

    // Az i = 1-től indulunk, hogy a fejlécet (az, nev, nem...) automatikusan átugorjuk!
    for (let i = 1; i < sorok.length; i++) {
        if (sorok[i].trim() === "") continue; 
        
        // Tabulátor mentén daraboljuk a sort
        const oszlopok = sorok[i].split('\t');
        
        // Ha megvan mind az 5 oszlop, beletesszük a listába
        if (oszlopok.length >= 5) {
            eredmeny.push({
                id: oszlopok[0].trim(),         // "az" oszlop
                nev: oszlopok[1].trim(),        // "nev" oszlop
                nem: oszlopok[2].trim(),        // "nem" oszlop
                szuldat: oszlopok[3].trim(),    // "szuldat" oszlop
                nemzet: oszlopok[4].trim()      // "nemzet" oszlop
            });
        }
    }

    // Becsomagoljuk a "pilotak" kulcs alá
    const veglegesAdatbazis = {
        "pilotak": eredmeny 
    };

    // Létrehozzuk a db.json-t
    fs.writeFileSync('db.json', JSON.stringify(veglegesAdatbazis, null, 2), 'utf-8');
    console.log(`✅ Sikeres konvertálás! ${eredmeny.length} pilóta adata bekerült a db.json fájlba.`);

} catch (hiba) {
    console.error("❌ Hiba! Nem találom a pilota.txt fájlt. Biztos, hogy a fő mappában van?");
}