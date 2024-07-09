//At first I am using this Provided Link to render data but it is given me error to upgrade plan sort of error so make data.json file to store data.
//Provided Link = https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false
//The Error is = {"status":{"error_code":429,"error_message":"You've exceeded the Rate Limit. Please visit https://www.coingecko.com/en/api/pricing to subscribe to our API plans for higher rate limits."}}.




//The variable which represent table body to push data in next step.
let table = document.querySelector(".table_body");

//This is the JS code to fetch data using async/await.
async function fetchDataWithAsyncAwait() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        let reqData = data;
        renderData(reqData);
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
}



//This is the function to render Data in front-end.
function renderData(reqData){
    reqData.forEach(items => {
        let price_change_24h = parseFloat(items.price_change_24h).toFixed(2);
        let symbolUpperCase = items.symbol.toUpperCase();

        // Create a new row element
        let tdDataRow = document.createElement('tr');

        // Add content to the row
        tdDataRow.innerHTML = `
            <td>
                <div class="coin-img">
                    <img src="${items.image}" alt="" style="width: 45px; height: 45px" />
                    <div class="coin-name">${items.name}</div>
                </div>
            </td>
            <td>${symbolUpperCase}</td>
            <td>${items.current_price}</td>
            <td>${items.total_volume}</td>
            <td class="percentage_change">${price_change_24h}%</td>
            <td>Mkr Cap: ${items.market_cap}</td>
        `;

        // Select the percentage_change cell within the row
        let tdDataCel = tdDataRow.querySelector('.percentage_change');

        // Set color based on price_change_24h
        if (price_change_24h < 0) {
            tdDataCel.style.color = 'red';
        } else {
            tdDataCel.style.color = 'green';
        }

        // Append the row to the table
        table.appendChild(tdDataRow);
    });
}



//This Function is use to filter and update table based on search input also here I have use .then method to render table data.
function updateTable(searchTerm) {
    fetch('data.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        // Filter the data based on the search input
        const filteredData = data.filter(item => {
            return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Clear the table body
        table.innerHTML = '';

        renderData(filteredData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



//Here I have added Event listener for search input
document.getElementById('search_bar').addEventListener('keyup', function(event) {
    const searchTerm = event.target.value;
    updateTable(searchTerm);
});



//This is the fuction to sort by Market Cap in Decending Order.
function MarketCap(){
    fetch('data.json')
    .then(response => {
        return response.json();
    }).then(data => {
        let sortedDataCap = data.sort((a,b) => {
            return b.market_cap - a.market_cap;
        })

        table.innerHTML = '';

        renderData(sortedDataCap);
    })
}



//This is the fuction to sort Percentage in Decending Order.
function Percentage(){
    fetch('data.json')
    .then(response => {
        return response.json();
    }).then(data => {
        let sortedDataPer = data.sort((a,b) => {
            //Hoisting is use here
            return b.price_change_24h - a.price_change_24h;
        })

        table.innerHTML = '';

        renderData(sortedDataPer);
    })
}




//Function Call Done Here.
fetchDataWithAsyncAwait();
renderData();