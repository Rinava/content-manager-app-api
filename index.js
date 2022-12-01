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

app.get('/api/resources/:id', (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const resource = resources.find((resource) => resource.id === id);
  res.send(resource);
});

app.post('/api/resources', (req, res) => {
  const resources = getResources();
  const newResource = req.body;
  newResource.createdAt = new Date().toLocaleString('en-GB', {
    timeStyle: 'short',
    dateStyle: 'long',
  });
  if (
    newResource.link.lenght > 0 &&
    (!newResource.link.startsWith('http') ||
      !newResource.link.startsWith('https'))
  ) {
    newResource.link = 'http://' + newResource.link;
  }

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

app.put('/api/resources/:id', (req, res) => {
  const resources = getResources();
  const id = req.params.id;
  const resource = resources.find((resource) => resource.id === id);
  if (!resource) {
    return res.status(404).send({ message: 'Resource not found' });
  }
  const updatedResource = req.body;
  const index = resources.indexOf(resource);
  resources[index] = updatedResource;
  fs.writeFileSync(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res
        .status(422)
        .send({ message: 'Cannot update resource in the file' });
    }
    return res.send({
      message: 'Resource updated',
    });
  });
});

app.delete('/api/resources/:id', (req, res) => {
  const resources = getResources();
  const id = req.params.id;
  const resource = resources.find((resource) => resource.id === id);
  if (!resource) {
    return res.status(404).send({ message: 'Resource not found' });
  }
  const index = resources.indexOf(resource);
  resources.splice(index, 1);
  fs.writeFileSync(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res
        .status(422)
        .send({ message: 'Cannot delete resource in the file' });
    }
    return res.send({
      message: 'Resource deleted',
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
