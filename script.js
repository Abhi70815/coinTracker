let table = document.querySelector(".table_body");
let data = [];

async function fetchData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
    data = await response.json();
    renderData(data);
  } catch (error) {
    console.error('There was a problem fetching the data:', error);
  }
}

function renderData(reqData) {
  table.innerHTML = '';
  reqData.forEach(items => {
    let price_change = parseFloat(items.price_change_24h).toFixed(2);
    let symbol = items.symbol.toUpperCase();
    let rowdata = document.createElement('tr');
rowdata.className="row";
    rowdata.innerHTML = `
      <td>
        <div class="coin-img">
          <img src="${items.image}" style="width:45px; height:45px"/>
          <div class="coin-name">${items.name}</div>
        </div>
      <td>${symbol}</td>
      <td>${items.current_price}</td>
      <td>${items.total_volume}</td>
      <td class="percentage_change">${price_change}%</td>
      <td>Mkr Cap: ${items.market_cap}</td>
    `;
    let dataCell = rowdata.querySelector('.percentage_change');
    if (price_change < 0) {
      dataCell.style.color = "red";
    } else {
      dataCell.style.color = "green"
    }

    table.appendChild(rowdata);
  })
}

function updateTable(searchTerm) {
  const filterData = data.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
  });
  renderData(filterData);
}

function marketCap() {
  let sortedData = data.sort((a, b) => {
    return b.market_cap - a.market_cap;
  })
  renderData(sortedData);
}

function percentage() {
  let sortedData = data.sort((a, b) => {
    return b.price_change_24h - a.price_change_24h
  })
  renderData(sortedData);
}

document.getElementById('search_bar').addEventListener('keyup', function(event) {
  const searchTerm = event.target.value;
  updateTable(searchTerm);
});

fetchData();