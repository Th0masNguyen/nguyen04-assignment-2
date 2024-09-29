import React from 'react';
import randomData from '../randomData';
import Plot from './Plot';
import './App.css'

function App() {
  const InitMethods = {
    Random: 'Random',
    FarthestFirst: 'Farthest First',
    KMeansPP: 'KMeans++',
    Manual: 'Manual'
  };
  
  // Example usage
  const data = randomData();
  console.log(data);
  
  return (
    <div className="mainContainer">
      <h1>Kmeans Clustering Algorithm</h1>
      <h2>Number of Clusters (k):</h2>
      <input type="number" min="1" step="1"/>
      <h2>Initialization Method:</h2>
      <select>
        {/* Map through InitMethods to create option elements */}
        {Object.entries(InitMethods).map(([key, value]) => (
          <option key={key} value={value}>
            {value} {/* This will display the method name */}
          </option>
        ))}
      </select>
      <br/>
      <button type="button">Step Through Kmeans</button>
      <button type="button">Run to Convergence</button>
      <button type="button">Generate New Dataset</button>
      <button type="button">Reset Algorithm</button>
      <Plot data={data} />
    </div>
  );
}

export default App;