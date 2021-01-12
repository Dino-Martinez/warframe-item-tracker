import React from 'react';
import './ItemInfo.css';
import SearchBar from './SearchBar';
import { VictoryArea, VictoryChart } from 'victory';
import InfoList from './InfoList';

class ItemInfo extends React.Component {
  intervalID = 0;
  constructor() {
    super();
    this.state = {
      successfulAPICall: false,
      waiting: true,
      isSingleItem: true,
      item: {},
      tradingTax: 0,
      ducats: 0,
      relics: [],
      imgUrl: "",
      itemName: "",
      itemId: "",
    };
  }

  /** This ensures our page does not reload if the current url is the same as the next url,
    * and also makes sure that the loading animation displays if they are different
    * @param {dict} props
    * @return {bool}
    */
  componentWillReceiveProps(newProps) {
    if (this.props.match.params.itemName !== newProps.match.params.itemName) {
      this.setState({waiting: true})
      clearInterval(this.intervalID)
    }
  }

  /** After the component updates (page load from "item info page"), we grab the search query and convert it to a format that our API can understand
    * @param {dict} props
    */

  componentDidUpdate(prevProps) {
    if(prevProps.match.params.itemName !== this.props.match.params.itemName) {
      const { match: { params: { itemName } } } = this.props;
      const itemId = prevProps.match.params.itemName.trim().toLowerCase().split(" ").join("_");
      fetch('/api/items/untrack/' + itemId)
      this.retrieveData(itemName);
    }
  }

  /** After the component mounts (page load from HOME), we grab the search query and convert it to a format that our API can understand
    */
  componentDidMount() {
    const { match: { params: { itemName } } } = this.props;
    this.retrieveData(itemName);
    this.intervalID = setInterval( () => {
      this.retrieveData(itemName)}, 2000);    
  }

  /** If the component is being redirected to a new url, we untrack the current item so that stats will not be updated anymore
    */
  componentWillUnmount() {
    const { match: { params: { itemName } } } = this.props;
    const itemId = itemName.trim().toLowerCase().split(" ").join("_");
    fetch('/api/items/untrack/' + itemId)
    clearInterval(this.intervalID)
  }
  /** This function retrieves data from our flask route that calls to our database held in api.py
    * @param {string} itemName
    */
  async retrieveData(itemName) {
    const itemId = itemName.trim().toLowerCase().split(" ").join("_");

    let isSingleItem = false;
    let successfulAPICall = true;

    // Database Call
    const url = "/api/items/" + itemId;
    const itemResults = await fetch(url);


    //if there is a bad search query, we display an error message
    let itemJson = await itemResults.json()
    itemJson = itemJson.shift()
    if (itemJson === undefined) {
      this.setState({successfulAPICall: false, waiting:false})
      return
    }

    // this allows us to be more descriptive with which items have available stats from the API
    if (!itemId.endsWith("_set") && (!itemId.includes("lith_")) && (!itemId.includes("meso_")) && (!itemId.includes("neo_")) && (!itemId.includes("axi_"))) {
      isSingleItem = true;
    }

    // helper functions
    const avgPrice = this.getAvgPrice(itemJson);
    const minPrice = this.getMinPrice(itemJson);
    const maxPrice = this.getMaxPrice(itemJson);
    const imgUrl = this.getImage(itemJson);
    const relics = this.getRelics(itemJson);
    const tradingTax = this.getTradingTax(itemJson);
    const ducats = this.getDucats(itemJson);
    itemName = this.getItemName(itemJson);
    this.setState({item : itemJson, waiting: false, successfulAPICall, tradingTax, ducats, relics, imgUrl, isSingleItem, itemName, itemId, avgPrice, minPrice, maxPrice});

  }

  getAvgPrice(itemJson) {
    return itemJson.avg_price
  }

  getMinPrice(itemJson) {
    return itemJson.min_price
  }

  getMaxPrice(itemJson) {
    return itemJson.max_price
  }

  getItemName(itemJson) {
    return itemJson.name
  }

  getImage(itemJson) {
    return itemJson.img_url
  }

  getRelics(itemJson) {
    return itemJson.relics;
  }

  getTradingTax(itemJson) {
    return itemJson.trading_tax;
  }

  getDucats(itemJson) {
    return itemJson.ducats
  }

  /** Awaits our backend call to add an item to the watchlist
    * @param {string} itemId
    */
  async addItem(itemId) {
    await fetch('/api/watchlist/add/' + itemId)
  }

  render() {
    if (this.state.waiting === true) {
      return (
        <div className="container h1 text-center mt-5">
          <h3 className="text-info loading">Loading...</h3>
          <div id="loading-bar"><div id="progress"></div></div>
        </div>
      )
    }
    if (this.state.successfulAPICall === false) {
      return (
        <div className="container text-center mt-5">
          <p className="h1 text-danger">We could not find the item you requested.</p>
          <SearchBar />
        </div>
      );
    }
    else {
      const chartData = [];
      this.state.item.order_history.forEach((order, index) => {
        chartData.push({x: index + 1, y: order.platinum});
      });

      // Build my info lists for display
      const pricingData = {
        title: "Prices:",
        data: [
          "Average Price: " + this.state.avgPrice,
          "Min Price: " + this.state.minPrice,
          "Max Price: " + this.state.maxPrice,
        ]
      };

      const ducatsData = {
        title: "Ducats:",
        data: [
          this.state.ducats,
        ]
      };

      const tradingTaxData = {
        title: "Trading Tax:",
        data: [
          this.state.tradingTax,
        ]
      };
      
      const relicNames = []
      this.state.relics.forEach ( (relic) => {
        relicNames.push(relic.name)
      })
      const relicsData = {
        title: "Aquisition:",
        data: relicNames,
      };

      return (
        <div>
          <SearchBar />
          <div className ="item-img">
            <img src={this.state.imgUrl} alt="Item"></img>
          </div>
          <div className="btn-name">
            <h3>{this.state.itemName}</h3>
            <button className="btn btn-info" onClick={() => this.addItem(this.state.itemId)}>Add Item to Watch List</button>
          </div>
          {this.state.successfulAPICall
            &&(
            <div className="container data-container">
              {this.state.ducats > -1
              &&(
              <InfoList data={ducatsData} />
              )}
              <InfoList data={pricingData} />
              {this.state.tradingTax > -1
              &&(
                <InfoList data={tradingTaxData} />
              )}
              {this.state.relics.length > 0
              &&(
                <InfoList data={relicsData} />
              )}
            </div>
          )}
          {chartData.length > 1
            &&(
              <div className="VictoryLineContainer">
                <VictoryChart>
                  <VictoryArea
                    style={{
                      data: {
                        fill: "#c43a31", fillOpacity: 0.7, stroke: "#c43a31", strokeWidth: 3
                      },
                      labels: {
                        fontSize: 15,
                        fill: ({ datum }) => datum.x === 3 ? "#000000" : "#c43a31"
                      }
                    }}
                    data={chartData}
                    labels={({ datum }) => {
                      return datum.x % 2 === 0 ? datum.y : "";
                    }}
                  />
                </VictoryChart>
              </div>
            )
          }
        </div>
      );
    }
  }
}

export default ItemInfo;
