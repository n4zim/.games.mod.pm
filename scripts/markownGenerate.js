
const output = []

for(const game of require("../steam.owned.json").response.games) {
  const gameData = require("../steam.games.json")[game.appid]
  if(!gameData) {
    console.log("Skipping", game.appid)
    continue
  }
  const current = {
    name: require("../renames.json")[gameData.name] || gameData.name,
    image: gameData.image,
    genres: gameData.genres.join(", "),
  }
  if(game.playtime_forever !== 0) {
    current.hoursPlayed = Math.ceil(game.playtime_forever / 60)
  }
  current.affinity = require("../affinity.json")[current.name]
  output.push(current)
}

for(const game of require("../gog.games.json")) {
  const gameName = require("../renames.json")[game.name] || game.name
  const found = output.find(({ name }) => name === gameName)
  if(found) {
    if(game.gameMins) {
      found.hoursPlayed = Math.ceil((game.gameMins / 60) + (found.hoursPlayed || 0))
    }
  } else {
    output.push({
      name: gameName,
      image: game.image,
      genres: game.genres,
      hoursPlayed: Math.ceil(game.gameMins / 60),
      affinity: require("../affinity.json")[gameName],
    })
  }
}

require("fs").writeFileSync(
  "./README.md",
  "# Games Library\n\n| Image | Name | Genres | Hours Played | Affinity |\n| --- | --- | --- | --- | --- |\n"
    + output
        .sort((a, b) => {
          return ((b.affinity || 0) - (a.affinity || 0))
            || ((b.hoursPlayed || 0) - (a.hoursPlayed || 0))
            || a.name.localeCompare(b.name)
        })
        .filter(({ name }) => require("../ignored.json").indexOf(name) === -1)
        .map(({ name, genres, image, hoursPlayed, affinity }) => {
          return `| ![${name}](${image}) | ${name} | ${genres} | ${hoursPlayed || ""} | ${affinity ? "⭐".repeat(affinity) : ""} |\n`
        })
        .join("")
)
