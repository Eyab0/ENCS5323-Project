document.getElementById("throughputForm").addEventListener("submit", function (event) {
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
    const positiveInput = Boolean(BW>=0 && tau>=0 && frameSize>=0 && frameRate>=0);

    if(!positiveInput)
        alert('There should be no begative values !');
    else{

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

    // Original unslotted nonpersistent CSMA throughput
    const exp_term = Math.exp(-2 * alpha * T_frame);
    console.log("exp_term:", exp_term);
    console.log("(G * (1 + 2 * alpha) * Math.exp(-alpha * G)):", (G * (1 + 2 * alpha) * Math.exp(-alpha * G)));

    const S_th_unslotted = (G * exp_term) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
    console.log("S_th:", S_th_unslotted);

    // Calculate throughput for slotted nonpersistent CSMA


    const S_th_nonpersistent = slottedNonpersistentCSMA(alpha, G, T_frame);
    const S_th_one_persistent = slottedOnePersistentCSMA(alpha, G);

    // Convert throughput to percentage
    const throughput_unslotted_percentage = S_th_unslotted * 100;
    const throughput_nonpersistent_percentage = S_th_nonpersistent * 100;
    const throughput_one_persistent_percentage = S_th_one_persistent * 100;

    document.getElementById("result").innerHTML =
        "Unslotted Nonpersistent CSMA Throughput: <strong>" + throughput_unslotted_percentage.toFixed(2) + " %</strong><br>" +
        "Slotted Nonpersistent CSMA Throughput: <strong>" + throughput_nonpersistent_percentage.toFixed(2) + " %</strong><br>" +
        "Slotted 1-persistent CSMA Throughput: <strong>" + throughput_one_persistent_percentage.toFixed(2) + " %</strong><br>";
}
});


function slottedNonpersistentCSMA(alpha, G, T_frame) {
    const numerator = alpha * G * Math.exp(-2 * alpha * T_frame);
    const denominator = (1 - Math.exp(-alpha * G) + alpha);
    const S_th = numerator / denominator;
    return (S_th > 1? 1 : S_th);
}

// Calculate throughput for slotted 1-persistent CSMA
function slottedOnePersistentCSMA(alpha, G) {
    const numerator = G * (1 + alpha - Math.exp(-alpha * G)) * Math.exp(-G * (1 + alpha));
    const denominator = (1 + alpha) * (1 - Math.exp(-alpha * G)) + alpha * Math.exp(-G * (1 + alpha));
    const S_th = numerator / denominator;
    return S_th;
}


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
    const S_th_unslotted = (G * exp_term) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
    const throughput_percentage_unslotted = S_th_unslotted * 100;

    const S_th_nonpersistent = slottedNonpersistentCSMA(alpha, G, T_frame);
    const S_th_one_persistent = slottedOnePersistentCSMA(alpha, G);
    const throughput_percentage_nonpersistent = S_th_nonpersistent * 100;
    const throughput_percentage_one_persistent = S_th_one_persistent * 100;

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
            <li><strong>Calculate the unslotted nonpersistent CSMA throughput (\\( S_{\\text{th}} \\)):</strong>
                <div class="equation">
                    \\( S_{\\text{th}} = \\frac{G e^{-2\\alpha G}}{G(1+2\\alpha) + e^{-\\alpha G}} \\)<br>
                    <br><br>Plugging in the values:<br>
                    \\( S_{\\text{th}} = \\frac{${G.toFixed(4)} e^{-2 \\times ${alpha.toFixed(4)} \\times ${G.toFixed(4)}}}{${G.toFixed(4)}(1 + 2 \\times ${alpha.toFixed(4)}) + e^{- ${alpha.toFixed(4)} \\times ${G.toFixed(4)}}} \\)<br>
                   <br><br> Simplifying:<br>
                    \\( S_{\\text{th}} = ${S_th_unslotted.toFixed(4)} \\)
                </div>
            </li>
            <li><strong>Convert the unslotted nonpersistent CSMA throughput to a percentage:</strong>
                <div class="equation">
                    \\( \\text{Throughput in percent} = ${throughput_percentage_unslotted.toFixed(2)}\\% \\)
                </div>
            </li>
            <li><strong>Calculate the slotted nonpersistent CSMA throughput (\\( S_{\\text{th}} \\)):</strong>
                <div class="equation">
                    \\( S_{\\text{th}} = \\frac{G e^{-G(1+2\\alpha)}}{(1+\\alpha)G + (1-\\alpha)e^{-G}} \\)<br>
                    <br><br>Plugging in the values:<br>
                    \\( S_{\\text{th}} = \\frac{${G.toFixed(4)} e^{- ${G.toFixed(4)}(1+2 \\times ${alpha.toFixed(4)})}}{(1+${alpha.toFixed(4)})${G.toFixed(4)} + (1-${alpha.toFixed(4)})e^{- ${G.toFixed(4)}}} \\)<br>
                   <br><br> Simplifying:<br>
                    \\( S_{\\text{th}} = ${S_th_nonpersistent.toFixed(4)} \\)
                </div>
            </li>
            <li><strong>Convert the slotted nonpersistent CSMA throughput to a percentage:</strong>
                <div class="equation">
                    \\( \\text{Throughput in percent} = ${throughput_percentage_nonpersistent.toFixed(2)}\\% \\)
                </div>
            </li>
            <li><strong>Calculate the slotted 1-persistent CSMA throughput (\\( S_{\\text{th}} \\)):</strong>
                <div class="equation">
                    \\( S_{\\text{th}} = \\frac{G (1+\\alpha - e^{-\\alpha G}) e^{-G(1+\\alpha)}}{(1+\\alpha)(1-e^{-\\alpha G}) + \\alpha e^{-G(1+\\alpha)}} \\)<br>
                    <br><br>Plugging in the values:<br>
                    \\( S_{\\text{th}} = \\frac{${G.toFixed(4)} (1+${alpha.toFixed(4)} - e^{- ${alpha.toFixed(4)} \\times ${G.toFixed(4)}}) e^{- ${G.toFixed(4)}(1+${alpha.toFixed(4)})}}{(1+${alpha.toFixed(4)})(1-e^{- ${alpha.toFixed(4)} \\times ${G.toFixed(4)}}) + ${alpha.toFixed(4)} e^{- ${G.toFixed(4)}(1+${alpha.toFixed(4)})}} \\)<br>
                   <br><br> Simplifying:<br>
                    \\( S_{\\text{th}} = ${S_th_one_persistent.toFixed(4)} \\)
                </div>
            </li>
            <li><strong>Convert the slotted 1-persistent CSMA throughput to a percentage:</strong>
                <div class="equation">
                    \\( \\text{Throughput in percent} = ${throughput_percentage_one_persistent.toFixed(2)}\\% \\)
                </div>
            </li>
        </ol>

        <h2>Result:</h2>
        <p>Therefore, the throughput of the network, given the conditions provided, is approximately:</p>
        <ul>
            <li>Unslotted Nonpersistent CSMA: <strong>${throughput_percentage_unslotted.toFixed(2)}%</strong></li>
            <li>Slotted Nonpersistent CSMA: <strong>${throughput_percentage_nonpersistent.toFixed(2)}%</strong></li>
            <li>Slotted 1-persistent CSMA: <strong>${throughput_percentage_one_persistent.toFixed(2)}%</strong></li>
        </ul>
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