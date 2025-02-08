document.getElementById('var-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get user inputs
  const portfolioValue = parseFloat(document.getElementById('portfolio-value').value);
  const volatility = parseFloat(document.getElementById('volatility').value) / 100;
  const timeHorizon = parseFloat(document.getElementById('time-horizon').value);
  const confidenceLevel = parseFloat(document.getElementById('confidence-level').value) / 100;

  // Run Monte Carlo simulation
  const numSimulations = 10000; // Number of simulations
  const dailyReturns = [];
  for (let i = 0; i < numSimulations; i++) {
    const randomReturn = volatility * Math.sqrt(timeHorizon) * randn_bm();
    dailyReturns.push(randomReturn);
  }

  // Sort returns and compute VaR
  dailyReturns.sort((a, b) => a - b);
  const varIndex = Math.floor((1 - confidenceLevel) * numSimulations);
  const varValue = portfolioValue * dailyReturns[varIndex];

  // Display result
  document.getElementById('var-output').textContent = `VaR: $${varValue.toFixed(2)}`;
});

// Standard Normal variate using Box-Muller transform
function randn_bm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}