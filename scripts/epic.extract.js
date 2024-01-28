const fs = require("fs")

;(async () => {
  const output = []
  for(const order of require("../epic.orders.json")) {
    if(order.marketplaceName !== "Epic Games Store") continue
    for(const item of order.items) {
      const data = await getData(item.offerId)
      output.push({
        id: data.id,
        name: data.title,
        genres: (data.tags || [])
          .filter(tag => tag !== null)
          .map(tag => tag.name)
          .filter(name => name !== "Windows" && name !== "Mac OS" && name !== "Linux"),
        image: (
          data.keyImages.filter(image => image.type === "Thumbnail")?.[0]
          || data.keyImages.filter(image => image.type === "OfferImageWide")?.[0]
        ).url,
      })
      fs.writeFileSync("epic.owned.json", JSON.stringify(output, null, 2))
    }
  }
})()

async function getData(id) {
  const data = await fetch(`https://raw.githubusercontent.com/nachoaldamav/offers-tracker/main/database/offers/${id}.json`)
  return await data.json()
}
