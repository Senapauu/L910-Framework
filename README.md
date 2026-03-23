# L910 Framework

Кастомный веб-фреймворк для Node.js, аналогичный Express.

## Описание

Минималистичный веб-фреймворк, разработанный с нуля без использования сторонних фреймворков. Поддерживает маршрутизацию, middleware и обработку запросов.

## Возможности

- Сервер на Node.js (http модуль)
- Маршрутизация: GET, POST, PUT, PATCH, DELETE
- Поддержка middleware и цепочки middleware
- Объект запроса (req): body, params, query
- Объект ответа (res): send(), json(), status()
- Обработка ошибок

## Запуск

```bash
npm install
npm start
```

Сервер запускается на порту 3000.

## Вариант 9: Лабораторное оборудование и Исследовательские проекты

Две единицы данных с типами: string, number, boolean, Date (Date string), Array

### 1. Лабораторное оборудование (labEquipment.json)

```json
{
  "id": "eq001",
  "name": "Центрифуга лабораторная",
  "manufacturer": "Thermo Fisher",
  "model": "CLS-500",
  "price": 45000,
  "isAvailable": true,
  "purchaseDate": "2023-05-15",
  "specifications": ["5000 об/мин", "емкость 50 мл"],
  "lastMaintenance": "2024-01-10"
}
```

Типы данных:
- id: string (UUID)
- name: string
- manufacturer: string
- model: string
- price: number
- isAvailable: boolean
- purchaseDate: Date string
- specifications: Array
- lastMaintenance: Date string

### 2. Исследовательские проекты (researchProjects.json)

```json
{
  "id": "proj001",
  "title": "Исследование влияния температуры",
  "researcher": "доктор Петренко А.В.",
  "budget": 250000,
  "isActive": true,
  "startDate": "2024-01-15",
  "tags": ["биохимия", "ферментация"],
  "endDate": "2025-12-31"
}
```

Типы данных:
- id: string (UUID)
- title: string
- researcher: string
- budget: number
- isActive: boolean
- startDate: Date string
- tags: Array
- endDate: Date string

## Маршрутизация

### LAB EQUIPMENT

| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | /equipment | Получить всё оборудование |
| GET | /equipment/:id | Получить оборудование по ID |
| POST | /equipment | Создать новое оборудование |
| PUT | /equipment/:id | Редактировать оборудование полностью |
| PATCH | /equipment/:id | Частично редактировать оборудование |
| DELETE | /equipment/:id | Удалить оборудование |

### RESEARCH PROJECTS

| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | /projects | Получить все проекты |
| GET | /projects/:id | Получить проект по ID |
| POST | /projects | Создать новый проект |
| PUT | /projects/:id | Редактировать проект полностью |
| PATCH | /projects/:id | Частично редактировать проект |
| DELETE | /projects/:id | Удалить проект |

## Особенности реализации

### POST /equipment, POST /projects
- Если передан body - используется body-parser
- Если body пустой - генерируются случайные данные

### PUT /equipment/:id, PUT /projects/:id
- Если передан body - используется body-parser  
- Если body пустой - генерируются случайные данные

### PATCH /equipment/:id, PATCH /projects/:id
- Если передан body - используется body-parser (идемпотентно)
- Если body пустой - случайным образом меняется ОДНО поле (НЕ идемпотентно)

## Тестирование

Используйте Postman для тестирования API:

1. GET запросы - для получения данных
2. POST запросы с JSON body - для создания
3. PUT запросы с JSON body - для полного обновления
4. PATCH запросы с JSON body - для частичного обновления
5. DELETE запросы - для удаления

## Структура проекта

```
lr3/
├── data/
│   ├── labEquipment.json
│   └── researchProjects.json
├── src/
│   ├── index.js
│   ├── application.js
│   ├── router.js
│   ├── request.js
│   ├── response.js
│   └── server.js
├── package.json
├── .gitignore
└── README.md
```
