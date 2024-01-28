const fs = require("fs")

let played = `# Games Library\n
| Image | Name | Genres | Hours Played | Favorites |
| --- | --- | --- | --- | --- |
`

let unplayed = `# Unplayed Games Library\n
| Image | Name | Genres |
| --- | --- | --- |
`

const steamOwned = require("../steam.owned.json")
const steamData = require("../steam.games.json")

const favoriteGames = {
  "Alan Wake": 2,
  "ASTRONEER": 2,
  "Beat Saber": 2,
  "Beholder": 3,
  "BioShock Infinite": 3,
  "Black Mesa": 2,
  "BONEWORKS": 3,
  "Borderlands Game of the Year": 1,
  "Chants of Sennaar": 2,
  "Cities: Skylines": 3,
  "Cyberpunk 2077": 2,
  "Detroit: Become Human": 3,
  "Factorio": 3,
  "Fallout 4": 3,
  "Fallout: New Vegas": 3,
  "Final Assault": 2,
  "Frostpunk": 2,
  "Garry's Mod": 2,
  "GORN": 2,
  "Grand Theft Auto V": 2,
  "Half-Life 2: Episode One": 2,
  "Half-Life 2: Episode Two": 2,
  "Half-Life 2": 2,
  "Half-Life: Alyx": 3,
  "Half-Life": 2,
  "HITMAN™": 3,
  "L.A. Noire": 3,
  "Left 4 Dead 2": 1,
  "Little Inferno": 2,
  "Mass Effect 2 (2010 Edition)": 3,
  "Metro 2033": 2,
  "Mini Metro": 1,
  "Mirror's Edge™": 2,
  "Outer Wilds": 3,
  "Overlord II": 2,
  "Overlord™": 1,
  "Pistol Whip": 2,
  "Portal 2": 3,
  "Portal": 3,
  "Project Zomboid": 1,
  "Return of the Obra Dinn": 2,
  "Saints Row: The Third": 3,
  "SPORE™": 2,
  "Starfield": 2,
  "Stick Fight: The Game": 1,
  "Subnautica: Below Zero": 3,
  "Subnautica": 3,
  "SUPERHOT": 2,
  "Surviving Mars": 2,
  "Tabletop Simulator": 2,
  "The Case of the Golden Idol": 2,
  "The Elder Scrolls V: Skyrim": 3,
  "The Forgotten City": 3,
  "The Quarry": 3,
  "The Silent Age": 2,
  "The Talos Principle": 2,
  "The Walking Dead: Season Two": 3,
  "The Walking Dead: The Final Season": 3,
  "The Walking Dead": 3,
  "The Witcher® 3: Wild Hunt": 3,
  "The Wolf Among Us": 3,
  "Turmoil": 1,
  "Two Point Hospital": 3,
  "Warhammer® 40,000: Dawn of War® - Game of the Year Edition": 3,
  "We Were Here Forever": 3,
  "We Were Here Together": 3,
  "We Were Here Too": 3,
  "Wolfenstein II: The New Colossus": 2,
  "XCOM: Enemy Unknown": 3,
  "XCOM® 2": 2,
}

for (const game of steamOwned.response.games.sort((a, b) => b.playtime_forever - a.playtime_forever)) {
  const gameData = steamData[game.appid]
  if(!gameData) {
    console.log("Skipping", game.appid)
    continue
  }
  const { name, genres, image } = gameData
  const genresString = genres.join(", ")
  if(game.playtime_forever === 0) {
    unplayed += `| ![${name}](${image}) | ${name} | ${genresString} |\n`
  } else {
    const hoursPlayed = Math.ceil(game.playtime_forever / 60)
    const favorite = favoriteGames[name]
    played += `| ![${name}](${image}) | ${name} | ${genresString} | ${hoursPlayed} | ${favorite ? "⭐".repeat(favorite) : ""} |\n`
  }
}

fs.writeFileSync("./README.md", played)
fs.writeFileSync("./UNPLAYED.md", unplayed)
