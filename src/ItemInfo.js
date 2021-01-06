import React from 'react';
import './ItemInfo.css';
import SearchBar from './SearchBar';

class ItemInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      successfulAPICall: false,
      isSingleItem: true,
      item: {},
      ninetyDaysAverage: 0,
      ninetyDaysMin: 0,
      ninetyDaysMax: 0,
      fortyEightHoursAverage: 0,
      fortyEightHoursMin: 0,
      fortyEightHoursMax: 0,
      tradingTax: 0,
      ducats: 0,
      relics: [],
      imgUrl: "",
    };
  }

  componentDidUpdate(prevProps) {
    // After the component updates (page load from "item info page"), we grab the search query and convert it to a format that our API can understand
    if(prevProps.match.params.itemId !== this.props.match.params.itemId) {
      const { match: { params: { itemId } } } = this.props;
      const underscoredId = itemId.trim().toLowerCase().split(" ").join("_");
      this.retrieveData(underscoredId);
    }
  }

  componentDidMount() {
    // After the component mounts (page load from HOME), we grab the search query and convert it to a format that our API can understand
    const { match: { params: { itemId } } } = this.props;
    const underscoredId = itemId.trim().toLowerCase().split(" ").join("_");
    this.retrieveData(underscoredId);
  }

  async retrieveData(underscoreId) {
    // This function handles our API call which will later handle our database call

    let isSingleItem = false;
    let successfulAPICall = false;

    // Database Call
    const url = "/api/items/" + underscoreId;
    const itemResults = await fetch(url);
    const itemJson = await itemResults.json();


    if (!underscoreId.endsWith("_set")) {
      isSingleItem = true;
    }  
    if(itemJson !== null) {
      successfulAPICall = true;
    }
    else {
      this.setState({successfulAPICall: false});
      return;
    }


    const imgUrl = this.getImage(itemJson);
    const relics = this.getRelics(itemJson);
    const tradingTax = this.getTradingTax(itemJson);
    const ducats = this.getDucats(itemJson);

    const ninetyDays = itemJson["90day"];
    const fortyEightHours = itemJson["48hr"];
    this.getNinetyDaysData(ninetyDays);
    this.getFortyEightHoursData(fortyEightHours);

    this.setState({item : itemJson, ninetyDays, successfulAPICall, tradingTax, ducats, relics, imgUrl, isSingleItem});
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

  getNinetyDaysData(ninetyDays) {
    let counter = 0;
    let total = 0;
    let ninetyDaysMin = 10000;
    let ninetyDaysMax = 0;
    ninetyDays.map((day) => {
      counter ++;
      total += day.avg;
      if (day.min < ninetyDaysMin) {
        ninetyDaysMin = day.min;
      }
      if (day.max > ninetyDaysMax) {
        ninetyDaysMax = day.max;
      }
        return null;
    })
    let ninetyDaysAverage = total/counter;
    this.setState ({ninetyDaysAverage, ninetyDaysMin, ninetyDaysMax})
  }
  getFortyEightHoursData(fortyEightHours) {
    let counter = 0;
    let total = 0;
    let fortyEightHoursMin = 10000;
    let fortyEightHoursMax = 0;
    fortyEightHours.map((day) => {
      counter ++;
      total += day.avg;
      if (day.min < fortyEightHoursMin) {
        fortyEightHoursMin = day.min;
      }
      if (day.max > fortyEightHoursMax) {
        fortyEightHoursMax = day.max;
      }
        return null;
    })
    let fortyEightHoursAverage = total/counter;
    this.setState ({fortyEightHoursAverage, fortyEightHoursMin, fortyEightHoursMax})
  }

  render() {
    if (this.state.successfulAPICall !== true) {
      return (
        <div>
          <p>This API Call sucks</p>
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
          {this.state.successfulAPICall
            &&(
            <div className="container">
              <div className="row">
                <div className="col-sm-6 content"><strong>Last 48 Hours</strong></div>
                <div className="col-sm-6 content"><strong>Last 90 Days</strong></div>
              </div>
              <div className="row">
                <div className="col-sm-6 content">Average Price: {this.state.fortyEightHoursAverage.toFixed(2)}</div>
                <div className="col-sm-6 content">Average Price: {this.state.ninetyDaysAverage.toFixed(2)}</div>
              </div>
              <div className="row">
                <div className="col-sm-6 content">Min Price: {this.state.fortyEightHoursMin}</div>
                <div className="col-sm-6 content">Min Price: {this.state.ninetyDaysMin}</div>
              </div>
              <div className="row">
                <div className="col-sm-6 content">Max Price: {this.state.fortyEightHoursMax}</div>
                <div className="col-sm-6 content">Max Price: {this.state.ninetyDaysMax}</div>
              </div>
              <div className="row">
                <div className="col-sm-6 content"><strong>Ducats</strong></div>
                <div className="col-sm-6 content"><strong>Trading Tax</strong></div>
              </div>
              <div className="row">
                <div className="col-sm-6 content">{this.state.ducats}</div>
                <div className="col-sm-6 content">{this.state.tradingTax}</div>
              </div>
              {this.state.isSingleItem
              &&(
                <div>
                  <div className="row">
                    <div className="col-sm-6 content"><strong>Aquisition</strong></div>
                  </div>
                    {
                      this.state.relics.map ( (relic) => {
                        return (
                          <div key={relic} className="row">
                            <div className="col-sm-6 content">{relic}</div>
                          </div>
                        )
                      })
                    }
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
