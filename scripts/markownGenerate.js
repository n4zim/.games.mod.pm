
let output = []

for(const game of require("../steam.owned.json").response.games) {
  if(require("../ignored.json").indexOf(game.appid) !== -1) continue

  const gameData = require("../steam.games.json")[game.appid]
  if(!gameData) continue

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

const genresCount = {}

output = output
  .filter(({ name }) => require("../ignored.json").indexOf(name) === -1)
  .map(game => {
    for(let genre of game.genres.split(", ")) {
      if(genre === "Role-playing (RPG)") {
        genre = "RPG"
      } else if (genre === "Sport") {
        genre = "Sports"
      } else if (genre === "Real Time Strategy (RTS)") {
        genre = "RTS"
      }
      genresCount[genre] = (genresCount[genre] || 0) + 1
    }
    return game
  })

const names = output.map(({ name }) => name)
const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
if(duplicates.length) console.error("Duplicates found", duplicates)

require("fs").writeFileSync(
  "./README.md",
  "# Games Library\n\n"
    + "## Stats\n"
    + "- Total games: " + output.length + "\n"
    + "- Days played: " + Math.floor(output.reduce((acc, { hoursPlayed }) => acc + (hoursPlayed || 0), 0) / 24) + "\n"
    + "- Total most liked games: " + output.filter(({ affinity }) => affinity === 5).length + "\n"
    + "- Total unplayed games: " + Math.round(output.filter(({ hoursPlayed }) => !hoursPlayed).length / output.length * 100) + "%\n"
    + "- Total unrated games: " + Math.round(output.filter(({ affinity }) => !affinity).length / output.length * 100) + "%\n"
    + "- Genres: " + Object.entries(genresCount).sort((a, b) => b[1] - a[1]).map(([genre, count]) => `${genre} (${count})`).join(", ")
    + "\n## List\n"
    + "| Image | Name | Genres | Hours Played | Affinity |\n| --- | --- | --- | --- | --- |\n"
    + output
        .sort((a, b) => {
          return ((b.affinity || 0) - (a.affinity || 0))
            || ((b.hoursPlayed || 0) - (a.hoursPlayed || 0))
            || a.name.localeCompare(b.name)
        })
        .map(({ name, genres, image, hoursPlayed, affinity }) => {
          return `| ![${name}](${image}) | ${name} | ${genres} | ${hoursPlayed || ""} | ${affinity ? "⭐".repeat(affinity) : ""} |\n`
        })
        .join("")
)
