import React from 'react';
import './ItemInfo.css';
import SearchBar from './SearchBar';

class ItemInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      successfulAPICall: false,
      waiting: true,
      isSingleItem: true,
      item: {},
      ninetyDays: {},
      fortyEightHours: {},
      tradingTax: 0,
      ducats: 0,
      relics: [],
      imgUrl: "",
      itemName: "",
      itemId: "",
    };
  }

  componentWillReceiveProps(newProps) {
    /**
     * this ensures our page does not reload if the current url is the same as the next url
     * @param {dict} props
     * @return {bool}
     */
    
    if (this.props.match.params.itemName !== newProps.match.params.itemName) {
      // fetch('/api/items/track/' + newProps.match.params.itemName)
      this.setState({waiting: true})
    }
  }

  componentDidUpdate(prevProps) {
    /**
     * After the component updates (page load from "item info page"), we grab the search query and convert it to a format that our API can understand
     * @param {dict} props
     * @return {bool}
     */
    if(prevProps.match.params.itemName !== this.props.match.params.itemName) {
      const { match: { params: { itemName } } } = this.props;
      const itemId = prevProps.match.params.itemName.trim().toLowerCase().split(" ").join("_");
      fetch('/api/items/untrack/' + itemId)
      this.retrieveData(itemName);
    }
  }

  componentDidMount() {
    /**
     * After the component mounts (page load from HOME), we grab the search query and convert it to a format that our API can understand
     * @return {dict}
     */
    const { match: { params: { itemName } } } = this.props;
    this.retrieveData(itemName);
  }

  componentWillUnmount() {
    /**
     * If the component is being redirected to a new url, we untrack the current item so that stats will not be updated anymore
     * @return {dict}
     */
    const { match: { params: { itemName } } } = this.props;
    const itemId = itemName.trim().toLowerCase().split(" ").join("_");
    fetch('/api/items/untrack/' + itemId)
  }

  async retrieveData(itemName) {
    /**
     * This function retrieves data from our flask route that calls to our database held in api.py
     * @param {string} itemName
     * @return {dict}
     */
    const itemId = itemName.trim().toLowerCase().split(" ").join("_");
    await fetch('/api/items/track/' + itemId)
    setTimeout(async() => {

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
      const ninetyDays = itemJson["90day"];
      const fortyEightHours = itemJson["48hr"];

      // helper functions
      const imgUrl = this.getImage(itemJson);
      const relics = this.getRelics(itemJson);
      const tradingTax = this.getTradingTax(itemJson);
      const ducats = this.getDucats(itemJson);
      itemName = this.getItemName(itemJson);
      this.setState({item : itemJson, waiting: false, ninetyDays, fortyEightHours, successfulAPICall, tradingTax, ducats, relics, imgUrl, isSingleItem, itemName, itemId});
    }, 2000);
  }


  getItemName(itemJson) {
     /**
     * @param {dict} json
     * @return {string}
     */
    return itemJson.name
  }
  getImage(itemJson) {
     /**
     * @param {dict} json
     * @return {string}
     */
    return itemJson.img_url
  }
  getRelics(itemJson) {
     /**
     * @param {dict} json
     * @return {array}
     */
    return itemJson.relics;
  }
  getTradingTax(itemJson) {
    /**
     * @param {dict} json
     * @return {int}
     */
    return itemJson.trading_tax;
  }
  getDucats(itemJson) {
    /**
     * @param {dict} json
     * @return {int}
     */
    return itemJson.ducats
  }
  async addItem(itemId) {
    /**
     * this function sends an itemId to the flask route to add an item to the watch list
     * @param {dict} json
     */
    await fetch('/api/watchlist/add/' + itemId)
    return
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
        <div className="container h1 text-center mt-5">
          <p className="text-danger">We could not find the item you requested.</p>
          <SearchBar />
        </div>
      );
    }
    else {
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
            <div className="container">
              <div className="row">
              {this.state.fortyEightHours.min !== 10000000000
              &&(
                <div className="col-sm-6 content"><strong>Last 48 Hours</strong></div>
              )}
                <div className="col-sm-6 content"><strong>Last 90 Days</strong></div>
              </div>
              <div className="row">
              {this.state.fortyEightHours.min !== 10000000000
              &&(
                <div className="col-sm-6 content">Average Price: {this.state.fortyEightHours.avg.toFixed(2)}</div>
              )}
                <div className="col-sm-6 content">Average Price: {this.state.ninetyDays.avg.toFixed(2)}</div>
              </div>
              <div className="row">
              {this.state.fortyEightHours.min !== 10000000000
              &&(
                <div className="col-sm-6 content">Min Price: {this.state.fortyEightHours.min}</div>
              )}
                <div className="col-sm-6 content">Min Price: {this.state.ninetyDays.min}</div>
              </div>
              <div className="row">
              {this.state.fortyEightHours.min !== 10000000000
              &&(
                <div className="col-sm-6 content">Max Price: {this.state.fortyEightHours.max}</div>
              )}
                <div className="col-sm-6 content">Max Price: {this.state.ninetyDays.max}</div>
              </div>
              {this.state.isSingleItem
              &&(
                <div>
                  <div className="row">
                  {this.state.ducats > -1
                  &&(
                    <div className="col-sm-6 content"><strong>Ducats</strong></div>
                  )}
                    <div className="col-sm-6 content"><strong>Trading Tax</strong></div>
                  </div>
                  <div className="row">
                  {this.state.ducats > -1
                  &&(
                    <div className="col-sm-6 content">{this.state.ducats}</div>
                  )}
                    <div className="col-sm-6 content">{this.state.tradingTax}</div>
                  </div>
                  {this.state.relics.length > 0
                  &&(
                    <div>
                      <div className="row">
                        <div className="col-sm-6 content"><strong>Aquisition</strong></div>
                      </div>
                        {
                          this.state.relics.map ( (relic) => {
                            return (
                              <div key={relic.name} className="row">
                                <div className="col-sm-6 content">{relic.name}</div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
}

export default ItemInfo;
