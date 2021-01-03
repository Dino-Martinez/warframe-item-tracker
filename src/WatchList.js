import React from 'react';
import './WatchList.css';

class WatchList extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [
        {id: "itemIdOne", name: "Test name", price: 10},
        {id: "itemIdTwo", name: "Test name", price: 20},
        {id: "itemIdThree", name: "Test name", price: 30},
      ],
      urgentItems: []
    };
  }
  
  render() {
    return (
      <div>
        <ul>
          {
            this.state.items.map((item) => {
              return <li key={item.id}>{item.name} | {item.price}</li>
            })
          }
        </ul>
      </div>
    );
  }
}

export default WatchList;
