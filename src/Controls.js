import './App.css'
const Controls = ({ onInitMethodChange, onNumClustersChange, onGenerateDataset, onStep, onReset, onConverge, initMethod, numClusters }) => {
  return (
    <div className='controlContainer'>
      <h2>Number of Clusters (k):</h2>
      <input type="number" min="1" step="1" onChange={onNumClustersChange} value={numClusters}/>
      <h2>Initialization Method:</h2>
      <select onChange={onInitMethodChange} value={initMethod}>
        <option value="random">Random</option>
        <option value="farthest">Farthest First</option>
        <option value="kmeans++">KMeans++</option>
        <option value="manual">Manual</option>
      </select>
      <br/>
      <button onClick={onGenerateDataset}>Generate Dataset</button>
      <button onClick={() => onStep()}>Step Through KMeans</button>
      <button onClick={onConverge}>Run to Convergence</button>
      <button onClick={onReset}>Reset Algorithm</button>
    </div>
  );
};

export default Controls;