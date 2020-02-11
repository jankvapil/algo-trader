const SymbolChart = require("./SymbolChart");

///
/// Adjust initial chart Y axis range
///
exports.adjustChartScales = (price, chartSettings) => {
  chartSettings.options.scales.yAxes[0].ticks.min = price - price / 10000;
  chartSettings.options.scales.yAxes[0].ticks.max = price + price / 10000;
};

///
/// Update graph data & adjust chart axis ranges
///
exports.updateChart = (priceChart, n, chartSettings, price) => {
  // Extends time axis
  chartSettings.data.labels.push(n);

  // Inserts data to chart
  priceChart.data.datasets[0].data.push(price);

  // Shifts axis
  if (priceChart.data.datasets[0].data.length > MAX_CHART_X_VALUES) {
    priceChart.data.datasets[0].data.shift();
    priceChart.data.labels.shift();
  }

  // Once in a while adjust ranges..
  if (n % 4 == 0) SymbolChart.adjustChartScales(price, chartSettings);

  priceChart.update();
};

////////////////////////////////////////////////////////////////////////////

///
/// Parses JSON object, Sets trades data into HTML table
///
exports.displayOpenedTrades = openedTradesObj => {
  if (!openedTradesObj) return;

  // console.log(openedTradesObj);
  const keys = Object.keys(openedTradesObj);

  // Delete previous values
  let child;
  while ((child = tabOpenedTrades.firstChild)) {
    child.remove();
  }

  // Create table header
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.innerHTML = "Ticket";
  tr.appendChild(th1);
  const th2 = document.createElement("th");
  th2.innerHTML = "Symbol";
  tr.appendChild(th2);
  const th3 = document.createElement("th");
  th3.innerHTML = "Time";
  tr.appendChild(th3);
  const th4 = document.createElement("th");
  th4.innerHTML = "Open Price";
  tr.appendChild(th4);
  const th5 = document.createElement("th");
  th5.innerHTML = "Profit";
  tr.appendChild(th5);
  tabOpenedTrades.appendChild(tr);

  // Create table content
  for (const key of keys) {
    const values = openedTradesObj[key];
    const profitMinusCommission = values.pnl - 0.07;
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.innerHTML = key;
    tr.appendChild(td1);
    const td2 = document.createElement("td");
    td2.innerHTML = values.symbol;
    tr.appendChild(td2);
    const td3 = document.createElement("td");
    td3.innerHTML = values.opentime;
    tr.appendChild(td3);
    const td4 = document.createElement("td");
    td4.innerHTML = values.openprice;
    tr.appendChild(td4);
    const td5 = document.createElement("td");
    td5.innerHTML = profitMinusCommission.toFixed(2);
    tr.appendChild(td5);
    tabOpenedTrades.appendChild(tr);
  }
};

////////////////////////////////////////////////////////////////////////////

///
/// Creates Settings
///
exports.getSetting = () => {
  return {
    type: "line",
    data: {
      labels: [0],
      datasets: [
        {
          label: "Price",
          data: [],
          borderColor: "rgba(255, 0, 0, 0.8)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              max: 1,
              min: 0
            }
          }
        ]
      }
    }
  };
};
