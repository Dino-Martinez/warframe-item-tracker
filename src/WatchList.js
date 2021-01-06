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
  }

  componentDidMount() {
    this.updateData();
    this.intervalID = setInterval(this.updateData, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }


  // Check periodically for api update, set state to new data
  async updateData() {
    const result = await fetch('/api/watchlist/list');
    const json = await result.json();
    this.setState({ items: json });
  }

  render() {
    return (
      <div className="container text-center mt-5">
        <h2>Watched Items:</h2>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Average Price</th>
              <th>Min. Price</th>
              <th>Max. Price</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.items.map((item) => {
              const styles = item.isUrgent ? "text-danger urgent" : "";
              return (
                <tr key={item.item_id}>
                  <td className={styles}>{item.name}</td>
                  <td>{item["90day"].avg}</td>
                  <td>{item["90day"].min}</td>
                  <td>{item["90day"].max}</td>
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
