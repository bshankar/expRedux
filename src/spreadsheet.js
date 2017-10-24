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
const data = [['rocks', 1, 2, 2], ['pebbles', 5, 3, 15], ['gems', 3, 9, 27], ['total', '', '', 44]].map(row => row.reduce((a, e) => a.concat(new Value(e)), []))

function getRowHtml(row) {
  return '<tr>' + row.map(e => e.value).reduce((sum, e) => sum + '<td> <input value=' + e + '></input></td>', '') + '</tr>'
}

console.log(getRowHtml(data[0]))

document.getElementById('table').innerHTML = '<tr> <th> Name </th> <th> Rate </th><th> Quantity </th><th> Amount </th></tr>' +
      data.map(getRowHtml).reduce((sum, e) => sum + '<tr>' + e + '</tr>')

// set up subscribers
