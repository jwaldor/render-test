const express = require('express')
const app = express()
let morgan = require('morgan')
app.use(express.json())

let custom_morgan = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
  JSON.stringify(req.body)].join(' ')
})

app.use(custom_morgan)

const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    console.log("error")
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})

app.delete("/api/persons/:id", (request,response) => {
  console.log("persons id")
  let filbook = phonebook.find(p => p.id === request.params.id)
  if (!filbook){
    return response.status(404).end()

  }
  phonebook = phonebook.filter(p => p.id !== request.params.id)
  console.log(filbook)
  console.log(phonebook)
  response.json(filbook)
}
)

// app.delete("/api/persons/:id", (request,response) => {
//   let filbook = phonebook.filter(p => p.id !== request.params.id)
//   if (!filbook){
//     return response.status(404).end()

//   }
//   p
//   console.log(filbook)
//   response.json(filbook)
// }
// )


app.get("/api/persons", (request,response) => {
  response.json(phonebook)

}
)

app.get("/info", (request,response) => {
  const options = {
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZoneName: 'short'
};

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '') + ' ' + date.toLocaleTimeString('en-GB', options).split(' ')[2] + ' (Eastern European Standard Time)';

  response.send(`Phonebook has info for ${phonebook.length} people<br/><br/>${formattedDate}`)

}
)

app.post("/api/persons", (request,response) => {
  console.log("post persons")
  console.log(request.body)
  console.log(phonebook)
  let new_id = Math.floor(Math.random()*10^9)
  console.log(request.body.name)
  console.log(request.body.number)
  if (!(request.body.name && request.body.number)){
    console.log("Error missing fields")
    return response.status(422).send({"error":"Name or number not provided"})
  }
  if (phonebook.find(p => p.name === request.body.name)){
    console.log("Error already in")
    return response.status(409).send({"error":""})
  }
  phonebook = phonebook.concat({ 
    "id": new_id.toString(),
    "name": request.body.name, 
    "number": request.body.number
  })
  response.json(phonebook)
  console.log(phonebook)

}
)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})