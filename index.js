const express = require('express');
const app = express();
const PORT = 3001;
const fs = require('fs');
const path = require('path');
const pathToFile = path.resolve('./data.json');
const { v4: uuidv4 } = require('uuid');

const getResources = () => JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/resources', (req, res) => {
  const resources = getResources();
  res.send(resources);
});

app.post('/api/resources', (req, res) => {
  const resources = getResources();
  const newResource = req.body;
  newResource.createdAt = new Date();
  newResource.status = 'inactive';
  newResource.id = uuidv4();
  resources.push(newResource);

  fs.writeFileSync(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res
        .status(422)
        .send({ message: 'Cannot store resource in the file' });
    }
    return res.send({
      message: 'Resource added',
    });
  });
});

app.get('/api/resources/:id', (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const resource = resources.find((resource) => resource.id === id);
  res.send(resource);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
