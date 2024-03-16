
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
  current.note = require("../notes.json")[current.name]
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
      note: require("../notes.json")[gameName],
    })
  }
}

require("fs").writeFileSync(
  "./README.md",
  "# Games Library\n\n| Image | Name | Genres | Hours Played | Note |\n| --- | --- | --- | --- | --- |\n"
    + output
        .sort((a, b) => {
          return ((b.note || 0) - (a.note || 0))
            || ((b.hoursPlayed || 0) - (a.hoursPlayed || 0))
            || a.name.localeCompare(b.name)
        })
        .map(({ name, genres, image, hoursPlayed, note }) => {
          return `| ![${name}](${image}) | ${name} | ${genres} | ${hoursPlayed || ""} | ${note ? "⭐".repeat(note) : ""} |\n`
        })
        .join("")
)
