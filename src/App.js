import React, { useState, useEffect } from 'react';
import KMeans from './KMeans';
import Controls from './Controls';
// import randomData from './randomData'; // Import the randomData function
import KMeansVisualization from './KMeansVisualization'; // Import your visualization component
import { randomData, initializeCentroids, assignClusters, runKMeans, KMeansStep } from './test';



const App = () => {
  const [dataset, setDataset] = useState([]);
  const [numClusters, setNumClusters] = useState(4);
  const [initMethod, setInitMethod] = useState('random');
  const [centroids, setCentroids] = useState([]);
  const [clusters, setClusters] = useState([]);

  function test(){
    const xdata = randomData(10);
    const xcentroids = initializeCentroids(xdata, 2, 'random');
    const xclusters = assignClusters(xdata, xcentroids);
    console.log(xdata)
    console.log(xcentroids)
    console.log(xclusters)
    console.log('meow')
    console.log(KMeansStep(xdata, xcentroids, xclusters))
  }

  useEffect(() => {
    generateDataset()
    
    return () => {
      // Optional cleanup code here
    };
  }, [/* dependencies */]);

  function generateDataset(){
    // Generate random dataset points using randomData
    const newDataset = randomData(100, { min: 0, max: 100 }, { min: 0, max: 100 });
    setDataset(newDataset);
    const newCentroids = initializeCentroids(newDataset, numClusters, initMethod);
    setCentroids(newCentroids);
    const newClusters = assignClusters(newDataset, newCentroids);
    setClusters(newClusters);
  };

  const handleInitMethodChange = (e) => {
    setInitMethod(e.target.value);
  };
  function handleNumClustersChange(e){
    setNumClusters(Number(e.target.value))
  }
  function handleStep(){
    const {centroids: mio, clusters: mao} = KMeansStep(dataset, centroids, clusters);
    setCentroids(mio);
    setClusters(mao);
  }
  function handleRunToConvergence(){
    const {centroids: mio, clusters: mao} = runKMeans(dataset, centroids, clusters);
    setCentroids(mio);
    setClusters(mao);
    if(initMethod === 'manual'){
      const {centroids: lala, clusters: lalala} = runKMeans(dataset, mio, mao);
      setCentroids(lala);
      setClusters(lalala);
    }
  }
  function handleReset(){
    const newCentroids = initializeCentroids(dataset, numClusters, initMethod);
    setCentroids(newCentroids);
    const newClusters = assignClusters(dataset, newCentroids);
    setClusters(newClusters);
  }
  // Define the click handler
  const handlePointClick = (point) => {
    console.log('Clicked Point:', point);
    // You can add more actions here
  };
  const handleSvgClick = (event) => {
    if(initMethod === 'manual' && centroids.length < numClusters){
      const svg = event.currentTarget;
      const rect = svg.getBoundingClientRect();
      
      // Get the mouse position relative to the SVG
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // console.log(`Click coordinates: (${x}, ${y})`);
      //chaning anything at all will break this
      const susX = (x - 92)/4.45;
      const susY = (y - 322)/-2.75;
      console.log(`cliked data coordinates: (${susX}, ${susY})`);
      let newCentroid = {x: susX, y: susY};
      setCentroids([newCentroid, ...centroids]);
    }
  };

  return (
    <div className='mainContainer'>
      <h1>KMeans Clustering Visualization</h1>
      <Controls 
        onInitMethodChange={handleInitMethodChange}
        onGenerateDataset={generateDataset}
        onNumClustersChange={handleNumClustersChange}
        onStep={handleStep}
        onConverge={handleRunToConvergence}
        onReset={handleReset}
        initMethod={initMethod}
        numClusters={numClusters}
      />
       <KMeansVisualization
        dataset={dataset} // You may want to pass dataset state down from KMeansLogic if needed
        centroids={centroids}
        clusters={clusters}
        onPointClick={handlePointClick} // Pass the handler as a prop
        handleSvgClick={handleSvgClick} 
        />
    </div>
  );
};


export default App;



