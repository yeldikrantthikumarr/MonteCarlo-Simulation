let chart = null;

document.getElementById('simulate-btn').addEventListener('click', simulatePaths);
document.querySelectorAll('.model-btn').forEach(btn => {
    btn.addEventListener('click', () => setModel(btn.dataset.model));
});

function setModel(model) {
    document.querySelectorAll('.model-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-model="${model}"]`).classList.add('active');
    // Add model-specific logic here
}

function simulatePaths() {
    const config = {
        S0: parseFloat(document.getElementById('S0').value),
        mu: parseFloat(document.getElementById('mu').value),
        sigma: parseFloat(document.getElementById('sigma').value),
        steps: parseInt(document.getElementById('steps').value),
        maxPaths: parseInt(document.getElementById('max-paths').value),
        useLog: document.getElementById('log-process').checked
    };

    const paths = generatePaths(config);
    visualizePaths(paths, config);
}

function generatePaths(config) {
    const paths = [];
    const dt = 1 / config.steps;
    
    for(let i = 0; i < config.maxPaths; i++) {
        const path = [config.S0];
        let S = config.S0;
        
        for(let j = 1; j < config.steps; j++) {
            const dW = Math.sqrt(dt) * randn_bm();
            if(config.useLog) {
                const dLogS = (config.mu - 0.5 * config.sigma**2) * dt + config.sigma * dW;
                S = S * Math.exp(dLogS);
            } else {
                const dS = config.mu * S * dt + config.sigma * S * dW;
                S += dS;
            }
            path.push(S);
        }
        paths.push(path);
    }
    return paths;
}

function visualizePaths(paths, config) {
    const ctx = document.getElementById('pathChart').getContext('2d');
    
    if(chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: config.steps}, (_, i) => i),
            datasets: paths.slice(0, 50).map((path, i) => ({
                label: `Path ${i+1}`,
                data: path,
                borderColor: `rgba(33, 150, 243, ${0.3})`,
                borderWidth: 1,
                pointRadius: 0,
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Time Steps' }
                },
                y: {
                    title: { display: true, text: 'Asset Price' },
                    beginAtZero: false
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Box-Muller transform for normal random numbers
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
