import * as d3 from 'd3';
// [ {x: 1, y: 2}, {x:3, y: 4} ]
function randomData(numPoints = 100, xRange = { min: 0, max: 100 }, yRange = { min: 0, max: 100 }){
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
      const y = Math.random() * (yRange.max - yRange.min) + yRange.min;
      data.push({ x, y });
    }
    return data;
};
// Function to initialize centroids
function initializeCentroids(dataset, numClusters, initMethod){
    if (initMethod === 'random') {
      return randomInit();
    } else if (initMethod === 'farthest') {
      return farthestFirstInit();
    } else if (initMethod === 'kmeans++') {
      return kMeansPlusPlusInit();
    } else {
      return []; // For manual selection
    }
  

  function randomInit(){
    const shuffled = dataset.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numClusters);
  };

  function farthestFirstInit(){
    const centroids = [];
    const firstCentroid = dataset[Math.floor(Math.random() * dataset.length)];
    centroids.push(firstCentroid);

    while (centroids.length < numClusters) {
      const distances = dataset.map(point => {
        return Math.min(...centroids.map(centroid => getDistance(point, centroid)));
      });

      const farthestPointIndex = distances.indexOf(Math.max(...distances));
      centroids.push(dataset[farthestPointIndex]);
    }

    return centroids;
  };

  function kMeansPlusPlusInit(){
    const centroids = [];
    const firstCentroid = dataset[Math.floor(Math.random() * dataset.length)];
    centroids.push(firstCentroid);

    while (centroids.length < numClusters) {
      const distances = dataset.map(point => {
        return Math.min(...centroids.map(centroid => getDistance(point, centroid)));
      });

      const sumDistances = distances.reduce((sum, distance) => sum + distance, 0);
      const probabilities = distances.map(distance => distance / sumDistances);

      const cumulativeProbabilities = probabilities.map((prob, index) =>
        probabilities.slice(0, index + 1).reduce((a, b) => a + b, 0)
      );

      const randomValue = Math.random();
      const nextCentroidIndex = cumulativeProbabilities.findIndex(cp => cp >= randomValue);
      centroids.push(dataset[nextCentroidIndex]);
    }

    return centroids;
    };
};
function getDistance(pointA, pointB){
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
};

function assignClusters(dataset, centroids){
    return dataset.map(point => {
      const distances = centroids.map(centroid => getDistance(point, centroid));
      return distances.indexOf(Math.min(...distances));
    });
};

function updateCentroids(dataset, centroids, clusters){
    return centroids.map((_, clusterIndex) => {
      const pointsInCluster = dataset.filter((_, index) => clusters[index] === clusterIndex);
      if (pointsInCluster.length === 0) return centroids[clusterIndex]; // If no points, keep old centroid

      const meanX = d3.mean(pointsInCluster.map(point => point.x));
      const meanY = d3.mean(pointsInCluster.map(point => point.y));
      return { x: meanX, y: meanY };
    });
};

function checkConvergence(oldCentroids, newCentroids){
    return newCentroids.every((centroid, index) =>
    getDistance(centroid, oldCentroids[index]) < 0.001 // Convergence threshold
    );
};

function runKMeans(dataset, centroids, clusters){
    let currentCentroids = [...centroids];
    let currentClusters = [...clusters];
    const converged = false;

    while (!converged) {
        const { newCentroids, newClusters } = KMeansStep(dataset, currentCentroids, currentClusters);

      // Check for convergence
      if (checkConvergence(currentCentroids, newCentroids)) {
        converged = true;
      }
      currentCentroids = newCentroids;
      currentClusters = newClusters;
    }
    return {centroids: currentCentroids, clusters: currentClusters}
};

function KMeansStep(dataset, centroids, clusters){
    let currentCentroids = [...centroids];
    let currentClusters = [...clusters];

    const newCentroids = updateCentroids(dataset, currentCentroids, currentClusters);
    currentClusters = assignClusters(dataset, newCentroids);

    return {centroids: currentCentroids, clusters: currentClusters}
};

function main(){
    xdata = randomData(10);
    xcentroids = initializeCentroids(data, 2, 'random');
    xclusters = assignClusters(data, centroids);
    console.log(xdata)
    console.log(xcentroids)
    console.log(xclusters)
}
main()