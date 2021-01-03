import React from 'react';
import './WatchList.css';

class WatchList extends React.Component {
  intervalID = 0;
  constructor() {
    super();
    this.state = {
      items: [
        {id: "itemIdOne", name: "Test name", average: 10, min: 5, max: 15, isUrgent: false},
        {id: "itemIdTwo", name: "Test name", average: 20, min: 15, max: 25, isUrgent: false},
        {id: "itemIdThree", name: "Test name", average: 30, min: 35, max: 35, isUrgent: false},
        {id: "itemIdFour", name: "Test name", average: 30, min: 35, max: 35, isUrgent: true},
        {id: "itemIdFive", name: "Test name", average: 30, min: 35, max: 35, isUrgent: false},
        {id: "itemIdSix", name: "Test name", average: 30, min: 35, max: 35, isUrgent: true},
      ],
    };

    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    this.intervalID = setInterval(this.updateData, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }


  // Check periodically for api update, set state to new data
  updateData() {
    console.log('updating...');
    const items = [
      {id: "itemIdOne", name: "Test name", average: 10, min: Math.floor((Math.random() * 100) + 1), max: 15, isUrgent: false},
      {id: "itemIdTwo", name: "Test name", average: 20, min: Math.floor((Math.random() * 100) + 1), max: 25, isUrgent: false},
      {id: "itemIdThree", name: "Test name", average: 30, min: Math.floor((Math.random() * 100) + 1), max: 35, isUrgent: false},
      {id: "itemIdFour", name: "Test name", average: 30, min: Math.floor((Math.random() * 100) + 1), max: 35, isUrgent: true},
      {id: "itemIdFive", name: "Test name", average: 30, min: Math.floor((Math.random() * 100) + 1), max: 35, isUrgent: false},
      {id: "itemIdSix", name: "Test name", average: 30, min: Math.floor((Math.random() * 100) + 1), max: 35, isUrgent: true},
    ];

    this.setState({items: items});
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
                <tr key={item.id}>
                  <td className={styles}>{item.name}</td>
                  <td>{item.average}</td>
                  <td>{item.min}</td>
                  <td>{item.max}</td>
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
