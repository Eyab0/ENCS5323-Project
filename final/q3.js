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
        const Lp = document.getElementById("Lp").value;
        const f = document.getElementById("f").value;
        const Gt = document.getElementById("Gt").value;
        const Gr = document.getElementById("Gr").value;
        const R = document.getElementById("R").value;
        const Lf = document.getElementById("Lf").value;
        const Lo = document.getElementById("Lo").value;
        const M = document.getElementById("M").value;
        const Ar = document.getElementById("Ar").value;
        const Nf = document.getElementById("Nf").value;
        const T = 290; // Assuming standard noise temperature

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
                        For 8-PSK modulation with a BER of \\(10^{-4}\\), from standard tables or curves, the required \\( \\frac{E_b}{N_0} \\) is approximately 12 dB.
                    </div>
                </li>
                <li><strong>Convert \\( \\frac{E_b}{N_0} \\) to Linear Scale:</strong>
                    <div class="equation">
                        \\( 12 \\text{ dB} = 10^{12/10} = 15.85 \\)
                    </div>
                </li>
                <li><strong>Calculate Noise Power \\( N_0 \\):</strong>
                    <div class="equation">
                        \\( N_0 = k \\times T = 1.38 \\times 10^{-23} \\times ${T} = 4 \\times 10^{-21} \\, \\text{W/Hz} \\)
                    </div>
                </li>
                <li><strong>Calculate Total Noise Power \\( N \\):</strong>
                    <div class="equation">
                        \\( N = N_0 \\times R = 4 \\times 10^{-21} \\times ${R} \\times 10^3 = 3.84 \\times 10^{-17} \\, \\text{W} \\)<br>
                        Convert to dB:<br>
                        \\( N \\, \\text{(dB)} = 10 \\log_{10}(3.84 \\times 10^{-17}) \\approx -154.15 \\, \\text{dBW} \\)
                    </div>
                </li>
                <li><strong>Calculate Received Power \\( P_r \\):</strong>
                    <div class="equation">
                        Using:<br>
                        \\( \\frac{E_b}{N_0} = \\frac{P_r \\times M \\times A_B}{k \\times T \\times R} \\)<br>
                        Convert everything to dB and rearrange for \\( P_r \\):<br>
                        \\( P_r \\, \\text{(dB)} = 12 + (-228.6) + ${Ar} + ${Nf} + 3.98 + ${M} \\approx -138.15 \\, \\text{dBW} \\)
                    </div>
                </li>
                <li><strong>Calculate Total Transmit Power (\\( P_t \\)):</strong>
                    <div class="equation">
                        Using:<br>
                        \\( P_t = P_r + L_p + L_f + L_o - G_t - G_r + M \\)<br>
                        Substituting the given values:<br>
                        \\( P_t = -138.15 + ${Lp} + ${Lf} + ${Lo} - ${Gt} - ${Gr} + ${M} = 33.85 \\, \\text{dBW} \\)<br>
                        Convert \\( P_t \\) from dBW to watts:<br>
                        \\( P_t = 10^{33.85/10} \\approx 2.41 \\times 10^3 \\approx 2.4 \\, \\text{Watts} \\)
                    </div>
                </li>
            </ol>

            <h2>Conclusion:</h2>
            <p>Therefore, the total transmit power required for an 8-PSK modulated signal with a maximum bit error rate of \\(10^{-4}\\) in the given environment is approximately <strong>2.4 Watts</strong>.</p>
        
`;
        document.getElementById("explain").innerHTML = explanation;
        if (document.getElementById("explain").style.display === "none") {
            document.getElementById("explain").style.display = "block";
        } else {
            document.getElementById("explain").style.display = "none";
        }
    }