
var bandwidth, quantizerBits, sourceEncoderCompressionRate, channelEncoderRate, interleaverBits;

function Is2Exponent(Number) {
    return (Number & (Number - 1)) === 0;
}

function ErrorDisplay(validInput, IsInterleaver2Exponent) {
    var fullError = ""
    document.getElementById('SamplingRateAnswer').innerText = '';
    document.getElementById('QuantizationLevelAnswer').innerText = '';
    document.getElementById('BitRateSourceEncoder').innerText = '';
    document.getElementById('BitRateChannelEncoder').innerText = '';
    document.getElementById('BitRateInterleaver').innerText = '';

    if (!IsInterleaver2Exponent)
        fullError += 'The Interleaver Value Should be a 2 Exponent';
    if (!validInput)
        fullError += '\nThere Should be no Negative Values !';

    document.getElementById('ErrorDisplay').innerText = fullError;
}

function MeasureUnit() {
    var chosenUnit = document.getElementById('unit').value;
    return chosenUnit[0] === 'K' ? 1e3 : chosenUnit[0] === 'M' ? 1e6 : chosenUnit[0] === 'G' ? 1e9 : 1;
}

function Init() {
    bandwidth = parseFloat(document.getElementById('Bandwidth').value) * MeasureUnit();
    quantizerBits = parseFloat(document.getElementById('Quantizer').value);
    sourceEncoderCompressionRate = parseFloat(document.getElementById('SoureEncoderCompressionRate').value);
    channelEncoderRate = parseFloat(document.getElementById('ChannelEncoderRate').value);
    interleaverBits = parseFloat(document.getElementById('InterleaverBits').value);
    const positiveInput = Boolean(bandwidth >= 0 && quantizerBits >= 0 && sourceEncoderCompressionRate >= 0 && channelEncoderRate >= 0 && interleaverBits >= 0);
    const IsInterleaver2Exponent = Is2Exponent(interleaverBits);

    if (!positiveInput || !IsInterleaver2Exponent)
        ErrorDisplay(positiveInput, IsInterleaver2Exponent)
    else
        Calculate();
}

function SamplingRate() {
    return bandwidth * 2;
}

function QuantizationLevels() {
    return (1 << quantizerBits);
}

function SourceEncoderOutputBitRate() {
    return SamplingRate() * quantizerBits * sourceEncoderCompressionRate;
}

function ChannelEncoderOutputBitRate() {
    return SourceEncoderOutputBitRate() / channelEncoderRate;
}

function Calculate() {
    document.getElementById('ErrorDisplay').innerText = '';
    document.getElementById('SamplingRateAnswer').innerText = "The sampling Rate is = " + SamplingRate();
    document.getElementById('QuantizationLevelAnswer').innerText = "The Quantization Levels = " + QuantizationLevels();
    document.getElementById('BitRateSourceEncoder').innerText = "The Bit Rate at the Output of the Source Encoder = " + SourceEncoderOutputBitRate();
    document.getElementById('BitRateChannelEncoder').innerText = "The bit Rate at the Output of the Channel Encoder = " + ChannelEncoderOutputBitRate();
    document.getElementById('BitRateInterleaver').innerText = "The Bit Rate at the Output of the Interleaver = " + ChannelEncoderOutputBitRate(); //because it only makes a delay

}

function Explaination() {
    let explanation = `
        <h2>Given Data:</h2>
        <ul>
            <li>Bandwidth (\\( BW \\)) : <span class="highlight">${document.getElementById('Bandwidth').value + document.getElementById('unit').value}</span></li>
            <li>Quantizer Bits : <span class="highlight">${quantizerBits}</span></li>
            <li>Source Encoder Compression Rate (\\(R_S\\)) : <span class="highlight">${sourceEncoderCompressionRate}</span></li>
            <li>Channel Encoder Rate : <span class="highlight">${channelEncoderRate}</span></li>
            <li>Interleaver Bits : <span class="highlight">${interleaverBits}</span></li>
        </ul>
        <h2>Steps to Solve:</h2>
        <ol>
            <li><strong>Calculate the Sampling Rate (\\( f_S \\)):</strong>
                <p>Because Nyquist Rate is being used, the Bandwidth is muliplied by 2 Refer to <a href="https://en.wikipedia.org/wiki/Nyquist_rate">Link</a></p>
                <div class="equation">
                    \\( f_S = Bandwidth \\times 2\\) <br><br>
                    \\( f_S =  ${document.getElementById('Bandwidth').value + document.getElementById('unit').value} \\times 2 = ${(document.getElementById('Bandwidth').value*2) + document.getElementById('unit').value}\\)<br><br>
                </div>
            </li>
            <li><strong>Calculate the Quantization Levels (L):</strong>
                <p>The Quantization Levels is the \\(2^{Quantizer Bits}\\) bits Refere to <a href="https://en.wikipedia.org/wiki/Quantization_(signal_processing)">Link</a></p>
                <div class="equation">
                    L = \\(2^${quantizerBits}\\) = ${QuantizationLevels()}
                </div>
            </li>
            <li><strong>Calculate the Bit Rate at the Output of the Source Encoder:</strong>
                <p>At first, the bit rate of the input of the source encoder should be calculated as follows : </p>
                <div class="equation">
                    \\( Source Encoder Input Bit Rate = Smapling Rate \\times Quantizer Bits \\)<br><br>
                    \\( Source Encoder Input Bit Rate = ${(document.getElementById('Bandwidth').value*2) + document.getElementById('unit').value[0]} \\frac{Samples}{Sec} \\times ${quantizerBits} \\frac{Bits}{Samples} = ${SamplingRate() * quantizerBits}bits/sec \\)<br>
                </div>
                <p>After that, The Source Encoder input bit rate will be multiplied by the Compression Rate of the source encoder</p>
                <div class="equation">
                    \\( Source Encoder Output Bit Rate = Source Encoder Input Bit Rate \\times Quantizer Bits \\)<br><br>
                    \\( Source Encoder Output Bit Rate =  ${SamplingRate() * quantizerBits + document.getElementById('unit').value[0]} \\times ${sourceEncoderCompressionRate} = ${SourceEncoderOutputBitRate()}bits/sec\\)<br>
                </div>
            </li>
            <li><strong>Calculate the Bit Rate at the Output of the Channel Encoder :</strong>
                <p>It can be calculated simply by dividing the output of the source encoder by the Channle Encoding Rate.</p>
                <div class="equation">
                    \\( Channel Encoder Output Rate = \\frac{Source Encoder Output Bit Rate}{Channle Encoder Rate} \\)<br><br>
                    \\( Channel Encoder Output Rate = \\frac{${SourceEncoderOutputBitRate()}}{${channelEncoderRate}} = ${ChannelEncoderOutputBitRate()}bits/sec\\)
                </div>
            </li>
            <li><strong>Calculate the bit rate at the output of the interleaver:</strong>
                <div class="equation">
                   <p>The interleaver only delays thus, the output will remain the same as the output of the Channel Encoding = <strong>${ChannelEncoderOutputBitRate()}bits/sec</strong></p>
                </div>
            </li>
        </ol>
    `;

    document.getElementById('explain').innerHTML = explanation;
    MathJax.typeset();
}


function Explaination2() {
    let explanation = `
<h2>Given Data:</h2>
            <ul>
                <li>Bandwidth (\\( BW \\)): <span class="highlight">20 Mbps</span></li>
                <li>Maximum signal propagation time (\\( \\tau \\)): <span class="highlight">40 µsec</span></li>
                <li>Frame size (\\( F_{\\text{size}} \\)): <span class="highlight">10 Kbits</span></li>
                <li>Frame rate (\\( g \\)): <span class="highlight">5 Kfps</span></li>
            </ul>
            
            <h2>Steps to Solve:</h2>
            <ol>
                <li><strong>Calculate the transmission time per bit (\\( T_b \\)):</strong>
                    <div class="equation">
                        \\( T_b = \\frac{1}{F} = \\frac{1}{20M} \\)<br><br>
                        \\( T_b = \\frac{1}{20 \\times 10^6} = 0.05 \\times 10^{-6} \\text{ seconds} = 0.05 \\mu\\text{s} \\)<br>
                    </div>
                </li>
                <li><strong>Calculate the frame transmission time (\\( T_{\\text{frame}} \\)):</strong>
                    <div class="equation">
                        \\( T_{\\text{frame}} = \\text{Frame Size} \\times T_b \\)<br><br>
                        \\( T_{\\text{frame}} = 10K \\times \\frac{1}{20M} \\)<br><br>
                        \\( T_{\\text{frame}} = 10 \\times 10^3 \\times 0.05 \\times 10^{-6} = 0.5 \\times 10^{-3} \\text{ seconds} = 0.5 \\text{ msec} \\)<br>
                    </div>
                </li>
                <li><strong>Calculate the normalized load (\\( G \\)):</strong>
                    <div class="equation">
                        \\( G = g \\times T_{\\text{frame}} \\)<br><br>
                        \\( G = 5K \\times 0.5 \\times 10^{-3} = 2.5 \\)<br>
                    </div>
                </li>
                <li><strong>Determine the parameter \\( \\alpha \\):</strong>
                    <div class="equation">
                        \\( \\alpha = \\frac{\\tau}{T_{\\text{frame}}} \\)<br><br>
                        \\( \\alpha = \\frac{40 \\times 10^{-6}}{0.5 \\times 10^{-3}} = 0.08 \\)
                    </div>
                </li>
                <li><strong>Calculate the throughput (\\( S_{\\text{th}} \\)):</strong>
                    <div class="equation">
                        \\( S_{\\text{th}} = \\frac{G e^{-2\\alpha G}}{G(1+2\\alpha) + e^{-\\alpha G}} \\)<br><br>
                        Plugging in the values:<br> <br>
                        \\( S_{\\text{th}} = \\frac{2.5 e^{-2 \\times 0.08 \\times 2.5}}{2.5 (1 + 2 \\times 0.08) + e^{-0.08 \\times 2.5}} \\)<br>
                        Simplifying:<br><br>
                        \\( S_{\\text{th}} = \\frac{2.5 e^{-0.4}}{2.5 (1 + 0.16) + e^{-0.2}} \\)<br><br>
                        \\( S_{\\text{th}} = \\frac{2.5 \\times 0.67032}{2.5 \\times 1.16 + 0.81873} \\)<br><br>
                        \\( S_{\\text{th}} = \\frac{1.6758}{2.9 + 0.81873} = \\frac{1.6758}{3.71873} \\approx 0.4505 \\)
                    </div>
                </li>
                <li><strong>Convert the throughput to a percentage:</strong>
                    <div class="equation">
                        \\( \\text{Throughput in percent} = 0.4505 \\times 100 \\approx 45.05\\% \\)
                    </div>
                </li>
            </ol>
            
            <h2>Result:</h2>
            <p>Therefore, the throughput of the network, given the conditions provided, is approximately <strong>45.05%</strong>.</p>
   
            `;

    document.getElementById('explain').innerHTML = explanation;
    MathJax.typeset();
}
