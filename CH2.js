var ResourceBlockBandwidth, SubCarrierBandwidth, NumberOfOFDMSymbols, ResourceBlockDuration, BitsModulation,ParallelBlocks;

function Is2Exponent(Number) {
    return (Number & (Number - 1)) === 0;
}

function IsDivisible(Number1, Number2) {
    return Number1 % Number2 === 0;
}

function MeasureUnit(unit) {
    var chosenUnit = document.getElementById(unit).value[0];
    return chosenUnit === 'K' ? 1e3 : chosenUnit === 'M' ? 1e6 : chosenUnit === 'G' ? 1e9 : 1;
}

function TimeMeasureUnit(){
    var chosenUnit = document.getElementById('TimeUnit').value[0];
    return chosenUnit === 'K' ? 1e3 : chosenUnit === 'm'? 1e-3 : chosenUnit === 'μ' ? 1e-6 : chosenUnit === 'n'? 1e-9 : 1;
}

function ErrorDisplay(isPositive, isModulation2Exponent, isSpacingDivisbleByBandwidth) {

    document.getElementById('BitsPerResourceBlockAnswer').innerText = '';
    document.getElementById('BitsPerOFDMAnswer').innerText = '';
    document.getElementById('BitsPerOFDMResourceBlockAnswer').innerText = '';
    document.getElementById('MaximumTransitionRate').innerText = '';

    var fullError = "";

    if (!isPositive)
        fullError += 'There Should be no Negative Values !';
    if (!isModulation2Exponent)
        fullError += '\nThe Modulation Bits Value Should be a 2 Exponent';
    if (!isSpacingDivisbleByBandwidth)
        fullError += '\nThe Bandwidth Should be Divisable by the Subcarrier Spacing';

    document.getElementById('ErrorDisplay').innerText = fullError;
}

function Init() {
    ResourceBlockBandwidth = parseFloat(document.getElementById('ResourceBlockBandwidth').value) * MeasureUnit('unit');
    SubCarrierBandwidth = parseFloat(document.getElementById('SubCarrierBandwidth').value) * MeasureUnit('unit1');
    NumberOfOFDMSymbols = parseFloat(document.getElementById('NumberOfOFDMSymbols').value);
    ResourceBlockDuration = parseFloat(document.getElementById('ResourceBlockDuration').value)*TimeMeasureUnit();
    BitsModulation = parseFloat(document.getElementById('BitsModulation').value);
    ParallelBlocks = parseFloat(document.getElementById('ParallelBlocks').value);

    const positiveInput = Boolean(ResourceBlockBandwidth >= 0 && SubCarrierBandwidth >= 0 &&
        NumberOfOFDMSymbols >= 0 && ResourceBlockDuration >= 0 && BitsModulation >= 0 && ParallelBlocks >= 0);
    const IsModulation2Exponent = Is2Exponent(BitsModulation);
    const IsSpacingDivisbleByBandwidth = IsDivisible(ResourceBlockBandwidth, SubCarrierBandwidth);

    if (!positiveInput || !IsModulation2Exponent || !IsSpacingDivisbleByBandwidth)
        ErrorDisplay(positiveInput, IsModulation2Exponent, IsSpacingDivisbleByBandwidth)
    else
        Calculate();
}

function BitsPerResourceElement() {
    return Math.log2(BitsModulation);
}

function BitsPerOFDMSymbol() {
    return BitsPerResourceElement() * (ResourceBlockBandwidth / SubCarrierBandwidth);
}

function BitsPerOFDMResourceBlock() {
    return BitsPerOFDMSymbol() * NumberOfOFDMSymbols;
}

function MaximumTransitionRate() {
    return ParallelBlocks * BitsPerOFDMResourceBlock() / ResourceBlockDuration;
}

function Calculate() {
    document.getElementById('ErrorDisplay').innerText = '';
    document.getElementById('BitsPerResourceBlockAnswer').innerText = "Bits Per Resource Block = " + BitsPerResourceElement();
    document.getElementById('BitsPerOFDMAnswer').innerText = "Bits Per OFDM Symbol = " + BitsPerOFDMSymbol();
    document.getElementById('BitsPerOFDMResourceBlockAnswer').innerText = "Bits Per OFDM Resource Block = " + BitsPerOFDMResourceBlock();
    document.getElementById('MaximumTransitionRate').innerText = "Maximum Transition Rate for " +ParallelBlocks+ " Parallel Resource Block(s) = " + MaximumTransitionRate();
}

function Explaination() {
    let explanation = `
     <h2>Given Data:</h2>
        <ul>
            <li>Resource Block Bandwidth \\( BW \\) : <span class="highlight">${document.getElementById('ResourceBlockBandwidth').value + document.getElementById('unit').value}</span></li>
            <li>Subcarrier Spacing : <span class="highlight">${document.getElementById('SubCarrierBandwidth').value + document.getElementById('unit1').value}</span></li>
            <li>Number of OFDM Symbols : <span class="highlight">${NumberOfOFDMSymbols}</span></li>
            <li>Duration for each Resource Block : <span class="highlight">${ResourceBlockDuration}</span></li>
            <li>Bits modulation technique : <span class="highlight">${BitsModulation + '-QAM'}</span></li>
        </ul>
        <h2>Steps to Solve:</h2>
        <ol>
            <li><strong>Determine the number of bits per resource element:</strong>
                <p>The used Modulation technique is the ${BitsModulation + '-QAM'} which is a 2-exponent thus, to calculate the number of bits the following equation will be used</p>
               <div class="equation">
                    \\({Bits} = \\log_{2} ({Modulation Technique Bits}) \\) <br><br>
                    \\({Bits} = \\log_{2} (${BitsModulation}) = ${BitsPerResourceElement()} bits\\) <br><br>
                </div>
            </li>

            <li><strong>Determine the number of bits per OFDM symbol :</strong>
                <p>At first, The number of subcarrier should be found per OFDM symbol. It can be calculated simply by dividing the Bandwidth of the OFDM symbol by the subcarrier spacing</p>
               <div class="equation">
                    \\({Subcarriers per OFDM symbol} = \\frac{Bandwidth of the OFDM symbol}{subcarrier spacing} \\) <br><br>
                    \\({Subcarriers per OFDM symbol} = \\frac{${document.getElementById('ResourceBlockBandwidth').value + document.getElementById('unit').value}}{${document.getElementById('SubCarrierBandwidth').value + document.getElementById('unit1').value}} = ${ResourceBlockBandwidth / SubCarrierBandwidth}\\) <br><br>
                </div>
                <p>After that, each OFDM symbol has ${BitsPerResourceElement()} bits and the OFDM symbol has ${ResourceBlockBandwidth / SubCarrierBandwidth} thus, the total number of bits in the symbol : </p>
                 <div class="equation">
                    \\({Bits per OFDM Symbol} = ${BitsPerResourceElement()} \\times ${ResourceBlockBandwidth / SubCarrierBandwidth} = ${BitsPerOFDMSymbol()} bits \\) <br><br>
                </div>
            </li>

            <li><strong>Determine the number of bits per OFDM resource block :</strong>
                <p>The number of bits in each OFDM symbol is ${BitsPerOFDMSymbol()} and each resource block have ${NumberOfOFDMSymbols} OFDM Symbols thus :</p>
               <div class="equation">
                    \\({ bits per OFDM resource block} = {Bits per OFDM symbol} \\times {Number of OFDM symbols in resource block} \\) <br><br>
                    \\({ bits per OFDM resource block} = ${BitsPerOFDMSymbol()} \\times ${NumberOfOFDMSymbols} = ${BitsPerOFDMResourceBlock()} bits\\) <br><br>
                </div>
            </li>

            <li><strong>If a user is assigned ${ParallelBlocks} parallel resource blocks continuously, calculate the maximum transmission rate for this user :</strong>
                <p>At first, the total number of bits for the whole system will be calculated where there is ${BitsPerOFDMResourceBlock()} bits in each resource block and there is ${ParallelBlocks} resource blocks thus :</p>
               <div class="equation">
                    \\({bits for the system} = ${BitsPerOFDMResourceBlock()} \\times ${ParallelBlocks} = ${BitsPerOFDMResourceBlock() * ParallelBlocks} bits \\) <br><br>
                </div>
                <p>After that, because the resoruce blocks are in parallel, the duration of the whole system will be equal to the duration of a single resource block. The Rate can be calculated as follows</p>
                 <div class="equation">
                    \\({Rate of the system} = \\frac{${BitsPerOFDMResourceBlock() * ParallelBlocks}}{${ResourceBlockDuration}}  = ${MaximumTransitionRate()} bits/sec\\) <br><br>
                </div>
            </li>
            
        </ol>
    `;
    document.getElementById('explain').innerHTML = explanation;
    MathJax.typeset();
}