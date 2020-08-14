class WordManager {
  constructor(arg) {
    let _  // Fuck you JavaScript...
    for (_ in arg) this[_] = arg[_];

    if (!arg.words) this.words = new Array('foo', 'bar')
    if (!arg.render_text) this.render_text = "render-text"

    this.wordcount = 0
    this.raw_charcount = 0
    this.charcount = 0
    this.seconds = 0
    this.errors = 0
    this.character_length = 45

    this.letters = null
    this.interval_timer = null

    this.index = 0
    this.started = false
  }

  current_string() {
    return this.letters.substring(
      this.index, this.index + this.character_length
    )
  }

  render() {
    let words_selected = new Array()
    for (var i = 0; i < 300; i++) {
      words_selected.push(this.words[
        Math.floor(Math.random() * this.words.length)
      ])
    }

    let input_el = document.getElementById(this.render_text)
    this.letters = words_selected.join(" ")
    input_el.innerText = this.current_string()
  }

  start() {
    let self = this
    self.interval_timer = setInterval(function(){
      self.seconds++
      document.getElementById("seconds").innerText = 60 - self.seconds
      let wpm = Math.round(self.wordcount / (self.seconds / 60))
      let cpm = Math.round(self.charcount / (self.seconds /60))
      document.getElementById("wpm").innerText = wpm
      document.getElementById("cpm").innerText = cpm

      console.log(self.seconds)
      console.log(self.wordcount)
      if (self.seconds >= 60) self.stop()
    }, 1000)
  }

  stop() {
    clearInterval(this.interval_timer)
    this.started = false
  }

  reset() {
    this.stop()
    this.wordcount = 0
    this.raw_charcount = 0
    this.charcount = 0
    this.seconds = 0
    this.errors = 0

    this.letters = null
    this.interval_timer = null

    this.index = 0
    this.started = false

    document.getElementById(this.render_text).innerText = ""
    document.getElementById("your-attempt").innerText = ""
    document.getElementById("seconds").innerText = 60
    document.getElementById("wpm").innerText = 0
    document.getElementById("errors").innerText = 0

    this.render()
  }

  keypress(el, event) {
    if (this.seconds >= 60) return

    if (!this.started) {
      this.start()
      this.started = true
      console.log("Started")
    }

    let char_typed = String.fromCharCode(
      event.which || event.key_code
    )
    console.log(char_typed)

    if (char_typed == this.letters.charAt(this.index)) {
      console.log("IF: true")
      if (char_typed == " ") {
        this.wordcount++
      }

      this.index++
      this.charcount++
      this.raw_charcount++

      let input_el = document.getElementById(this.render_text)
      input_el.innerText = this.current_string()
      el.innerHTML += char_typed
    } else {
      console.log("IF: false")

      this.errors++
      this.raw_charcount++

      el.innerHTML += `<span class="wrong">${char_typed}</span>`

      let errors_el = document.getElementById("errors")
      errors_el.innerText = this.errors

      let green = 255 - (this.errors * 5)
      errors_el.style.color = `rgb(255, ${green}, 0)`
    }
  }
}
