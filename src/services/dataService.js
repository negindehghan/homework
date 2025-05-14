const fs = require('fs').promises;
const path = require('path');

class DataService {
    constructor(fileName) {
        this.filePath = path.join(__dirname, '../../data', fileName);
    }

    async getAll() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async create(item) {
        const items = await this.getAll();
        const newItem = {
            id: Date.now().toString(),
            ...item,
            createdAt: new Date().toISOString()
        };
        items.push(newItem);
        await fs.writeFile(this.filePath, JSON.stringify(items, null, 2));
        return newItem;
    }

    async update(id, updates) {
        const items = await this.getAll();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;
        
        items[index] = {
            ...items[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await fs.writeFile(this.filePath, JSON.stringify(items, null, 2));
        return items[index];
    }

    async delete(id) {
        const items = await this.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        await fs.writeFile(this.filePath, JSON.stringify(filteredItems, null, 2));
    }
}

module.exports = DataService; 