// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import NATS from 'nats';
import { LineChart } from 'react-easy-chart';
// available currencies

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedCurrency: "AUD/USD",
      bidTime: [],
      bidAsk: null,
      yTop: null,
      yBottom: null,
      lastDate: null
    }
  }

  componentDidMount(){
    // Configure API NATS Servers
    const SERVERS = [
        'nats://nats1.polygon.io:30401',
        'nats://nats2.polygon.io:30402',
        'nats://nats3.polygon.io:30403'
    ];

    // Connect to NATS cluster
    const nats = NATS.connect({
        servers: SERVERS,
        token: API_TOKEN
    });

    // Subscribe to FOREX  (C.*) Data
    nats.subscribe('C.*', (msg, reply, subject) => {
        let forex = JSON.parse( msg )
        console.log(forex.t);
        console.log(forex.p + ": " + "ask: " + forex.a + " bid: " + forex.b);
        let stateFOREX = ('FOREX:' + JSON.stringify( forex, null, 4 ));

        if(forex.p === this.state.selectedCurrency){
          let date = new Date(forex.t);
          // Hours from timestamp
          var hours = date.getHours();
          // Minutes from timestamp
          var minutes = "0" + date.getMinutes();
          // Seconds from timestamp
          var seconds = "0" + date.getSeconds();
          var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

          let bidTimeArray = this.state.bidTime;
          bidTimeArray.push({x: formattedTime, y: forex.b});

          // getting min and max
          let bids = [];
            bidTimeArray.map(item => bids.push(item.y));
            Array.min = function( arr ){
              return Math.min.apply( Math, arr );
            };

            Array.max = function( arr ){
              return Math.max.apply( Math, arr);
            };
            //percentage difference
            var percDif = 0.00008;

            var minimum = Array.min(bids),
                maximum = Array.max(bids);

            var tenPercMin = minimum * percDif;
            var yBottom = minimum - tenPercMin;
            var tenPercMax = maximum * percDif;
            var yTop = maximum + tenPercMax;

          let bidAsk = [forex.b, forex.a];
          // setting state
          this.setState({
            bidAsk: bidAsk,
            bidTime: bidTimeArray,
            yBottom: yBottom,
            yTop: yTop,
            lastDate: date
          });
        }
    });
  }

  render() {

    return (
      <div className={styles.container}>
        <div data-tid="container">
          <h2>Realtime FOREX Bid/Ask Chart</h2>
          {this.state.selectedCurrency && <h3>{this.state.selectedCurrency}</h3>}
            {this.state.bidTime ?
              <LineChart
                yDomainRange={[this.state.yBottom, this.state.yTop]}
                axes
                xType={'text'}
                width={750}
                height={400}
                margin={{top: 10, right: 10, bottom: 50, left: 75}}
                axisLabels={{x: 'Time', y: 'Bid'}}
                lineColors={['white']}
                data={[this.state.bidTime]}
                /> : <p>FOREX not connected.</p>
            }
            {this.state.bidAsk ?
              <div>
              <ul>
                <h4>Latest Bid/Ask</h4>
                <li>{'Bid: ' + this.state.bidAsk[0]}</li>
                <li>{'Ask: ' + this.state.bidAsk[1]}</li>
                <li>{'Last Update: ' + this.state.lastDate}</li>
              </ul>
            </div> : <h3>Listening for updates...</h3>}

        </div>
      </div>
    );
  }
}
