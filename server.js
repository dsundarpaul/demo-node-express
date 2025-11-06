import bodyParser from "body-parser";
import express from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'this_is_unknown_secret_key'

const app = express();

app.use(bodyParser.json());

const MOCK_USERS = [
  {
    name: 'john',
    password: '123',
    age: 20,
    phone: '1234567890'
  },
  {
    name: 'doe john',
    password: '123456',
    age: 21,
    phone: '1234567890'
  }
]

const authenticateUser = (req, res, next) => {
  const newAuth = req.headers.authorization.split(' ')[1]

  jwt.verify(newAuth, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      next();
    }
  });

}

app.get("/", (req, res) => {
  console.log(req.body)
  res.status(200).json({ message: "Hello World" });

});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = MOCK_USERS.find(user => user.name === name && user.password === password);

  if (user) {
    jwt.sign({ user }, 'this_is_unknown_secret_key', { expiresIn: '1h',  }, (err, token) => {
      if (err) {
        res.status(500).json({ message: 'Error generating token' });
      } else {
        res.status(200).json({ message: 'Login successful', user: { ...user, token } });
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
})

app.get('/users', authenticateUser, (req, res) => {
  res.status(200).json(MOCK_USERS)
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});