
const gog = require("fs").readFileSync("./gog.csv", "utf8").split("\r\n")

const columns = gog[0].split("\t")

const games = gog.slice(1, -1).reduce((all, game) => {
  const current = {}

  let textBuffer = ""

  game
    .split("\t")
    .reduce((acc, column) => {
      if(column.startsWith("\"") && !column.endsWith("\"")) {
        textBuffer = column
        return acc
      }
      if(textBuffer) {
        textBuffer += ", " + column
        if(column.endsWith("\"")) {
          acc.push(textBuffer.slice(1, -1))
          textBuffer = ""
        }
        return acc
      }
      acc.push(column)
      return acc
    }, [])
    .forEach((column, index) => {
      current[columns[index]] = column
    })

  if(
    game.title !== game.originalTitle
    || game.title !== game.sortingTitle
  ) {
    console.log("Title mismatch:", game.title, game.originalTitle, game.sortingTitle)
  }

  if(current.platformList.indexOf("Steam") !== -1) {
    const output = {
      name: current.title,
      image: current.squareIcon,
      genres: current.genres,
    }

    //if(current.lastPlayed) output.lastPlayed = current.lastPlayed
    if(current.gameMins) output.gameMins = current.gameMins

    all.push(output)
  }

  return all
}, [])

require("fs").writeFileSync("./gog.games.json", JSON.stringify(games, null, 2), "utf8")
