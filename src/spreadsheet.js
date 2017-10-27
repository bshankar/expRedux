class Value {
  constructor (value, prev, subscribers) {
    this._value = String(value || null)
    this.prev = null
    this.subscribers = subscribers ? [...subscribers] : []
  }

  get value () {
    return this._value
  }

  set value (value) {
    this._value = value
    this.subscribers.map(f => f())
  }

  subscribe (f) {
    this.subscribers.push(f)
  }
}

const addProp = (parent, prop, value) => {
  var val = new Value(value, null)
  Object.defineProperty(parent, prop, {
    get: function () { return val.value },
    set: function (v) {
      val.value = v
    }
  })
}

// example
const state = {}
state.data = [['rocks', 1, 2, 2], ['pebbles', 5, 3, 15], ['gems', 3, 9, 27], ['total', 9, 14, 44]]

for (let r = 0; r < state.data.length; r++) {
  for (let c = 0; c < 4; c++) {
    if (r !== state.data.length - 1 && c !== 3) {
      state.data[r][c] = new Value(state.data[r][c], '', [() => updateAmount(r, c)])
    } else {
      state.data[r][c] = new Value(state.data[r][c], '')
    }
  }
}

function toId (r, c) {
  return r * state.data.length + c
}

function readInput (r, c) {
  state.data[r][c].value = document.getElementById(toId(r, c)).value
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
