// Simulated API call (replace with your actual API call)
const fetchDataFromApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Data from simulated API',
        timestamp: new Date().toISOString(),
        items: [1, 2, 3, 4, 5],
      });
    }, 1000); // Simulate API delay
  });
};

module.exports = { fetchDataFromApi };
