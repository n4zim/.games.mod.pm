
const output = []

for(const game of require("../steam.owned.json").response.games) {
  const gameData = require("../steam.games.json")[game.appid]
  if(!gameData) {
    console.log("Skipping", game.appid)
    continue
  }
  const current = {
    name: gameData.name,
    image: gameData.image,
    genres: gameData.genres.join(", "),
  }
  if(game.playtime_forever !== 0) {
    current.hoursPlayed = Math.ceil(game.playtime_forever / 60)
  }
  current.note = require("../notes.json")[current.name]
  output.push(current)
}

require("fs").writeFileSync(
  "./README.md",
  "# Games Library\n\n| Image | Name | Genres | Hours Played | Note |\n| --- | --- | --- | --- | --- |\n"
    + output
        .sort((a, b) => {
          return (b.note || 0) - (a.note || 0)
            || b.hoursPlayed - a.hoursPlayed
            || a.name.localeCompare(b.name)
        })
        .map(({ name, genres, image, hoursPlayed, note }) => {
          return `| ![${name}](${image}) | ${name} | ${genres} | ${hoursPlayed || ""} | ${note ? "⭐".repeat(note) : ""} |\n`
        })
        .join("")
)
