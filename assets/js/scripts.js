'use strict'

//
//  Play, Pause Theme Song
//

const themeSong = document.querySelector('#themeSong')

function togglePlay() {
  return themeSong.paused ? themeSong.play() : themeSong.pause()
}

//
//  Animate Play, Pause Button
//

const playPauseButton = document.querySelector('.play-pause-button')
playPauseButton.addEventListener('click', () => {
  playPauseButton.classList.toggle('paused')
})

//
// Test Scrolling
//

document.addEventListener('DOMContentLoaded', function(event) {
  // array with texts to type in typewriter
  var dataText = [
    'Whenever I get gloomy with the state of the world, I think about the arrivals gate at Heathrow Airport.',
    "General opinion's starting to make out that we live in a world of hatred and greed, but I don't see that.",
    'It seems to me that love is everywhere.',
    "Often it's not particularly dignified or newsworthy, but it's always there - fathers and sons, mothers and daughters, husbands and wives, boyfriends, girlfriends, old friends.",
    'When the planes hit the Twin Towers, as far as I know none of the phone calls from the people on board were messages of hate or revenge - they were all messages of love.',
    "If you look for it, I've got a sneaky feeling you'll find that love actually is...<strong>all around.</strong>",
    "<h1><span class='red'>Happy</span>Christmas</h1>",
  ]

  // type one text in the typwriter
  // keeps calling itself until the text is finished
  function typeWriter(text, i, fnCallback) {
    // chekc if text isn't finished yet
    if (i < text.length) {
      // add next character to h1
      document.querySelector('.quote').innerHTML =
        text.substring(0, i + 1) + '<span aria-hidden="true"></span>'

      // wait for a while and call this function again for next character
      setTimeout(function() {
        typeWriter(text, i + 1, fnCallback)
      }, 100)
    }
    // text finished, call callback if there is a callback function
    else if (typeof fnCallback == 'function') {
      // call callback after timeout
      setTimeout(fnCallback, 700)
    }
  }
  // start a typewriter animation for a text in the dataText array
  function StartTextAnimation(i) {
    if (typeof dataText[i] == 'undefined') {
      setTimeout(function() {
        StartTextAnimation(0)
      }, 20000)
    }
    // check if dataText[i] exists
    if (i < dataText[i].length) {
      // text exists! start typewriter animation
      typeWriter(dataText[i], 0, function() {
        // after callback (and whole text has been animated), start next text
        StartTextAnimation(i + 1)
      })
    }
  }
  // start the text animation
  StartTextAnimation(0)
})
