/* eslint-disable */
import React from 'react'
import './WatchList.css'
import ReactPaginate from 'react-paginate'

class WatchList extends React.Component {
  constructor() {
    super()
    this.state = {
      items: [],
      itemsPerPage: 5,
      offset: 0,
      urgentOffset: 0
    }
    this.updateData = this.updateData.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.intervalID = 0
  }

  /**
   * this updates our data at our set interval
   */
  componentDidMount() {
    this.updateData()
    this.intervalID = setInterval(this.updateData, 2000)
  }

  /**
   * this updates our data at our set interval
   */
  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  handlePageClick(data, isUrgent) {
    const selected = data.selected
    const offset = Math.ceil(selected * this.state.itemsPerPage)
    if (isUrgent) {
      this.setState({ urgentOffset: offset })
    } else {
      this.setState({ offset })
    }
  }

  /**
   * Updates our state variable when called
   */
  async updateData() {
    const result = await fetch(
      'https://1zhfaxchy9.execute-api.us-east-1.amazonaws.com/dev//api/watchlist/list'
    )
    const json = await result.json()
    this.setState({ items: json })
  }

  async removeItem(item_id) {
    await fetch(
      'https://1zhfaxchy9.execute-api.us-east-1.amazonaws.com/dev//api/watchlist/remove/' +
        item_id
    )
  }

  render() {
    const { items, itemsPerPage, offset, urgentOffset } = this.state
    const totalPages = Math.ceil(items.length / itemsPerPage)
    const urgentItems = items.filter(item => item.is_urgent)
    const totalUrgentPages = Math.ceil(urgentItems.length / itemsPerPage)

    return (
      <div className="container text-center mt-5">
        <h2 className="header">Urgent Items:</h2>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Average Price</th>
              <th>Min. Price</th>
              <th>Max. Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {urgentItems
              .slice(urgentOffset, urgentOffset + itemsPerPage)
              .map(item => {
                return (
                  <tr key={item.item_id}>
                    <td>{item.name}</td>
                    <td>{item.avg_price}</td>
                    <td>{item.min_price}</td>
                    <td>{item.max_price}</td>
                    <td>
                      <p onClick={() => this.removeItem(item.item_id)}>X</p>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          breakLabel="..."
          breakClassName="PaginationBreak"
          pageCount={totalUrgentPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={data => {
            this.handlePageClick(data, true)
          }}
          containerClassName="Pagination"
          subContainerClassName="PaginationPages Pagination"
          activeClassName="PaginationActive"
        />

        <h2 className="header">Watched Items:</h2>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Average Price</th>
              <th>Min. Price</th>
              <th>Max. Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.slice(offset, offset + itemsPerPage).map(item => {
              return (
                <tr key={item.item_id}>
                  <td>{item.name}</td>
                  <td>{item.avg_price}</td>
                  <td>{item.min_price}</td>
                  <td>{item.max_price}</td>
                  <td>
                    <p onClick={() => this.removeItem(item.item_id)}>X</p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel="Prev"
          nextLabel="Next"
          breakLabel="..."
          breakClassName="PaginationBreak"
          pageCount={totalPages}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={data => {
            this.handlePageClick(data, false)
          }}
          containerClassName="Pagination"
          subContainerClassName="PaginationPages Pagination"
          activeClassName="PaginationActive"
        />
      </div>
    )
  }
}

export default WatchList
