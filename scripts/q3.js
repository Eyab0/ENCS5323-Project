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
    const EbN0_dB = parseFloat(document.getElementById("EbN0_dB").value);  // Required Eb/N0 in dB for 8-PSK at BER 10^-4
    const R_dB = 10 * Math.log10(parseFloat(document.getElementById("R").value));  // Data rate in dB

    const Lp_dB = askInput(document.getElementById("Lp").value, document.getElementById("LpUnit").value);  // Path loss
    const Gt_dB = askInput(document.getElementById("Gt").value, document.getElementById("GtUnit").value);  // Transmit antenna gain
    const Gr_dB = askInput(document.getElementById("Gr").value, document.getElementById("GrUnit").value);  // Receive antenna gain
    const Lf_dB = askInput(document.getElementById("Lf").value, document.getElementById("LfUnit").value);  // Antenna feed line loss
    const Lo_dB = askInput(document.getElementById("Lo").value, document.getElementById("LoUnit").value);  // Other losses
    const M_dB = askInput(document.getElementById("M").value, document.getElementById("MUnit").value);  // Fade margin
    const Ar_dB = askInput(document.getElementById("Ar").value, document.getElementById("ArUnit").value);  // Receiver amplifier gain
    const Nf_dB = askInput(document.getElementById("Nf").value, document.getElementById("NfUnit").value);  // Noise figure
    const link_margin_dB = askInput(document.getElementById("link_margin").value, document.getElementById("link_marginUnit").value);  // Link margin

    const power_received = k_dB + T_dB + EbN0_dB + R_dB;  // Noise floor in dB

    const Pt_dB = power_received + Lp_dB - Gt_dB - Gr_dB + Lf_dB + Lo_dB + M_dB - Ar_dB + Nf_dB + link_margin_dB;

    const Pt = wattsToDbm(dbToLinear(Pt_dB));

    document.getElementById("result").innerHTML = "Transmit Power (Pt) = " + Pt.toFixed(2) + " dBm";
}

function Explanation() {
    const Lp = parseFloat(document.getElementById("Lp").value);
    const f = parseFloat(document.getElementById("f").value);
    const Gt = parseFloat(document.getElementById("Gt").value);
    const Gr = parseFloat(document.getElementById("Gr").value);
    const R = parseFloat(document.getElementById("R").value);
    const Lf = parseFloat(document.getElementById("Lf").value);
    const Lo = parseFloat(document.getElementById("Lo").value);
    const M = parseFloat(document.getElementById("M").value);
    const Ar = parseFloat(document.getElementById("Ar").value);
    const Nf = parseFloat(document.getElementById("Nf").value);
    const T = 290; // Assuming standard noise temperature
    const EbN0_dB = parseFloat(document.getElementById("EbN0_dB").value);

    const k = 1.38 * Math.pow(10, -23);
    // const EbN0_dB = 12; // Given as fixed value for BER of 10^-4

    const K1_dB = 228.6; // Boltzmann constant in dB (approximated value)
    const T_dB = 10 * Math.log10(T); // Noise temperature in dB
    const Nf1_dB = Nf; // Noise figure in dB (assuming Nf is already in dB)


    // Convert Eb/N0 to linear scale
    const EbN0_linear = dbToLinear(EbN0_dB);

    // Calculate noise power spectral density N0
    const N0 = k * T;

    // Calculate total noise power N
    const N = N0 * R * 1e3; // R in kbps, converting to bps
    const N_dB = linearToDb(N);


    // Calculate received power Pr
    const Pr_dB = M + K1_dB + T_dB + Nf1_dB + EbN0_dB + linearToDb(N0) + linearToDb(R * 1e3);

    // Calculate total transmit power Pt
    const Pt_dB = Pr_dB + Lp + Lf + Lo - Gt - Gr + M;
    const Pt_watts = dbToLinear(Pt_dB);


    let explanation = `
    <h2>Given Data:</h2>
    <ul>
        <li>Path Loss (\\( L_p \\)): <span class="highlight">${Lp} dB</span></li>
        <li>Frequency (\\( f \\)): <span class="highlight">${f} MHz</span></li>
        <li>Transmit Antenna Gain (\\( G_t \\)): <span class="highlight">${Gt} dB</span></li>
        <li>Receive Antenna Gain (\\( G_r \\)): <span class="highlight">${Gr} dB</span></li>
        <li>Data Rate (\\( R \\)): <span class="highlight">${R} kbps</span></li>
        <li>Antenna Feed Line Loss (\\( L_f \\)): <span class="highlight">${Lf} dB</span></li>
        <li>Other Losses (\\( L_o \\)): <span class="highlight">${Lo} dB</span></li>
        <li>Fade Margin (\\( M \\)): <span class="highlight">${M} dB</span></li>
        <li>Receiver Amplifier Gain (\\( A_r \\)): <span class="highlight">${Ar} dB</span></li>
        <li>Noise Figure (\\( N_f \\)): <span class="highlight">${Nf} dB</span></li>
        <li>Noise Temperature (\\( T \\)): <span class="highlight">${T} K</span></li>
    </ul>

    <h2>Steps to Solve:</h2>
    <ol>
        <li><strong>Determine \\( \\frac{E_b}{N_0} \\):</strong>
            <div class="equation">
                For {8-PSK} modulation with a BER of {\\(10^{-4}\\)}, the required \\( \\frac{E_b}{N_0} \\) is approximately ${EbN0_dB} dB.
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
                \\( P_r \\, \\text{(dB)} = ${M} + ${K1_dB} + ${T_dB} + ${Nf1_dB} + ${linearToDb(R * 1e3).toFixed(2)} + ${EbN0_dB} \\approx ${Pr_dB.toFixed(2)} \\, \\text{dBW} \\)
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
                \\( P_t, \\text{(dB)} = ${Pr_dB.toFixed(2)} + ${Lp} + ${Lf} + ${Lo} - ${Gt} - ${Gr} + ${M} = ${Pt_dB.toFixed(2)} \\, \\text{dBW} \\)<br>
                <br>Convert \\( P_t \\) from dBW to watts:<br>
                \\( P_t = 10^{${Pt_dB.toFixed(2)}/10} \\approx ${(Pt_watts).toExponential(2)} \\approx ${(Pt_watts).toFixed(2)} \\, \\text{Watts} \\)
            </div>
        </li>
    </ol>

    <h2>Conclusion:</h2>
    <p>Therefore, the total transmit power required for an 8-PSK modulated signal with a maximum bit error rate of \\(10^{-4}\\) in the given environment is approximately <strong>${Pt_watts.toFixed(2)} Watts</strong>.</p>
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