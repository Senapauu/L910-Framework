const { Application } = require('./index');
const fs = require('fs');
const path = require('path');

// ============================================
// Data Manager - работа с JSON файлами
// ============================================

const DATA_DIR = path.join(__dirname, 'data');

function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================
// Random Data Generator
// ============================================

const equipmentNames = ['Центрифуга', 'Микроскоп', 'Спектрофотометр', 'Анализатор', 'Деионизатор', 'Автоклав', 'Инкубатор', 'Сушильный шкаф'];
const manufacturers = ['Thermo Fisher', 'Olympus', 'Shimadzu', 'Carl Zeiss', 'Mettler Toledo', 'Sartorius', 'Hettich', 'Eppendorf'];
const modelPrefixes = ['CLS', 'CX', 'UV', 'AZ', 'DS', 'AK', 'IN', 'SU'];
const equipmentSpecs = [
  ['LED дисплей', 'автозапуск', 'таймер'],
  ['увеличение 40-1000x', 'бинокуляр', 'подсветка'],
  ['диапазон 190-1100 нм', 'автосамплер', 'USB'],
  ['точность 0.001', 'скорость 10000 об/мин'],
  ['емкость 10 л', 'фильтрация'],
  ['объем 50 л', 'давление 2 атм'],
  ['температура 37°C', 'влажность 95%'],
  ['температура 200°C', 'вакуум']
];

const projectTitles = ['Исследование', 'Разработка', 'Анализ', 'Создание', 'Изучение', 'Оптимизация', 'Модернизация'];
const researchers = ['доктор Петренко А.В.', 'профессор Сидоренко М.І.', 'ассистент Коваленко О.П.', 'доцент Морозенко В.С.', 'зав. лабораторией Шевченко П.Р.'];
const tags = ['биохимия', 'химия', 'физика', 'микробиология', 'фармакология', 'экология', 'генетика', 'биотехнология'];

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateRandomEquipment(existingNames) {
  const name = equipmentNames[Math.floor(Math.random() * equipmentNames.length)];
  const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  const model = modelPrefixes[Math.floor(Math.random() * modelPrefixes.length)] + '-' + Math.floor(Math.random() * 900 + 100);
  const specs = equipmentSpecs[Math.floor(Math.random() * equipmentSpecs.length)];
  
  const year = 2020 + Math.floor(Math.random() * 5);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  const mYear = 2024;
  const mMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const mDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  return {
    id: generateUUID(),
    name: name + ' ' + manufacturer,
    manufacturer: manufacturer,
    model: model,
    price: Math.floor(Math.random() * 150000) + 10000,
    isAvailable: Math.random() > 0.3,
    purchaseDate: `${year}-${month}-${day}`,
    specifications: specs,
    lastMaintenance: `${mYear}-${mMonth}-${mDay}`
  };
}

function generateRandomProject() {
  const title = projectTitles[Math.floor(Math.random() * projectTitles.length)] + ' ' + 
    [' нового препарата', ' влияния факторов', ' загрязнений', ' реакции', ' процесса', ' метода', ' соединения'][Math.floor(Math.random() * 7)];
  const researcher = researchers[Math.floor(Math.random() * researchers.length)];
  const budget = Math.floor(Math.random() * 500000) + 50000;
  
  const year = 2022 + Math.floor(Math.random() * 4);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  const endYear = year + Math.floor(Math.random() * 3) + 1;
  
  const selectedTags = [];
  const numTags = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < numTags; i++) {
    const tag = tags[Math.floor(Math.random() * tags.length)];
    if (!selectedTags.includes(tag)) selectedTags.push(tag);
  }
  
  return {
    id: generateUUID(),
    title: title,
    researcher: researcher,
    budget: budget,
    isActive: Math.random() > 0.3,
    startDate: `${year}-${month}-${day}`,
    tags: selectedTags,
    endDate: `${endYear}-${month}-${day}`
  };
}

// ============================================
// Create application
// ============================================

const app = new Application();

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// LAB EQUIPMENT ROUTES
// ============================================

// GET /equipment - получить всё оборудование
app.get('/equipment', (req, res) => {
  try {
    const equipment = readJsonFile('labEquipment.json');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// GET /equipment/:id - получить оборудование по ID
app.get('/equipment/:id', (req, res) => {
  try {
    const equipment = readJsonFile('labEquipment.json');
    const item = equipment.find(e => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Оборудование не найдено' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// POST /equipment - создать новое оборудование
app.post('/equipment', (req, res) => {
  try {
    const equipment = readJsonFile('labEquipment.json');
    let newItem;
    
    if (req.body && Object.keys(req.body).length > 0) {
      newItem = {
        id: generateUUID(),
        name: req.body.name || 'Оборудование',
        manufacturer: req.body.manufacturer || 'Unknown',
        model: req.body.model || 'M-000',
        price: req.body.price || 10000,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
        purchaseDate: req.body.purchaseDate || new Date().toISOString().split('T')[0],
        specifications: req.body.specifications || [],
        lastMaintenance: req.body.lastMaintenance || new Date().toISOString().split('T')[0]
      };
    } else {
      newItem = generateRandomEquipment(equipment.map(e => e.name));
    }
    
    equipment.push(newItem);
    writeJsonFile('labEquipment.json', equipment);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания оборудования' });
  }
});

// PUT /equipment/:id - редактировать оборудование полностью
app.put('/equipment/:id', (req, res) => {
  try {
    const equipment = readJsonFile('labEquipment.json');
    const index = equipment.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Оборудование не найдено' });
    }
    
    let updatedItem;
    if (req.body && Object.keys(req.body).length > 0) {
      updatedItem = {
        id: req.params.id,
        name: req.body.name || equipment[index].name,
        manufacturer: req.body.manufacturer || equipment[index].manufacturer,
        model: req.body.model || equipment[index].model,
        price: req.body.price || equipment[index].price,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : equipment[index].isAvailable,
        purchaseDate: req.body.purchaseDate || equipment[index].purchaseDate,
        specifications: req.body.specifications || equipment[index].specifications,
        lastMaintenance: req.body.lastMaintenance || equipment[index].lastMaintenance
      };
    } else {
      updatedItem = generateRandomEquipment([]);
      updatedItem.id = req.params.id;
    }
    
    equipment[index] = updatedItem;
    writeJsonFile('labEquipment.json', equipment);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления оборудования' });
  }
});

// PATCH /equipment/:id - частично редактировать оборудование
app.patch('/equipment/:id', (req, res) => {
  try {
    const equipment = readJsonFile('labEquipment.json');
    const index = equipment.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Оборудование не найдено' });
    }
    
    const item = equipment[index];
    
    if (req.body && Object.keys(req.body).length > 0) {
      if (req.body.name !== undefined) item.name = req.body.name;
      if (req.body.manufacturer !== undefined) item.manufacturer = req.body.manufacturer;
      if (req.body.model !== undefined) item.model = req.body.model;
      if (req.body.price !== undefined) item.price = req.body.price;
      if (req.body.isAvailable !== undefined) item.isAvailable = req.body.isAvailable;
      if (req.body.purchaseDate !== undefined) item.purchaseDate = req.body.purchaseDate;
      if (req.body.specifications !== undefined) item.specifications = req.body.specifications;
      if (req.body.lastMaintenance !== undefined) item.lastMaintenance = req.body.lastMaintenance;
    } else {
      // Рандомное обновление (не идемпотентное)
      const fieldsToUpdate = ['price', 'isAvailable', 'model'];
      const field = fieldsToUpdate[Math.floor(Math.random() * fieldsToUpdate.length)];
      
      if (field === 'price') {
        item.price = Math.floor(Math.random() * 150000) + 10000;
      } else if (field === 'isAvailable') {
        item.isAvailable = !item.isAvailable;
      } else if (field === 'model') {
        item.model = modelPrefixes[Math.floor(Math.random() * modelPrefixes.length)] + '-' + Math.floor(Math.random() * 900 + 100);
      }
    }
    
    equipment[index] = item;
    writeJsonFile('labEquipment.json', equipment);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка частичного обновления' });
  }
});

// DELETE /equipment/:id - удалить оборудование
app.delete('/equipment/:id', (req, res) => {
  try {
    const equipment = readJsonFile('labEquipment.json');
    const index = equipment.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Оборудование не найдено' });
    }
    
    const deleted = equipment.splice(index, 1)[0];
    writeJsonFile('labEquipment.json', equipment);
    res.json({ message: 'Оборудование удалено', item: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

// ============================================
// RESEARCH PROJECTS ROUTES
// ============================================

// GET /projects - получить все проекты
app.get('/projects', (req, res) => {
  try {
    const projects = readJsonFile('researchProjects.json');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// GET /projects/:id - получить проект по ID
app.get('/projects/:id', (req, res) => {
  try {
    const projects = readJsonFile('researchProjects.json');
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка чтения данных' });
  }
});

// POST /projects - создать новый проект
app.post('/projects', (req, res) => {
  try {
    const projects = readJsonFile('researchProjects.json');
    let newProject;
    
    if (req.body && Object.keys(req.body).length > 0) {
      newProject = {
        id: generateUUID(),
        title: req.body.title || 'Новое исследование',
        researcher: req.body.researcher || 'Unknown',
        budget: req.body.budget || 100000,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        startDate: req.body.startDate || new Date().toISOString().split('T')[0],
        tags: req.body.tags || [],
        endDate: req.body.endDate || null
      };
    } else {
      newProject = generateRandomProject();
    }
    
    projects.push(newProject);
    writeJsonFile('researchProjects.json', projects);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания проекта' });
  }
});

// PUT /projects/:id - редактировать проект полностью
app.put('/projects/:id', (req, res) => {
  try {
    const projects = readJsonFile('researchProjects.json');
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    let updatedProject;
    if (req.body && Object.keys(req.body).length > 0) {
      updatedProject = {
        id: req.params.id,
        title: req.body.title || projects[index].title,
        researcher: req.body.researcher || projects[index].researcher,
        budget: req.body.budget || projects[index].budget,
        isActive: req.body.isActive !== undefined ? req.body.isActive : projects[index].isActive,
        startDate: req.body.startDate || projects[index].startDate,
        tags: req.body.tags || projects[index].tags,
        endDate: req.body.endDate || projects[index].endDate
      };
    } else {
      updatedProject = generateRandomProject();
      updatedProject.id = req.params.id;
    }
    
    projects[index] = updatedProject;
    writeJsonFile('researchProjects.json', projects);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления проекта' });
  }
});

// PATCH /projects/:id - частично редактировать проект
app.patch('/projects/:id', (req, res) => {
  try {
    const projects = readJsonFile('researchProjects.json');
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    const project = projects[index];
    
    if (req.body && Object.keys(req.body).length > 0) {
      if (req.body.title !== undefined) project.title = req.body.title;
      if (req.body.researcher !== undefined) project.researcher = req.body.researcher;
      if (req.body.budget !== undefined) project.budget = req.body.budget;
      if (req.body.isActive !== undefined) project.isActive = req.body.isActive;
      if (req.body.startDate !== undefined) project.startDate = req.body.startDate;
      if (req.body.tags !== undefined) project.tags = req.body.tags;
      if (req.body.endDate !== undefined) project.endDate = req.body.endDate;
    } else {
      // Рандомное обновление (не идемпотентное)
      const fieldsToUpdate = ['budget', 'isActive', 'title'];
      const field = fieldsToUpdate[Math.floor(Math.random() * fieldsToUpdate.length)];
      
      if (field === 'budget') {
        project.budget = Math.floor(Math.random() * 500000) + 50000;
      } else if (field === 'isActive') {
        project.isActive = !project.isActive;
      } else if (field === 'title') {
        project.title = projectTitles[Math.floor(Math.random() * projectTitles.length)] + ' ' + 
          [' нового препарата', ' влияния факторов', ' загрязнений'][Math.floor(Math.random() * 3)];
      }
    }
    
    projects[index] = project;
    writeJsonFile('researchProjects.json', projects);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка частичного обновления' });
  }
});

// DELETE /projects/:id - удалить проект
app.delete('/projects/:id', (req, res) => {
  try {
    const projects = readJsonFile('researchProjects.json');
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    const deleted = projects.splice(index, 1)[0];
    writeJsonFile('researchProjects.json', projects);
    res.json({ message: 'Проект удален', project: deleted });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

// ============================================
// Start server
// ============================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`L910 Framework server running on http://localhost:${PORT}`);
  console.log('');
  console.log('=== ROUTING ===');
  console.log('');
  console.log('LAB EQUIPMENT:');
  console.log('  GET    /equipment');
  console.log('  GET    /equipment/:id');
  console.log('  POST   /equipment');
  console.log('  PUT    /equipment/:id');
  console.log('  PATCH  /equipment/:id');
  console.log('  DELETE /equipment/:id');
  console.log('');
  console.log('RESEARCH PROJECTS:');
  console.log('  GET    /projects');
  console.log('  GET    /projects/:id');
  console.log('  POST   /projects');
  console.log('  PUT    /projects/:id');
  console.log('  PATCH  /projects/:id');
  console.log('  DELETE /projects/:id');
});
