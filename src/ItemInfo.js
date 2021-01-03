import React from 'react';
import './ItemInfo.css';

class ItemInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      itemId: '',
    };
  }

  componentDidMount() {
    const { match: { params: { itemId } } } = this.props;
    const underscoredId = itemId.split(" ").join("_");
    this.setState({itemId: underscoredId});
    // We can call our API here (and in the future, our database)
  }

  render() {
    return <p>{this.state.itemId}</p>;
  }
}

export default ItemInfo;
