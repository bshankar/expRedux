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
function readValues (id) {
  
}

function updateAmounts () {
  Array.from({ length: state.data.length }, (v, k) => k).map((r) => {
    const last = state.data.length - 1
    if (r !== last) {
      state.data[r][3] = state.data[r][1] * state.data[r][2]
    }
    state.data[last][3] = state.data.slice(0, last).reduce((sum, row) => sum + row[3])
  })
}

const state = {}
state.data = [['rocks', 1, 2, 2], ['pebbles', 5, 3, 15], ['gems', 3, 9, 27], ['total', 9, 14, 44]].map(row => row.reduce((a, e) => a.concat(new Value(e, '', [updateAmounts])), []))

function getRowHtml (r) {
  const row = state.data[r]
  if (state.data.length - 1 !== r) {
    return '<tr><td>' + row[0].value + '</td>' +
    '<td><input onkeyup="readFromInput(r, 1)" value=' + row[1].value + '></input></td>' +
    '<td><input onkeyup="readFromInput(r, 2)" value=' + row[2].value + '></input></td>' +
      '<td>' + row[3].value + '</td></tr>'
  }
  return '<tr><td>' + row[0].value + '</td>' +
    '<td>' + row[1].value + '</td>' +
    '<td>' + row[2].value + '</td>' +
    '<td>' + row[3].value + '</td></tr>'
}

function updateView () {
  document.getElementById('table').innerHTML = '<tr> <th> Name </th> <th> Rate </th><th> Quantity </th><th> Amount </th></tr>' +
    Array.from({ length: state.data.length }, (v, k) => k).reduce((sum, r) => sum + getRowHtml(r), '')
}

updateView()
