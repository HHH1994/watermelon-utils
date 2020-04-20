import React from 'react';
import { getRandomColor,listCountByColum } from './components';

function App() {
    const a = listCountByColum([{id:'a',key:'xxx'},{id:'b'},{id:'b'}]);
    const b = null;
    console.log(a,b?.c)
    return (
        <div className="App" style={{ color: getRandomColor() }}>
            1
        </div>
    );
}

export default App;
