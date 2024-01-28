const fs = require("fs")

;(async () => {
  const output = fs.existsSync("./steam.games.json") ? require("../steam.games.json") : {}
  for(const game of require("../steam.owned.json").response.games) {
    if(output[game.appid]) continue
    console.log("Getting data for", game.appid)
    const data = await getData(game.appid)
    if(!data) {
      console.log("No data for", game.appid)
      continue
    }
    output[game.appid] = {
      name: data.name,
      genres: data.genres?.map(g => g.description) || [],
      image: data.header_image,
    }
    fs.writeFileSync("./steam.games.json", JSON.stringify(output, null, 2))
  }
})()

async function getData(appid) {
  const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=eur&l=fr`)
  const json = await data.json()
  if(!json?.[appid]?.success) return
  return json[appid].data
}
