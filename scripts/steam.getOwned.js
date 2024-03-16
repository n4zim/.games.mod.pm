const fs = require("fs")

;(async () => {
  const data = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${process.env.STEAM_ID}&format=json`)

  const json = await data.json()

  fs.writeFileSync("./steam.owned.json", JSON.stringify(json, null, 2))
})()
