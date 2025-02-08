function runSimulation() {
    // Get input values
    const S0 = parseFloat(document.getElementById('S0').value);
    const mu = parseFloat(document.getElementById('mu').value);
    const sigma = parseFloat(document.getElementById('sigma').value);
    const timeSteps = parseInt(document.getElementById('timeSteps').value);
    const numPaths = parseInt(document.getElementById('numPaths').value);
    const useLogProcess = document.getElementById('logProcess').checked;

    // Generate paths
    const paths = generatePaths(S0, mu, sigma, timeSteps, numPaths, useLogProcess);
    
    // Create time array
    const time = Array.from({length: timeSteps}, (_, i) => i / timeSteps);
    
    // Plot paths
    plotPaths(time, paths);
    
    // Plot histogram
    plotHistogram(paths);
}

function generatePaths(S0, mu, sigma, timeSteps, numPaths, useLogProcess) {
    const dt = 1 / timeSteps;
    const paths = [];
    
    for(let i = 0; i < numPaths; i++) {
        const path = [S0];
        let logS = Math.log(S0);
        
        for(let j = 1; j < timeSteps; j++) {
            const dW = Math.sqrt(dt) * randn_bm();
            if(useLogProcess) {
                logS += (mu - 0.5 * sigma**2) * dt + sigma * dW;
                path.push(Math.exp(logS));
            } else {
                path.push(path[j-1] * (1 + mu * dt + sigma * dW));
            }
        }
        paths.push(path);
    }
    return paths;
}

function plotPaths(time, paths) {
    const traces = paths.map((path, i) => ({
        x: time,
        y: path,
        type: 'scatter',
        mode: 'lines',
        name: `Path ${i+1}`,
        line: {width: 1}
    }));

    const layout = {
        title: 'Monte Carlo Simulation Paths',
        xaxis: {title: 'Time'},
        yaxis: {title: 'Asset Price'},
        showlegend: false
    };

    Plotly.newPlot('pathsPlot', traces, layout);
}

function plotHistogram(paths) {
    const finalPrices = paths.map(path => path[path.length - 1]);
    
    const trace = {
        x: finalPrices,
        type: 'histogram',
        marker: {color: '#4CAF50'},
        opacity: 0.7
    };

    const layout = {
        title: 'Final Price Distribution',
        xaxis: {title: 'Price'},
        yaxis: {title: 'Frequency'}
    };

    Plotly.newPlot('histogram', [trace], layout);
}

// Box-Muller transform for normal random numbers
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Add event listeners for real-time updates
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        if(this.type === 'range') {
            document.getElementById(this.id + 'Value').textContent = this.value;
        }
        runSimulation();
    });
});

// Initial run
runSimulation();
