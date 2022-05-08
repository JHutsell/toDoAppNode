let express = require('express')
let {MongoClient, ObjectId} = require('mongodb')
//destructuring
let sanitizeHTML = require('sanitize-html')

let app = express()
let db

app.use(express.static('public'))

async function start() {
  let client = new MongoClient('mongodb+srv://toDoAppUser:1234@cluster0.kiyed.mongodb.net/TodoApp?retryWrites=true&w=majority')
  await client.connect()
  db = client.db()
  app.listen(3000)
}

start()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next) {
  res.set("WWW-authenticate", 'Basic realm="Simple To Do App"')
  //console.log(req.headers.authorization)
  // username: learn password: javascript
  if (req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") {
    next()
  } else {
    res.status(401).send("Authentication required")
  }
}

app.use(passwordProtected)
app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) => {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">To-Do App</h1>
      
      <div class="jumbotron p-3 shadow-sm">
        <form id="create-form" action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul id="item-list" class="list-group pb-5">
        
      </ul>
      
    </div>
  
  <script>
    let items = ${JSON.stringify(items)}
  </script>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>  
  <script src="/browser.js"></script>
  </body>
  </html>`)
  })
  
})

app.post('/create-item', (req, res) => {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').insertOne({text: safeText}, (err, info) => {
    res.json({_id: info.insertId, text: safeText})
  })
})

app.post('/update-item', (req, res) => {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text: safeText}}, () => {
    res.send("SUCCESS")
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({_id: new ObjectId(req.body.id)}, () => {
    res.send("SUCCESS")
  })
})

