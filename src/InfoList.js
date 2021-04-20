import React from 'react'
import './InfoList.css'

class InfoList extends React.Component {
  render () {
    const propsObject = this.props.data
    return (
      <div>
        <div><strong>{propsObject.title}</strong></div>
        <ul>
          {propsObject.data.map((item, i) => {
            return <li key={item + i}>{item}</li>
          })}
        </ul>
      </div>
    )
  }
}

export default InfoList
