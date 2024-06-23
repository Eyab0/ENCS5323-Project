const jsonData = {
    "BPSK/QPSK": {
        "0.1": -0.86,
        "0.01": 4.32,
        "0.001": 6.79,
        "0.0001": 8.40,
        "1e-05": 9.59,
        "1e-06": 10.53,
        "1e-07": 11.31,
        "1e-08": 11.97
    },
    "8-PSK": {
        "0.1": 1.47,
        "0.01": 7.89,
        "0.001": 10.61,
        "0.0001": 12.00,
        "1e-05": 13.57,
        "1e-06": 14.55,
        "1e-07": 15.35,
        "1e-08": 16.03
    },
    "16-PSK": {
        "0.1": 5.30,
        "0.01": 11.10,
        "0.001": 13.70,
        "0.0001": 15.36,
        "1e-05": 16.58,
        "1e-06": 17.54,
        "1e-07": 18.34,
        "1e-08": 19.01
    }
};
document.addEventListener('DOMContentLoaded', function () {


    const modulationSelect = document.getElementById('modulation-select');
    const berSelect = document.getElementById('ber-select');
    //const showButton = document.getElementById('show-button');
    //const berValueBox = document.getElementById('ber-value-box');

    // Populate BER select options based on selected modulation
    modulationSelect.addEventListener('change', function () {
        const selectedModulation = modulationSelect.value;
        populateBerOptions(selectedModulation);
    });

    // Initial population of BER options
    populateBerOptions(modulationSelect.value);


    // Function to populate BER options based on selected modulation
    function populateBerOptions(modulation) {
        // Clear previous options
        berSelect.innerHTML = '';

        // Populate options based on selected modulation
        for (const ber in jsonData[modulation]) {
            const option = document.createElement('option');
            option.value = ber;
            option.textContent = ber;
            berSelect.appendChild(option);
        }
    }
});

document.getElementById('calcForm').addEventListener('submit', function (event) {
    event.preventDefault();

    calculateTransmitPower();
});

function dbToLinear(db) {
    return Math.pow(10, db / 10);
}

function linearToDb(linear) {
    return 10 * Math.log10(linear);
}

function dbmToWatts(dbm) {
    return Math.pow(10, (dbm - 30) / 10);
}

function wattsToDbm(watts) {
    return 10 * Math.log10(watts) + 30;
}


function askInput(value, unit) {
    if (unit === "db") {
        return parseFloat(value);
    } else if (unit === "dbm") {
        return linearToDb(dbmToWatts(parseFloat(value)));
    } else {
        return linearToDb(parseFloat(value));
    }
}

function calculateTransmitPower() {
    const k_dB = -228.6;  // Boltzmann's constant in dB
    const T_dB = 10 * Math.log10(290);  // Noise temperature in dB
    const EbN0_dB = jsonData[document.getElementById('modulation-select').value][document.getElementById('ber-select').value];
    // const R_dB = 10 * Math.log10(parseFloat(document.getElementById("R").value) * 1000);  // Data rate in dB

    const Lp_dB = askInput(document.getElementById("Lp").value, document.getElementById("LpUnit").value);  // Path loss
    const f_dB = document.getElementById("f").value;  // Frequency
    const Gt_dB = askInput(document.getElementById("Gt").value, document.getElementById("GtUnit").value);  // Transmit antenna gain
    const Gr_dB = askInput(document.getElementById("Gr").value, document.getElementById("GrUnit").value);  // Receive antenna gain
    const Lf_dB = askInput(document.getElementById("Lf").value, document.getElementById("LfUnit").value);  // Antenna feed line loss
    const Lo_dB = askInput(document.getElementById("Lo").value, document.getElementById("LoUnit").value);  // Other losses
    const M_dB = askInput(document.getElementById("M").value, document.getElementById("MUnit").value);  // Fade margin
    const Ar_dB = askInput(document.getElementById("Ar").value, document.getElementById("ArUnit").value);  // Receiver amplifier gain
    const Nf_dB = askInput(document.getElementById("Nf").value, document.getElementById("NfUnit").value);  // Noise figure
    const link_margin_dB = askInput(document.getElementById("link_margin").value, document.getElementById("link_marginUnit").value);  // Link margin


    const R_Unit = document.getElementById("RUnit").value;

    let R_dB = parseFloat(document.getElementById("R").value);

    switch (R_Unit) {
        case 'Kbps':
            R_dB = R_dB * 1e3;
            break;
        case 'Mbps':
            R_dB = R_dB * 1e6;
            break;
        case 'Gbps':
            R_dB = R_dB * 1e9;
            break;
        default:
            R_dB = R_dB * 1e3; // Default to Kbps
    }

    R_dB = 10 * Math.log10(R_dB);

    const power_received = M_dB + k_dB + T_dB + Nf_dB + R_dB + EbN0_dB;  // Noise floor in dB

    const Pt_dB = power_received + Lp_dB - Gt_dB - Gr_dB + Lf_dB + Lo_dB - Ar_dB + link_margin_dB;


    document.getElementById("result").innerHTML = "Transmit Power (Pt) = " + Pt_dB.toFixed(2) + " dB";
}

function Explanation() {


    const k_dB = -228.6;  // Boltzmann's constant in dB
    const T_dB = 10 * Math.log10(290);  // Noise temperature in dB
    const EbN0_dB = jsonData[document.getElementById('modulation-select').value][document.getElementById('ber-select').value];
    // const R_dB = 10 * Math.log10(parseFloat(document.getElementById("R").value) * 1000);  // Data rate in dB

    const Lp_dB = askInput(document.getElementById("Lp").value, document.getElementById("LpUnit").value);  // Path loss
    const f_dB = document.getElementById("f").value;  // Frequency
    const Gt_dB = askInput(document.getElementById("Gt").value, document.getElementById("GtUnit").value);  // Transmit antenna gain
    const Gr_dB = askInput(document.getElementById("Gr").value, document.getElementById("GrUnit").value);  // Receive antenna gain
    const Lf_dB = askInput(document.getElementById("Lf").value, document.getElementById("LfUnit").value);  // Antenna feed line loss
    const Lo_dB = askInput(document.getElementById("Lo").value, document.getElementById("LoUnit").value);  // Other losses
    const M_dB = askInput(document.getElementById("M").value, document.getElementById("MUnit").value);  // Fade margin
    const Ar_dB = askInput(document.getElementById("Ar").value, document.getElementById("ArUnit").value);  // Receiver amplifier gain
    const Nf_dB = askInput(document.getElementById("Nf").value, document.getElementById("NfUnit").value);  // Noise figure
    const link_margin_dB = askInput(document.getElementById("link_margin").value, document.getElementById("link_marginUnit").value);  // Link margin


    const R_Unit = document.getElementById("RUnit").value;

    let R_dB = parseFloat(document.getElementById("R").value);

    switch (R_Unit) {
        case 'Kbps':
            R_dB = R_dB * 1e3;
            break;
        case 'Mbps':
            R_dB = R_dB * 1e6;
            break;
        case 'Gbps':
            R_dB = R_dB * 1e9;
            break;
        default:
            R_dB = R_dB * 1e3; // Default to Kbps
    }

    R_dB = 10 * Math.log10(R_dB);

    const power_received = M_dB + k_dB + T_dB + Nf_dB + R_dB + EbN0_dB;  // Noise floor in dB

    const Pt_dB = power_received + Lp_dB - Gt_dB - Gr_dB + Lf_dB + Lo_dB - Ar_dB + link_margin_dB;


    // document.getElementById("result").innerHTML = "Transmit Power (Pt) = " + Pt_dB.toFixed(2) + " dB";


    let explanation = `
    <h2>Given Data:</h2>
    <ul>
        <li>Path Loss (\\( L_p \\)): <span class="highlight">${Lp_dB.toFixed(2)} dB</span></li>
        <li>Frequency (\\( f \\)): <span class="highlight">${f_dB} MHz</span></li>
        <li>Transmit Antenna Gain (\\( G_t \\)): <span class="highlight">${Gt_dB.toFixed(2)} dB</span></li>
        <li>Receive Antenna Gain (\\( G_r \\)): <span class="highlight">${Gr_dB.toFixed(2)} dB</span></li>
        <li>Data Rate (\\( R \\)): <span class="highlight">${R.toFixed(2)} ${R_Unit} | ${R_dB} dB</span></li>
        <li>Antenna Feed Line Loss (\\( L_f \\)): <span class="highlight">${Lf_dB.toFixed(2)} dB</span></li>
        <li>Other Losses (\\( L_o \\)): <span class="highlight">${Lo_dB.toFixed(2)} dB</span></li>
        <li>Fade Margin (\\( M \\)): <span class="highlight">${M_dB.toFixed(2)} dB</span></li>
        <li>Receiver Amplifier Gain (\\( A_r \\)): <span class="highlight">${Ar_dB.toFixed(2)} dB</span></li>
        <li>Noise Figure (\\( N_f \\)): <span class="highlight">${Nf_dB.toFixed(2)} dB</span></li>
        <li>Noise Temperature (\\( T \\)): <span class="highlight">${T_dB.toFixed(2)} K</span></li>
    </ul>

    <h2>Steps to Solve:</h2>
    <ol>
        <li><strong>Determine \\( \\frac{E_b}{N_0} \\):</strong>
            <div class="equation">
                For \\(${document.getElementById('modulation-select').value}\\) modulation with a BER of \\(${document.getElementById('ber-select').value} \\), the required \\( \\frac{E_b}{N_0} \\) is approximately \\(${EbN0_dB}\\) dB.
            </div>
        </li>
        

        
        <li><strong>Calculate Received Power \\( P_r \\):</strong>
            <div class="equation">
                \\[
                M = \\frac{P_r}{KTNR \\left( \\frac{E_b}{N_0} \\right)}
                \\]
            </div>
               <div class="equation">
                \\[
                P_{r, dB} = M_{dB} + K_{1, dB} + T_{dB} + N_{f, 1, dB} + R_{dB} +\\\left( \\frac{E_b}{N_0} \\right)_{dB}
                \\]
            </div>
              <div class="equation">
                \\( P_r \\, \\text{(dB)} = ${M_dB} + ${k_dB} + ${T_dB} + ${Nf_dB} + ${R_dB} + ${EbN0_dB} \\approx ${power_received} \\, \\text{dBW} \\)
                </div>
        </li>

        <li><strong>Calculate Total Transmit Power (\\( P_t \\)):</strong>
        
            <div class="equation">
                \\[
                P_r = \\frac{P_t G_t G_r A_t A_r}{L_p L_f L_o L_{f_{margin}}}
                \\]
            </div>
        
            <div class="equation">
                \\( P_t, \\text{(dB)} = P_r + L_p + L_f + L_o - G_t - G_r + M \\)<br>
               
               
                <br>Substituting the given values:<br>

                \\( P_t, \\text{(dB)} = ${power_received} + ${Lp_dB} + ${Gt_dB} + ${Gr_dB} - ${Lf_dB} - ${Lo_dB} + ${Ar_dB} +${link_margin_dB} = ${Pt_dB} \\, \\text{dBW} \\)<br>
               
               
                <br>Convert \\( P_t \\) from dBW to watts:<br>
                \\( P_t = 10^{${Pt_dB.toFixed(2)}/10} \\approx ${pt_wtt.toExponential(2)} \\, \\text{ Watts} \\)
            </div>
        </li>
    </ol>

    <h2>Conclusion:</h2>
    <p>Therefore, the total transmit power required for an ${document.getElementById('modulation-select').value} modulated signal with a maximum bit error rate of \\(${document.getElementById('ber-select').value}\\) in the given environment is approximately <strong>${Pt_dB} dB or  ${pt_wtt.toExponential(2)} Watts</strong>.</p>
`;


    document.getElementById('explain').innerHTML = explanation;
    MathJax.typeset();
}

// document.getElementById("explain").innerHTML = explanation;
// if (document.getElementById("explain").style.display === "none") {
//     document.getElementById("explain").style.display = "block";
// } else {
//     document.getElementById("explain").style.display = "none";
// }


// let explanation = `
//             <h2>Given Data:</h2>
//             <ul>
//                 <li>Path Loss (\\( L_p \\)): <span class="highlight">${Lp} dB</span></li>
//                 <li>Frequency (\\( f \\)): <span class="highlight">${f} MHz</span></li>
//                 <li>Transmit Antenna Gain (\\( G_t \\)): <span class="highlight">${Gt} dB</span></li>
//                 <li>Receive Antenna Gain (\\( G_r \\)): <span class="highlight">${Gr} dB</span></li>
//                 <li>Data Rate (\\( R \\)): <span class="highlight">${R} kbps</span></li>
//                 <li>Antenna Feed Line Loss (\\( L_f \\)): <span class="highlight">${Lf} dB</span></li>
//                 <li>Other Losses (\\( L_o \\)): <span class="highlight">${Lo} dB</span></li>
//                 <li>Fade Margin (\\( M \\)): <span class="highlight">${M} dB</span></li>
//                 <li>Receiver Amplifier Gain (\\( A_r \\)): <span class="highlight">${Ar} dB</span></li>
//                 <li>Noise Figure (\\( N_f \\)): <span class="highlight">${Nf} dB</span></li>
//                 <li>Noise Temperature (\\( T \\)): <span class="highlight">${T} K</span></li>
//             </ul>
//
//             <h2>Steps to Solve:</h2>
//             <ol>
//                 <li><strong>Determine \\( \\frac{E_b}{N_0} \\):</strong>
//                     <div class="equation">
//                         For {8-PSK} modulation with a BER of {\\(10^{-4}\\)}, the required \\( \\frac{E_b}{N_0} \\) is approximately ${EbN0_dB} dB.
//                     </div>
//                 </li>
//
//
//                 <li><strong>Convert \\( \\frac{E_b}{N_0} \\) to Linear Scale:</strong>
//                     <div class="equation">
//                         \\( ${EbN0_dB} \\text{ dB} = 10^{${EbN0_dB} /10} = ${EbN0_linear.toFixed(2)} \\)
//                     </div>
//                 </li>
//                 <li><strong>Calculate Noise Power \\( N_0 \\):</strong>
//                     <div class="equation">
//                         \\( N_0 = k \\times T = 1.38 \\times 10^{-23} \\times ${T} = ${(N0).toExponential(2)} \\, \\text{W/Hz} \\)
//                     </div>
//                 </li>
//                 <li><strong>Calculate Total Noise Power \\( N \\):</strong>
//                     <div class="equation">
//                         \\( N = N_0 \\times R = ${(N0).toExponential(2)} \\times ${R} \\times 10^3 = ${(N).toExponential(2)} \\, \\text{W} \\)<br>
//                         Convert to dB:<br>
//                         \\( N \\, \\text{(dB)} = 10 \\log_{10}(${N.toExponential(2)}) \\approx ${N_dB.toFixed(2)} \\, \\text{dBW} \\)
//                     </div>
//                 </li>
//
//
//                 <li><strong>Calculate Received Power \\( P_r \\):</strong>
//                     <div class="equation">
//                         \\( P_r \\, \\text{(dB)} = ${EbN0_dB} + ${linearToDb(N0).toFixed(2)} + ${linearToDb(R * 1e3).toFixed(2)} \\approx ${Pr_dB.toFixed(2)} \\, \\text{dBW} \\)
//                     </div>
//                 </li>
//                 <li><strong>Calculate Total Transmit Power (\\( P_t \\)):</strong>
//                     <div class="equation">
//                         \\( P_t = P_r + L_p + L_f + L_o - G_t - G_r + M \\)<br>
//                         Substituting the given values:<br>
//                         \\( P_t = ${Pr_dB.toFixed(2)} + ${Lp} + ${Lf} + ${Lo} - ${Gt} - ${Gr} + ${M} = ${Pt_dB.toFixed(2)} \\, \\text{dBW} \\)<br>
//                         Convert \\( P_t \\) from dBW to watts:<br>
//                         \\( P_t = 10^{${Pt_dB.toFixed(2)}/10} \\approx ${(Pt_watts).toExponential(2)} \\approx ${(Pt_watts).toFixed(2)} \\, \\text{Watts} \\)
//                     </div>
//                 </li>
//             </ol>
//
//             <h2>Conclusion:</h2>
//             <p>Therefore, the total transmit power required for an 8-PSK modulated signal with a maximum bit error rate of \\(10^{-4}\\) in the given environment is approximately <strong>${Pt_watts.toFixed(2)} Watts</strong>.</p>
// `;
