import React from 'react';
import './ItemInfo.css';
import SearchBar from './SearchBar';

class ItemInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      successfulAPICall: true,
      item: {},
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
    const url = "https://api.warframe.market/v1/items/" + underscoreId + "/statistics";
    const result = await fetch(url);
    const json = await result.json();
    console.log(json)
    if(result.status !== 200) {
      /* Here I should make a JSX component to get added to the screen telling the user this is not a good name to search for */
      this.setState({successfulAPICall: false}); 
      return
    }
    this.setState({item : json.payload.item});
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
        <SearchBar />
      );
    }
  }
}

export default ItemInfo;
