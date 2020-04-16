import React from 'react';
import { getRandomColor,listCountByColum } from './components';

function App() {
    const a = listCountByColum([{id:'a',key:'xxx'},{id:'b'},{id:'b'}]);
    console.log(a)
    return (
        <div className="App" style={{ color: getRandomColor() }}>
            1
        </div>
    );
}

export default App;
