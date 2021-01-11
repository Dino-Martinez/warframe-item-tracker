import React from 'react';
import './WatchList.css';

class WatchList extends React.Component {
  intervalID = 0;
  constructor() {
    super();
    this.state = {
      items: [],
    };

    this.updateData = this.updateData.bind(this);
    this.removeItem = this.removeItem.bind(this);

  }

  componentDidMount() {
    /**
     * this updates our data at our set interval
     * LIMIT: 3 requests/second
     */
    this.updateData();
    this.intervalID = setInterval(this.updateData, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  // Check periodically for api update, set state to new data
  async updateData() {
    /**
    * retrieves json data from flask, and updates our state variable
    * @return {dict}
    */
    const result = await fetch('/api/watchlist/list');
    const json = await result.json();
    this.setState({ items: json });
  }
  async removeItem(item_id) {
    const result = await fetch('/api/watchlist/remove/' + item_id)
  }

  render() {
    return (
      <div className="container text-center mt-5">
        
        <h2>Important Items:</h2>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Average Price</th>
              <th>Min. Price</th>
              <th>Max. Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.items.map((item) => {
              const styles = item.isUrgent ? "text-danger urgent" : "";
              if (item.isUrgent) {
                return (
                  <tr key={item.item_id}>
                    <td className={styles}>{item.name}</td>
                    <td>{item.avg_price}</td>
                    <td>{item.min_price}</td>
                    <td>{item.max_price}</td>
                    <td><p onClick={() => this.removeItem(item.item_id)}>X</p></td>
                  </tr>
                )
              }
            })
          }
          </tbody>
        </table>

        <h2>Watched Items:</h2>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Average Price</th>
              <th>Min. Price</th>
              <th>Max. Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.items.map((item) => {
              return (
                <tr key={item.item_id}>
                  <td>{item.name}</td>
                  <td>{item.avg_price}</td>
                  <td>{item.min_price}</td>
                  <td>{item.max_price}</td>
                  <td><p onClick={() => this.removeItem(item.item_id)}>X</p></td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default WatchList;
