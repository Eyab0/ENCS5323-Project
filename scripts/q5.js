var TimeSlotsPerCarrier, CityArea, Subscribers, H, Lambda, TrunkingSystem, QoS, SIR, D0, P0, PathLossExponent, ReceiverSensitivity;

function TimeUnitMeasure(param) {
    var DayToSeconds = 24 * 60 * 60;
    var HourToSeconds = 60 * 60;
    var MinuteToSeconds = 60;
    var dataUnit;
    if (param === 'H')
        dataUnit = document.getElementById('HUnit').value[0];
    else
        dataUnit = document.getElementById('LambdaUnit').value[0];

    return dataUnit === 'D' ? DayToSeconds : dataUnit === 'H' ? HourToSeconds : dataUnit === 'M' ? MinuteToSeconds : 1;

}

function Init() {
    TimeSlotsPerCarrier = parseFloat(document.getElementById('TimeSlotsPerCarrier').value);
    CityArea = parseFloat(document.getElementById('CityArea').value) * parseFloat(document.getElementById('AreaUnit').value[0] === 'K' ? 1e6 : 1);
    Subscribers = parseFloat(document.getElementById('Subscribers').value);
    H = parseFloat(document.getElementById('H').value) * TimeUnitMeasure('H');
    Lambda = parseFloat(document.getElementById('Lambda').value) / TimeUnitMeasure('Lambda');
    TrunkingSystem = parseFloat(document.getElementById('TrunkingSystem').value);
    QoS = parseFloat(document.getElementById('QoS').value);
    SIR = Math.pow(10, parseFloat(document.getElementById('SIR').value) / 10);
    D0 = parseFloat(document.getElementById('D0').value);
    P0 = Math.pow(10, parseFloat(document.getElementById('P0').value) / 10);
    PathLossExponent = parseFloat(document.getElementById('PathLossExponent').value);
    ReceiverSensitivityUnit = document.getElementById('ReceiverSensitivityUnit').value[0];
    ReceiverSensitivity = parseFloat(document.getElementById('ReceiverSensitivity').value) * (ReceiverSensitivityUnit === 'm' ? 1e-3 : ReceiverSensitivityUnit === 'μ' ? 1e-6 : ReceiverSensitivityUnit === 'n' ? 1e-9 : 1);


    Calculate();
}

function MaximumDistance() {
    return parseFloat(D0 / Math.pow(ReceiverSensitivity / P0, 1/PathLossExponent));
}

function MaximumCellSize(){
    return (3*Math.sqrt(3)/2)*MaximumDistance()*MaximumDistance();
}

function NumberOfCellsServiceArea(){
    return Math.ceil(CityArea / MaximumCellSize());
}

function TrafficLoadSystem(){
    return Subscribers * H * Lambda;
}

function TrafficLoadCell(){
    return TrafficLoadSystem() / NumberOfCellsServiceArea();
}

function isClusterNumber(N) {
    for (let i = 0; i * i <= N; i++) {
        for (let j = 0; j <= i; j++) {
            if (N === i * i + i * j + j * j) {
                return true;
            }
        }
    }
    return false;
}

function findClusterNumber(N) {
    let smallestN = N;

    if (!isClusterNumber(Math.floor(smallestN)))
        smallestN = Math.floor(smallestN);
    else
        smallestN = Math.ceil(smallestN);

    while (1) {
        if (isClusterNumber(smallestN)) {
            return smallestN;
        }
        smallestN++;
    }
}


function NumberOfCellsInEachCluster(){
    return findClusterNumber(Math.pow(SIR*6, parseFloat(2/PathLossExponent))/3);
}

function factorial(n) {
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

function erlangB(E, C) {
    let numerator = Math.pow(E, C) / factorial(C);
    let denominator = 0;
    for (let k = 0; k <= C; k++) {
        denominator += Math.pow(E, k) / factorial(k);
    }
    return numerator / denominator;
}

function erlangC(E, C) {
    if (E >= C) {
        return 1; // If traffic load is greater than or equal to the number of channels, all calls will be queued
    }
    let sum = 0;
    for (let k = 0; k < C; k++) {
        sum += Math.pow(E, k) / factorial(k);
    }
    let numerator = Math.pow(E, C) / factorial(C) * (C / (C - E));
    let denominator = sum + numerator;
    return numerator / denominator;
}

function findChannels(E, QoS) {
    let C = 1;
    while (true) {
        if (erlangB(E, C) <= QoS) {
            return C;
        }
        C++;
    }
}

function Calculate() {
    document.getElementById('MaximumDistanceAnswer').innerText = "Maximum distance between transmitter and receiver for reliable communication = " + MaximumDistance() + " m";
    document.getElementById('MaximumCellSize').innerHTML = "Maximum cell size assuming hexagonal cells = " + MaximumCellSize() + " m&sup2";
    document.getElementById('NumberOfCells').innerHTML = "The number of cells in the service area = " + NumberOfCellsServiceArea();
    document.getElementById('TrafficLoadSystem').innerHTML = "Traffic load in the whole cellular system in Erlangs = " + TrafficLoadSystem() + " Erlang";
    document.getElementById('TrafficLoadCell').innerHTML = "Traffic load in each cell in Erlangs = " + TrafficLoadCell() + " Erlang";
    document.getElementById('NumberOfCellsInEachCluster').innerHTML = "Number of cells in each cluster = " + NumberOfCellsInEachCluster();
    document.getElementById('MinNumberOfCarriers').innerHTML = "Number of cells in each cluster = " + (Math.ceil(findChannels(TrafficLoadCell(),QoS)/TimeSlotsPerCarrier))*NumberOfCellsInEachCluster();
    document.getElementById('MinNumberOfCarriersNewQoS').innerHTML = "Number of cells in each cluster = " + (Math.ceil(findChannels(TrafficLoadCell(),0.05)/TimeSlotsPerCarrier))*NumberOfCellsInEachCluster();

}

function Explaination(){
    let explanation = `
    <h2>Given Data:</h2>
    <ul>
        <li>Time Slote per Carrier : <span class="highlight">${TimeSlotsPerCarrier}</span></li>
        <li>The Area of the City : <span class="highlight">${document.getElementById('TimeSlotsPerCarrier').value + document.getElementById('AreaUnit').value}</span></li>
        <li>Subscribers that the mobile network provider is interested to provide service : <span class="highlight">${Subscribers + " Users"}</span></li>
        <li>Average Number of calls for Each User : <span class="highlight">${document.getElementById('Lambda').value + document.getElementById('LambdaUnit').value}</span></li>
        <li>Average Call Duration : <span class="highlight">${document.getElementById('H').value + document.getElementById('HUnit').value}</span></li>
        <li>Quality of Service (QoS) : <span class="highlight">${QoS}</span></li>
        <li>SIR : <span class="highlight">${document.getElementById('SIR').value + " dB"}</span></li>
        <li>Reference Distance from Base Stations : <span class="highlight">${D0}</span></li>
        <li>Meaured Power at the Reference Distance : <span class="highlight">${document.getElementById('P0').value + " dB"}</span></li>
        <li>Path Loss Exponent : <span class="highlight">${PathLossExponent}</span></li>
        <li>Reciever Sensitivity : <span class="highlight">${document.getElementById('ReceiverSensitivity').value + document.getElementById('ReceiverSensitivityUnit').value}</span></li>

    </ul>
    <h2>Steps to Solve:</h2>
    <ol>
        <li><strong>Calculate the Maximum distance between transmitter and receiver for reliable communication :</strong>
            <p>The Power Sensitivity is given using the equation \\( P_r = P_0 \\times \\left(\\frac{d_0}{d} \\right)^n\\) thus, the distance (d) can be calculated as follows</p>
            <div class="equation">
                \\( d = \\frac{d_0}{\\left(\\frac{P_r}{P_0} \\right)^ \\frac{1}{n}}\\) 
                <br><br>
                \\( d = \\frac{${D0}}{\\left(\\frac{${document.getElementById('ReceiverSensitivity').value + document.getElementById('ReceiverSensitivityUnit').value[0]}}{${document.getElementById('P0').value + " dB"}} \\right)^\\frac{1}{${PathLossExponent}}}\\) = ${MaximumDistance()} meters<br><br>
            </div>
        </li>

        <li><strong>Maximum cell size assuming hexagonal cells :</strong>
            <p>The cell size can be calculated using the following equation : </p>
            <div class="equation">
                \\( Cell Size = \\frac{3 \\times \\sqrt{3}}{2} \\times R^2 \\) <br><br>
                <p>The R is the Maximum distance between transmitter and receiver which is ${MaximumDistance()} thus :</p>
                \\( Cell Size = \\frac{3 \\times \\sqrt{3}}{2} \\times ${MaximumDistance()}^2 = ${MaximumCellSize()} meters \\) <br><br>
            </div>
        </li>

        <li><strong>The number of cells in the service area :</strong>
            <div class="equation">
                \\( Number of Cells =\\frac{Total Area}{Cell Size}\\) <br><br>
                \\( Number of Cells =\\frac{${document.getElementById('CityArea').value + document.getElementById('AreaUnit').value}}{${MaximumCellSize()}} = ${NumberOfCellsServiceArea()} Cells\\) <br><br>
            </div>
        </li>

        <li><strong>Traffic load in the whole cellular system in Erlangs :</strong>
            <p>For each user, the traffic can be calucltaed by muliplying the average calls for each user (λ) by the average calls duration (H). In the while system there is ${Subscribers} users thus :</p>
            <div class="equation">
                \\( System Traffic Load = λ \\times H \\times TotalUsers\\) <br><br>
                \\( System Traffic Load = ${Lambda} \\times ${H} \\times ${Subscribers} = ${TrafficLoadSystem()} Erlangs\\) <br><br>
            </div>
        </li>

        <li><strong>Traffic load in each cell in Erlangs :</strong>
            <div class="equation">
                \\( Cell Traffic Load = \\frac{System Traffic Load}{Number of Cells}\\) <br><br>
                \\( Cell Traffic Load = \\frac{${TrafficLoadSystem()}}{${NumberOfCellsServiceArea()}} = ${TrafficLoadCell()} Erlangs\\) <br><br>
            </div>
        </li>

         <li><strong>Number of cells in each cluster :</strong>
            <div class="equation">
                <p>The SIR is given by the equation \\(SIR = \\frac{\\left(\\sqrt{3N} \\right)^n}{6}\\) and from this equation the number of cells in each cluster (N) can be found as follows :</p>
                \\( N = \\frac{\\left(6 \\times SIR \\right)^\\frac{2}{n}}{3} \\) <br><br>
                \\( N = \\frac{\\left(6 \\times ${SIR + " dB"} \\right)^\\frac{2}{${PathLossExponent}}}{3} = ${NumberOfCellsInEachCluster()}\\) <br><br>
                <p>Note that the initial result could not be correct becasue it does not achieve the equation \\(N = i^2 + i \\times j + j^2\\) thus, you should search for the smallest value for N that is larger that the initial output and meet the equation</p>
            </div>
        </li>

        <li><strong>Minimum number of carriers needed (in the whole system) to achieve the required Quality of Service :</strong>
            <p>Because the system is using Erlang B, and we have the traffic load = ${TrafficLoadCell()} and the Quality of Servic (QoS) = ${QoS}, the number of channels can be found from the table. After that : </p>
            <div class="equation">
                \\( Minimum Number of Carriers = Ceil \\left(\\frac{Number of Channels}{Timeslots per Carrier} \\right) \\times Cluster Size (N) \\) <br><br>
                \\( Minimum Number of Carriers = Ceil \\left (\\frac{${findChannels(TrafficLoadCell(),QoS)}}{${TimeSlotsPerCarrier}} \\right) \\times ${NumberOfCellsInEachCluster()} =  ${(Math.ceil(findChannels(TrafficLoadCell(),0.06)/TimeSlotsPerCarrier))*NumberOfCellsInEachCluster()}\\) <br><br>
            </div>
        </li>

         <li><strong>Minimum number of carriers needed (in the whole system) to achieve the required Quality of Service if QoS has changed to 0.05 :</strong>
            <p>The same solution as the previos part but with a QoS of 0.05 : </p>
            <div class="equation">
                \\( Minimum Number of Carriers = Ceil \\left (\\frac{${findChannels(TrafficLoadCell(),0.05)}}{${TimeSlotsPerCarrier}} \\right) \\times ${NumberOfCellsInEachCluster()} =  ${(Math.ceil(findChannels(TrafficLoadCell(),0.06)/TimeSlotsPerCarrier))*NumberOfCellsInEachCluster()}\\) <br><br>
            </div>
        </li>
        
    </ol>
`;

document.getElementById('explain').innerHTML = explanation;
MathJax.typeset();
}