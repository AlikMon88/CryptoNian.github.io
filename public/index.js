
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


// append iframe to main_child

divLoaded = (event) => {
    //: for better loading
    console.log("New_Coin_Selected")
    console.log("Div Loaded");
}

function coinClicked(coin_name) {
    clickCount += 1;
    console.log("coin_name: " + coin_name);
    console.log("Click Count: ", clickCount);    
    let url = root_url + "?coin=" + coin_name;
    console.log('New_URL: ',url);
    // make a promise for forecast coin
    let promise = new Promise(function(resolve, reject) {
        resolve(forcast_coin(url, coin_name));
    });
    promise.then(() => {
        document.getElementById("Forecast").classList.remove("waiting");
        document.getElementById("Forecast").classList.add("forecasting");
    })
    .then(() => {
        let main_child = document.getElementById("chartDiv").firstChild;
        // check if main_child is null or not
        if (main_child == null) {
                let h3 = document.getElementById("Forecast").querySelector("h3");
                //create img element
                let img = document.createElement("img");
                img.classList.add("loading");
                img.src = "public/images/crypto/loading.gif";
                h3.after(img)
            setTimeout(function(){
                console.log("Loading_Done!");
                img.style.display = 'none';
            }, 3600 * 1000);
        } else {
            let iframe = document.createElement("iframe");
            main_child.appendChild(iframe);
            iframe.onload = divLoaded;
        }
    })        

}



//: hide previous charDiv when clckCount > 1
 

function forcast_coin (url, coin_name) {
    console.log("Forecast is activated");
    anychart.onDocumentReady(function() {
        anychart.data.loadCsvFile(url, function(data) {
            console.log('Loading Done ...')
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

}

    

