import React from 'react';
import { getRandomColor } from './components';

function App() {
    return (
        <div className="App" style={{ color: getRandomColor() }}>
            1
        </div>
    );
}

export default App;
