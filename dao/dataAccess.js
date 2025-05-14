const fs = require('fs').promises;
const path = require('path');

class DataAccess {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  async readFile(fileName) {
    try {
      const filePath = path.join(this.dataDir, fileName);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeFile(fileName, data) {
    const filePath = path.join(this.dataDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll(fileName) {
    return this.readFile(fileName);
  }

  async getById(fileName, id) {
    const items = await this.readFile(fileName);
    return items.find(item => item.id === id);
  }

  async create(fileName, item) {
    const items = await this.readFile(fileName);
    const newItem = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    await this.writeFile(fileName, items);
    return newItem;
  }

  async update(fileName, id, updates) {
    const items = await this.readFile(fileName);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    items[index] = updatedItem;
    await this.writeFile(fileName, items);
    return updatedItem;
  }

  async delete(fileName, id) {
    const items = await this.readFile(fileName);
    const filteredItems = items.filter(item => item.id !== id);
    if (filteredItems.length === items.length) return false;
    await this.writeFile(fileName, filteredItems);
    return true;
  }

  async findByField(fileName, field, value) {
    const items = await this.readFile(fileName);
    return items.filter(item => item[field] === value);
  }
}

module.exports = new DataAccess(path.join(__dirname, '../data')); 