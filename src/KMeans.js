import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const KMeans = ({ dataset, numClusters }) => {
  const [centroids, setCentroids] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [step, setStep] = useState(0);
  const [converged, setConverged] = useState(false);
  const [currentStepData, setCurrentStepData] = useState([]);

  // Function to initialize centroids
  const initializeCentroids = (method) => {
    if (method === 'random') {
      return randomInit();
    } else if (method === 'farthest') {
      return farthestFirstInit();
    } else if (method === 'kmeans++') {
      return kMeansPlusPlusInit();
    } else {
      return []; // For manual selection
    }
  };

  const randomInit = () => {
    const shuffled = dataset.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numClusters);
  };

  const farthestFirstInit = () => {
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

  const kMeansPlusPlusInit = () => {
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

  const getDistance = (pointA, pointB) => {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
  };

  const assignClusters = () => {
    return dataset.map(point => {
      const distances = centroids.map(centroid => getDistance(point, centroid));
      return distances.indexOf(Math.min(...distances)); // Assign to nearest centroid
    });
  };

  const updateCentroids = (clusters) => {
    return centroids.map((_, clusterIndex) => {
      const pointsInCluster = dataset.filter((_, index) => clusters[index] === clusterIndex);
      if (pointsInCluster.length === 0) return centroids[clusterIndex]; // If no points, keep old centroid

      const meanX = d3.mean(pointsInCluster.map(point => point.x));
      const meanY = d3.mean(pointsInCluster.map(point => point.y));
      return { x: meanX, y: meanY };
    });
  };

  const checkConvergence = (oldCentroids, newCentroids) => {
    return newCentroids.every((centroid, index) =>
      getDistance(centroid, oldCentroids[index]) < 0.001 // Convergence threshold
    );
  };

  const runKMeans = (method) => {
    const initialCentroids = initializeCentroids(method);
    let currentCentroids = initialCentroids;
    let clusters;

    setCentroids(initialCentroids);
    setClusters(new Array(dataset.length).fill(0));

    while (!converged) {
      clusters = assignClusters();
      const newCentroids = updateCentroids(clusters);
      setCurrentStepData({ clusters, centroids: newCentroids });
      
      // Check for convergence
      if (checkConvergence(currentCentroids, newCentroids)) {
        setConverged(true);
      }

      currentCentroids = newCentroids;
      setCentroids(currentCentroids);
      setClusters(clusters);
    }
  };

  const handleStep = (method) => {
    if (step === 0) {
      runKMeans(method);
    } else {
      // Perform one step of KMeans
      const clusters = assignClusters();
      const newCentroids = updateCentroids(clusters);
      
      setCurrentStepData({ clusters, centroids: newCentroids });
      setCentroids(newCentroids);
      setClusters(clusters);
      
      if (checkConvergence(centroids, newCentroids)) {
        setConverged(true);
      }
    }
    
    setStep(step + 1);
  };

  useEffect(() => {
    if (dataset.length > 0 && centroids.length === 0) {
      // Initialize with the default method when the dataset is available
      runKMeans('random');
    }
  }, [dataset]);

  const draw = () => {
    const svg = d3.select('svg');
    svg.selectAll('*').remove();

    // Draw data points
    svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 5)
      .attr('fill', (d, i) => {
        const clusterIndex = clusters[i];
        return clusterIndex === undefined ? 'black' : d3.schemeCategory10[clusterIndex % 10];
      });

    // Draw centroids
    svg.selectAll('centroid')
      .data(centroids)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 8)
      .attr('fill', 'red');
  };

  useEffect(() => {
    draw(); // Call draw whenever dataset, centroids, or clusters change
  }, [dataset, centroids, clusters]);

  return (
    <svg width={600} height={400}>
      {/* D3 visualization goes here */}
    </svg>
  );
};

export default KMeans;
