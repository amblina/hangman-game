#!/usr/bin/env node

const HangmanGame = require('./game/Hangman')
const program = require('commander')
const keypress = require('keypress')
const gameOptions = require('./game/config')
const ConsoleUI = require('./game/consoleUI')
const HighScoreStore = require('./game/HighScoreStore')

const consoleUI = new ConsoleUI(process.stdin, process.stdout)

var game = null
var gameDetails = null

program
  .version('0.0.1')
  .option('-g, --gre', 'Shows gre words')
  .option('-f, --freq', 'Shows frequent gre words')
  .parse(process.argv)

if (program.freq) {
  game = new HangmanGame(gameOptions[0])
} else if (program.gre) {
  game = new HangmanGame(gameOptions[1])
} else {
  // Default is high frequency game
  game = new HangmanGame(gameOptions[0])
}

consoleUI.render(game.init())

keypress(process.stdin)
process.stdin.setRawMode('true')

process.stdin.on('keypress', function (ch, key) {
  if (!key || !key.name) {
    return
  }

  if (key && key.ctrl && key.name === 'c') {
    process.exit(0)
  }

  gameDetails = game.nextTurn(key.name)
  consoleUI.render(gameDetails)

  if (gameDetails.gameState === 1) {
    const highScore = new HighScoreStore(gameDetails)
    highScore.save()
    consoleUI.write(highScore.fetch())
    process.exit(0)
  } else if (gameDetails.gameState === 0) {
    process.exit(0)
  }
})
