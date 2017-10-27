class Value {
  constructor (value = null, prev = null, subscribers = [], defaultValue = '') {
    this._value = value
    this.prev = prev
    this.subscribers = subscribers
    this.defaultValue = defaultValue
  }

  get value () {
    return this._value
  }

  set value (value) {
    state.prev = JSON.parse(JSON.stringify(state))
    this.prev = this._value
    this._value = value || this.defaultValue
    this.subscribers.forEach(f => f())
  }

  subscribe (f) {
    this.subscribers.push(f)
  }
}

// example
const state = {}
const data = [['rocks', 1, 2, 2], ['pebbles', 5, 3, 15], ['gems', 3, 9, 27], ['total', 9, 14, 44]]
state.data = data.map((row, r) => row.map((val, c) => {
  const subs = (r !== data.length - 1 && c !== 3) ? [() => updateAmount(r, c)] : []
  return new Value(data[r][c], '', subs, 0)
}))

function toId (r, c) {
  return r * state.data.length + c
}

function readInput (r, c) {
  state.data[r][c].value = document.getElementById(toId(r, c)).value
  console.log(state.prev.prev.prev.prev)
}

function updateAmount (r, c) {
  const last = state.data.length - 1
  state.data[r][3].value = state.data[r][1].value * state.data[r][2].value
  state.data[last][c].value = state.data.slice(0, last).reduce((sum, row) => sum + parseInt(row[c].value), 0)
  state.data[last][3].value = state.data.slice(0, last).reduce((sum, row) => sum + parseInt(row[3].value), 0)
  updateView(r, c)
}

function getRowHtml (r) {
  const row = state.data[r]
  if (state.data.length - 1 !== r) {
    return '<tr><td>' + row[0].value + '</td>' +
      '<td><input onkeyup="readInput(' + r + ', 1)" id="' + toId(r, 1) +
      '" value=' + row[1].value + '></input></td>' +
      '<td><input onkeyup="readInput(' + r + ', 2)" id="' + toId(r, 2) +
      '" value=' + row[2].value + '></input></td>' +
      '<td id="' + (r * state.data.length + 3) + '">' + row[3].value + '</td></tr>'
  }
  return '<tr><td>' + row[0].value + '</td>' +
    '<td id="' + toId(r, 1) + '">' + row[1].value + '</td>' +
    '<td id="' + toId(r, 2) + '">' + row[2].value + '</td>' +
    '<td id="' + toId(r, 3) + '">' + row[3].value + '</td></tr>'
}

function updateView (r, c) {
  if (r === undefined) {
    document.getElementById('table').innerHTML = '<tr> <th> Name </th> <th> Rate </th><th> Quantity </th><th> Amount </th></tr>' +
      Array.from({ length: state.data.length }, (v, k) => k).reduce((sum, r) => sum + getRowHtml(r), '')
  } else {
    const last = state.data.length - 1
    document.getElementById(toId(r, 3)).innerHTML = state.data[r][3].value
    document.getElementById(toId(last, c)).innerHTML = state.data[last][c].value
    document.getElementById(toId(last, 3)).innerHTML = state.data[last][3].value
  }
}

updateView()
