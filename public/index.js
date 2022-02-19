
//! added a proxy between the web-app requesting data and server providing it

//* CORS-anywhere
//* High latency

// const forecast_path_2 = "https://sleepy-inlet-64052.herokuapp.com/forecast"
// const forecast_proxy_path_2 = 'https://cors-anywhere.herokuapp.com/' + forecast_path_2
// const test = "https://gist.githubusercontent.com/shacheeswadia/e2fd68f19e5331f87d38473a45a11dbe/raw/396b3e14f2d7e05aa188e0a420a7b622ed4111bd/amzohlcweekly.csv"

//* Custom proxy
// custom_proxy_path = "http://localhost:8800/forecast"
// const github_path = "https://raw.githubusercontent.com/AlikMon88/CryptoNian/main/Extra/w9j2-ggv5.csv"

//! Last shot is creating a Proxy server

//Basic Toogling

//: proxied URL
const root_url = "https://blooming-stream-53056.herokuapp.com/forecast"
document.getElementById("Forecast").classList.add("waiting");
let clickCount = 0;

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
} 

function coinClicked(coin_name) {
    console.log(coin_name);
    clickCount += 1;
    console.log("Click Count: ", clickCount);    
    let url = root_url + "?coin=" + coin_name;
    console.log('New_URL: ',url);
    forcast_coin(url, coin_name);
    document.getElementById("Forecast").classList.remove("waiting");
    document.getElementById("Forecast").classList.add("forecasting");

}


//: hide previous charDiv when clckCount > 1


 

function forcast_coin (url, coin_name) {
    console.log("Forecast is activated");
    anychart.onDocumentReady(function() {
        anychart.data.loadCsvFile(url, function(data) {
            anychart.theme('darkProvence');
            //* we obtain text CSV -> Text
            console.log("Data: ", data.length)
            let pred_data = ''
            data.split('\n').slice(-10).forEach(function(row) {
                pred_data += row + '\n'
            });
            console.log('')
            
            past_data = data.slice(0, -(pred_data.length))
    
            let datatable_past = anychart.data.table();
            let datatable_pred = anychart.data.table();
            let datatable = anychart.data.table();
    
            //? Based on the column number
            // let mapping_past = datatable_past.mapAs({
            //     "open": 1,
            //     "high": 2,
            //     "low": 3,
            //     "close": 4,
            //     "volume": 6
            // });

            let mapping_past = datatable_past.mapAs({
                "close": 1
            });
            
            datatable_past.addData(past_data);
            datatable_pred.addData(pred_data);
            datatable.addData(data);
    
            let chart = anychart.stock();
            let plot = chart.plot(0);
            
            //plot the closing price
            plot.line(datatable_past.mapAs({value: 1})).name('Closing Price [Past]');
    
            // change the color of line plot
            plot.line(datatable_pred.mapAs({value: 1})).stroke('#15ed9e', 1, '1 1').name("Closing Price [Prediction]");
                
            plot
                .ema(datatable_past.mapAs({ value: 1}), { period: 50 })
                .series()
                .stroke('1 #f79400');
            
            var rangeSelector = anychart.ui.rangeSelector();
            
            //:  Volume on the Scroller
            // chart.scroller().area(datatable_past.mapAs({value: 6}))//.autoHide(true);
            chart.title(coin_name.toUpperCase() + ' - Chart');
            chart.container('chartDiv');
            chart.draw();
            rangeSelector.render(chart);
            
            // create new plot instance
            let plot_1 = chart.plot(1);
            plot_1.height('30%');
            let rsi14 = plot_1.rsi(mapping_past, 14).series();
            rsi14.stroke('1 #34d8eb');
            // change plot height
    
            });

    });

    //get all childs of chartDiv
    let childs = document.getElementById("chartDiv").childNodes;
    console.log("Childs: ", childs);
    //: when this function is called (that is current coin is clicked), all the previous charts are removed
    //: as only they are present as childs, this new one havent been added yet.
    for (let i = 0; i < childs.length; i++) {
        childs[i].style.display = "none";
    }

    // setTimeout(function(){
    //     document.getElementById("chartDiv").style.display = "none";
    // }, 2*1000);
}

    
// loader  timeOut function


   setTimeout(() => {
       const loader = document.getElementById("container");
       container.style.display = "none";
   }, 10000);
