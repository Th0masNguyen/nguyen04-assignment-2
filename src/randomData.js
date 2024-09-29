const randomData = (numPoints = 100, xRange = { min: 0, max: 100 }, yRange = { min: 0, max: 100 }) => {
    const data = [];
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * (xRange.max - xRange.min) + xRange.min;
      const y = Math.random() * (yRange.max - yRange.min) + yRange.min;
      data.push({ x, y });
    }
    return data;
  };
  
export default randomData;
  