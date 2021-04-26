// Set db
require('./data/warframe-db')
const fetch = require('node-fetch')
const Item = require('./models/item.js')

const timer = ms => new Promise(res => setTimeout(res, ms))


const initialize = async () => {
  // Get api data
  const result = await fetch('http://api.warframe.market/v1/items')
  const json = await result.json()
  const payload = json["payload"]
  const items = payload["items"]

  items.forEach( async (item, i) => {
    setTimeout( async () => {
      const item_id = item.url_name
      const db_item = await Item.findOne({item_id: item_id})
      if(!db_item){
        try{
          const apiResponse = await fetch(
            `http://api.warframe.market/v1/items/${item_id}`
          )
          const apiJson = await apiResponse.json()
          const items_in_set = apiJson.payload.item.items_in_set
          const item_ids = []
          let ducats = 0
          let trading_tax = 0
          let relics = []
          let mod_max_rank = 999999
          let name = ''
          let thumbnail = ''
          items_in_set.forEach(single_item => {
            item_ids.push(single_item.url_name)
            if (single_item.en && single_item.url_name === item_id) {
              name = single_item.en.item_name
              ducats = single_item.ducats || 0
              trading_tax = single_item.trading_tax || 0
              relics = single_item.en.drop || []
              mod_max_rank = single_item.mod_max_rank || 999999
              thumbnail = single_item.thumb || ''
            }
          })
          const db_item = new Item({
            item_id,
            name,
            img_url: `https://api.warframe.market/static/assets/${thumbnail}`,
            ducats: ducats,
            trading_tax: trading_tax,
            is_urgent: false,
            is_watched: false,
            needs_stats: false,
            items_in_set: item_ids,
            relics: relics,
            max_mod_rank: mod_max_rank,
            avg_price: 0,
            min_price: 100000,
            max_price: -1,
            order_history: []
          })
          console.log(`Saving ${name}`)
          await db_item.save()

        } catch(err){
          // console.log(err)
        }
      }
      else {
        console.log(`Skipped ${item_id}`)
      }
    }, i * 334)
  })
}

initialize()
