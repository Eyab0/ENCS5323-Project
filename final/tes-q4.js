document.getElementById("throughputForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const BW = parseFloat(document.getElementById("BW").value);
    const BWUnit = document.getElementById("BWUnit").value;
    const tau = parseFloat(document.getElementById("tau").value);
    const tauUnit = document.getElementById("tauUnit").value;
    const frameSize = parseFloat(document.getElementById("frameSize").value);
    const frameSizeUnit = document.getElementById("frameSizeUnit").value;
    const frameRate = parseFloat(document.getElementById("frameRate").value);
    const frameRateUnit = document.getElementById("frameRateUnit").value;

    // Ensure all fields are filled out
    if (isNaN(BW) || isNaN(tau) || isNaN(frameRate) || isNaN(frameSize)) {
        return;
    }

    // Convert input values to appropriate units
    let BW_bps;
    switch (BWUnit) {
        case 'Kbps':
            BW_bps = BW * 1e3;
            break;
        case 'Mbps':
            BW_bps = BW * 1e6;
            break;
        case 'Gbps':
            BW_bps = BW * 1e9;
            break;
        default:
            BW_bps = BW * 1e6; // Default to Mbps
    }

    let tau_sec;
    switch (tauUnit) {
        case 'microseconds':
            tau_sec = tau * 1e-6;
            break;
        case 'milliseconds':
            tau_sec = tau * 1e-3;
            break;
        case 'seconds':
            tau_sec = tau;
            break;
        default:
            tau_sec = tau * 1e-6; // Default to microseconds
    }

    let frameSize_bits;
    switch (frameSizeUnit) {
        case 'Kbits':
            frameSize_bits = frameSize * 1e3;
            break;
        case 'Mbits':
            frameSize_bits = frameSize * 1e6;
            break;
        case 'Gbits':
            frameSize_bits = frameSize * 1e9;
            break;
        default:
            frameSize_bits = frameSize * 1e3; // Default to Kbits
    }

    let frameRate_fps;
    switch (frameRateUnit) {
        case 'Kfps':
            frameRate_fps = frameRate * 1e3;
            break;
        case 'Mfps':
            frameRate_fps = frameRate * 1e6;
            break;
        case 'Gfps':
            frameRate_fps = frameRate * 1e9;
            break;
        default:
            frameRate_fps = frameRate * 1e3; // Default to Kfps
    }

    // Calculate the transmission time per bit
    const T_b = 1 / BW_bps;
    console.log("Tb:", T_b);

    // Calculate the frame transmission time
    const T_frame = frameSize_bits * T_b;
    console.log("T_frame:", T_frame);

    // Calculate the normalized load
    const G = frameRate_fps * T_frame;
    console.log("G:", G);

    // Calculate alpha
    const alpha = tau_sec / T_frame;
    console.log("alpha:", alpha);

    // Calculate throughput using the formula for nonpersistent CSMA
    const exp_term = Math.exp(-2 * alpha * T_frame);
    console.log("exp_term:", exp_term);
    console.log("(G * (1 + 2 * alpha) * Math.exp(-alpha * G)):", (G * (1 + 2 * alpha) * Math.exp(-alpha * G)));

    const S_th = (G * exp_term) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
    console.log("S_th:", S_th);

    // Convert throughput to percentage
    const throughput_percentage = S_th * 100;

    document.getElementById("result").innerHTML = "Throughput: <strong>" + throughput_percentage.toFixed(2) + " %</strong><br><br>";
});


function Explanation() {
    const BW = parseFloat(document.getElementById("BW").value);
    const BWUnit = document.getElementById("BWUnit").value;
    const tau = parseFloat(document.getElementById("tau").value);
    const tauUnit = document.getElementById("tauUnit").value;
    const frameSize = parseFloat(document.getElementById("frameSize").value);
    const frameSizeUnit = document.getElementById("frameSizeUnit").value;
    const frameRate = parseFloat(document.getElementById("frameRate").value);
    const frameRateUnit = document.getElementById("frameRateUnit").value;

    // Ensure all fields are filled out
    if (isNaN(BW) || isNaN(tau) || isNaN(frameRate) || isNaN(frameSize)) {
        return;
    }

    let BW_bps;
    switch (BWUnit) {
        case 'Kbps':
            BW_bps = BW * 1e3;
            break;
        case 'Mbps':
            BW_bps = BW * 1e6;
            break;
        case 'Gbps':
            BW_bps = BW * 1e9;
            break;
        default:
            BW_bps = BW * 1e6; // Default to Mbps
    }

    let tau_sec;
    switch (tauUnit) {
        case 'microseconds':
            tau_sec = tau * 1e-6;
            break;
        case 'milliseconds':
            tau_sec = tau * 1e-3;
            break;
        case 'seconds':
            tau_sec = tau;
            break;
        default:
            tau_sec = tau * 1e-6; // Default to microseconds
    }

    let frameSize_bits;
    switch (frameSizeUnit) {
        case 'Kbits':
            frameSize_bits = frameSize * 1e3;
            break;
        case 'Mbits':
            frameSize_bits = frameSize * 1e6;
            break;
        case 'Gbits':
            frameSize_bits = frameSize * 1e9;
            break;
        default:
            frameSize_bits = frameSize * 1e3; // Default to Kbits
    }

    let frameRate_fps;
    switch (frameRateUnit) {
        case 'Kfps':
            frameRate_fps = frameRate * 1e3;
            break;
        case 'Mfps':
            frameRate_fps = frameRate * 1e6;
            break;
        case 'Gfps':
            frameRate_fps = frameRate * 1e9;
            break;
        default:
            frameRate_fps = frameRate * 1e3; // Default to Kfps
    }

    const T_b = 1 / BW_bps;
    const T_frame = frameSize_bits * T_b;
    const G = frameRate_fps * T_frame;
    const alpha = tau_sec / T_frame;
    const exp_term = Math.exp(-2 * alpha * T_frame);
    const S_th = (G * exp_term) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
    const throughput_percentage = S_th * 100;

    let explanation = `
        <h2>Given Data:</h2>
        <ul>
            <li>Bandwidth (\\( BW \\)): <span class="highlight">${BW} ${BWUnit}</span></li>
            <li>Maximum signal propagation time (\\( \\tau \\)): <span class="highlight">${tau} ${tauUnit}</span></li>
            <li>Frame size (\\( F_{\\text{size}} \\)): <span class="highlight">${frameSize} ${frameSizeUnit}</span></li>
            <li>Frame rate (\\( g \\)): <span class="highlight">${frameRate} ${frameRateUnit}</span></li>
        </ul>

        <h2>Steps to Solve:</h2>
        <ol>
            <li><strong>Calculate the transmission time per bit (\\( T_b \\)):</strong>
                <div class="equation">
                    \\( T_b = \\frac{1}{BW} \\)<br>
                    \\( T_b = \\frac{1}{${BW} \\times 10^6} \\)<br>
                    \\( T_b = ${T_b.toFixed(9)} \\text{ seconds} \\)
                </div>
            </li>
            <li><strong>Calculate the frame transmission time (\\( T_{\\text{frame}} \\)):</strong>
                <div class="equation">
                    \\( T_{\\text{frame}} = \\text{Frame Size} \\times T_b \\)<br>
                    \\( T_{\\text{frame}} = ${frameSize_bits} \\times ${T_b.toFixed(9)} \\)<br>
                    \\( T_{\\text{frame}} = ${T_frame.toFixed(9)} \\text{ seconds} \\)
                </div>
            </li>
            <li><strong>Calculate the normalized load (\\( G \\)):</strong>
                <div class="equation">
                    \\( G = g \\times T_{\\text{frame}} \\)<br>
                    \\( G = ${frameRate_fps} \\times ${T_frame.toFixed(9)} \\)<br>
                    \\( G = ${G.toFixed(4)} \\)
                </div>
            </li>
            <li><strong>Determine the parameter \\( \\alpha \\):</strong>
                <div class="equation">
                    \\( \\alpha = \\frac{\\tau}{T_{\\text{frame}}} \\)<br>
                    \\( \\alpha = \\frac{${tau_sec}}{${T_frame.toFixed(9)}} \\)<br>
                    \\( \\alpha = ${alpha.toFixed(4)} \\)
                </div>
            </li>
            <li><strong>Calculate the throughput (\\( S_{\\text{th}} \\)):</strong>
                <div class="equation">
                    \\( S_{\\text{th}} = \\frac{G e^{-2\\alpha G}}{G(1+2\\alpha) + e^{-\\alpha G}} \\)<br>
                    <br><br>Plugging in the values:<br>
                    \\( S_{\\text{th}} = \\frac{${G.toFixed(4)} e^{-2 \\times ${alpha.toFixed(4)} \\times ${G.toFixed(4)}}}{${G.toFixed(4)}(1 + 2 \\times ${alpha.toFixed(4)}) + e^{- ${alpha.toFixed(4)} \\times ${G.toFixed(4)}}} \\)<br>
                   <br><br> Simplifying:<br>
                    \\( S_{\\text{th}} = ${S_th.toFixed(4)} \\)
                </div>
            </li>
            <li><strong>Convert the throughput to a percentage:</strong>
                <div class="equation">
                    \\( \\text{Throughput in percent} = ${throughput_percentage.toFixed(2)}\\% \\)
                </div>
            </li>
        </ol>

        <h2>Result:</h2>
        <p>Therefore, the throughput of the network, given the conditions provided, is approximately <strong>${throughput_percentage.toFixed(2)}%</strong>.</p>
    `;

    document.getElementById('explain').innerHTML = explanation;
    MathJax.typeset();
}


//        // JavaScript to toggle explanation visibility and change button text
// function toggleExplanation() {
//         var explainDiv = document.getElementById('explain');
//         var toggleButton = document.getElementById('toggleButton');

//         if (explainDiv.style.display === 'none') {
//             explainDiv.style.display = 'block';
//             toggleButton.textContent = 'Hide Explanation!';
//             Explaination2();
//         } else {
            
//             explainDiv.style.display = 'none';
//             toggleButton.textContent = 'Show Explanation!';
            
            
//         }
//     }