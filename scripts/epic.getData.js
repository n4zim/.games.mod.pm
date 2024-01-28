;(async () => {
  let data = await getData()
  let orders = data.orders
  while(data.nextPageToken) {
    data = await getData(data.nextPageToken)
    orders = orders.concat(data.orders)
  }
  console.log(orders)
})()

async function getData(from) {
  let url = "https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=fr"
  if(from) url += `&nextPageToken=${from}`
  const data = await fetch(url)
  return await data.json()
}
