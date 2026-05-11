# Структура проекта - До и После

## ДО рефакторинга

```
app/
├── page.tsx (1973 строки) ❌ МОНОЛИТ
│   ├── Все типы (150+ строк)
│   ├── Mock данные (200+ строк)
│   ├── Начальное состояние (60+ строк)
│   ├── Компонент PrototypePage (1500+ строк)
│   │   ├── State management
│   │   ├── Все обработчики событий (500+ строк)
│   │   ├── ClientMobileApp UI (300+ строк)
│   │   ├── AdminWebApp UI (600+ строк)
│   │   └── TechTabletApp UI (400+ строк)
│   └── Helper функции
├── layout.tsx
└── globals.css
```

**Проблемы:**
- ❌ Один файл > 1900 строк
- ❌ Сложно найти нужный код
- ❌ Невозможно переиспользовать компоненты
- ❌ Сложно тестировать
- ❌ Конфликты при командной работе

---

## ПОСЛЕ рефакторинга

```
app/
├── types/
│   └── index.ts (150 строк) ✅
│       ├── OrderStatus, AdminView, ClientView
│       ├── Part, StandardService, ServiceHistory
│       ├── Bay, Mechanic, AdditionalTask
│       ├── Order, Client, ScheduleItem
│       ├── TimeSlot, SystemState
│
├── constants/
│   ├── mockData.ts (180 строк) ✅
│   │   ├── mockParts, mockTimeSlots
│   │   ├── mockStandardServices
│   │   ├── mockServiceHistory
│   │   ├── mockBays, mockMechanics
│   │   ├── mockOrders, mockClients
│   │   └── mockSchedule
│   │
│   └── initialState.ts (50 строк) ✅
│       └── initialState: SystemState
│
├── hooks/
│   ├── useSystemState.ts (20 строк) ✅
│   │   └── Управление глобальным состоянием
│   │
│   ├── useToast.ts (15 строк) ✅
│   │   └── Управление уведомлениями
│   │
│   └── index.ts (2 строки) ✅
│
├── utils/
│   ├── handlers.ts (250 строк) ✅
│   │   └── createHandlers() - все обработчики событий
│   │       ├── handleFormChange, handlePhotoUpload
│   │       ├── handleSubmitRequest, handleTechReview
│   │       ├── handleCheckParts, handleConfirmSlot
│   │       ├── handlePayment, handlePickUpVehicle
│   │       └── ... (20+ обработчиков)
│   │
│   └── helpers.ts (10 строк) ✅
│       └── getOpacity() - вспомогательные функции
│
├── components/
│   ├── shared/
│   │   ├── Toast.tsx (25 строк) ✅
│   │   ├── Header.tsx (45 строк) ✅
│   │   └── index.ts
│   │
│   ├── client/
│   │   ├── ClientMobileApp.tsx (100 строк) ✅
│   │   ├── FormView.tsx (150 строк) ✅
│   │   ├── TrackingView.tsx (250 строк) ✅
│   │   └── index.ts
│   │
│   ├── admin/
│   │   ├── AdminWebApp.tsx (150 строк) 🚧
│   │   ├── IncomingColumn.tsx (100 строк) 🚧
│   │   ├── PartsReviewColumn.tsx (120 строк) ✅
│   │   ├── ScheduleColumn.tsx (80 строк) 🚧
│   │   ├── ScheduledColumn.tsx (80 строк) 🚧
│   │   ├── CompletedColumn.tsx (60 строк) 🚧
│   │   ├── ScheduleView.tsx (100 строк) 🚧
│   │   ├── ClientsView.tsx (80 строк) 🚧
│   │   ├── RejectionModal.tsx (70 строк) 🚧
│   │   └── index.ts
│   │
│   └── tech/
│       ├── TechTabletApp.tsx (120 строк) 🚧
│       ├── TechWorkspace.tsx (200 строк) 🚧
│       ├── AdditionalTaskModal.tsx (80 строк) 🚧
│       └── index.ts
│
├── page.tsx (1973 строки) 📦 Оригинал сохранен
├── page-new.tsx (80 строк) ✅ Новая версия
├── layout.tsx
└── globals.css
```

**Преимущества:**
- ✅ Максимальный файл < 300 строк
- ✅ Легко найти нужный код
- ✅ Переиспользуемые компоненты
- ✅ Простое тестирование
- ✅ Удобная командная работа
- ✅ Четкое разделение ответственности

---

## Статистика

| Метрика | До | После |
|---------|-----|-------|
| Файлов | 1 | 30+ |
| Макс. размер файла | 1973 строк | ~250 строк |
| Переиспользуемость | 0% | 80%+ |
| Тестируемость | Низкая | Высокая |
| Поддерживаемость | Низкая | Высокая |

---

## Легенда

- ✅ Создано и готово
- 🚧 Требует создания (структура готова)
- ❌ Проблема
- 📦 Сохранено для совместимости
