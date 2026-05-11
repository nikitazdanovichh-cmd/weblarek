# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/Models/ — папка с моделями данных

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
---

## Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме **MVP (Model-View-Presenter)**, которая обеспечивает четкое разделение ответственности между классами:

* **Model** — слой данных, отвечает за хранение и изменение данных.
* **View** — слой представления, отвечает за отображение данных на странице и реакцию на действия пользователя.
* **Presenter** — содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события, используя методы как Моделей, так и Представлений.

---

## Базовый код

### Класс `Component<T>`

Базовый класс для всех компонентов интерфейса. Является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render`.

* **Конструктор:** `constructor(protected readonly container: HTMLElement)` — принимает ссылку на DOM-элемент контейнера.
* **Методы:** 
* `render(data?: Partial<T>): HTMLElement` — записывает данные в поля класса через сеттеры и возвращает корневой элемент.
* `setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для установки изображений.



### Класс `Api`

Содержит в себе базовую логику отправки запросов.

* **Конструктор:** `constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый URL и опциональные настройки запроса.
* **Методы:** 
* `get(uri: string): Promise<object>` — выполняет GET-запрос.
* `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — выполняет POST/PUT/DELETE-запросы.
* `protected handleResponse(response: Response): Promise<object>` — проверяет ответ сервера на корректность.



### Класс `EventEmitter`

Брокер событий, реализующий паттерн "Наблюдатель". Используется для связи слоя данных и представления.

* **Методы:**
* `on<T extends object>(eventName: EventName, callback: (event: T) => void)` — подписка на событие.
* `emit<T extends object>(eventName: string, data?: T)` — инициализация события.
* `trigger<T extends object>(eventName: string, context?: Partial<T>)` — возвращает функцию, при вызове которой генерируется требуемое событие.



---

## Слой коммуникации (API)

### Класс `LarekApi`

Расширяет базовый класс `Api`. Отвечает за конкретные эндпоинты проекта.

* **Конструктор:** `constructor(cdn: string, baseUrl: string, options?: RequestInit)`
* **Методы:** 
* `getProductList(): Promise<IProduct[]>` — получение каталога товаров.
* `orderProducts(order: IOrder): Promise<IOrderResult>` — отправка данных заказа на сервер.



---

## Данные и модели данных (Model)

### Интерфейсы данных

* `IProduct` — описывает структуру товара: `id` (строка), `description` (строка), `image` (строка), `title` (строка), `category` (строка), `price` (число или null).
* `IBuyer` — данные покупателя: `payment` (строка), `email` (строка), `phone` (строка), `address` (строка).

### Класс `CatalogModel`

Хранение массива товаров и управление предпросмотром.

* **Методы:**
* `setItems(items: IProduct[]): void` — сохранить список товаров.
* `getItems(): IProduct[]` — получить список товаров.
* `getItem(id: string): IProduct` — найти товар по id.
* `setPreview(item: IProduct): void` — выбрать товар для модалки предпросмотра.
* `getPreview(): IProduct | null` — получить выбранный товар.



### Класс `BasketModel`

Управляет товарами в корзине покупателя.

* **Методы:**
* `addItem(item: IProduct): void` — добавить товар.
* `removeItem(id: string): void` — удалить товар.
* `clear(): void` — очистить корзину.
* `getTotal(): number` — получить общую стоимость (игнорируя бесценные товары).
* `getCount(): number` — получить количество товаров.
* `isInBasket(id: string): boolean` — проверить наличие товара в корзине.



### Класс `BuyerModel`

Хранит данные формы покупателя и отвечает за их валидацию.

* **Методы:**
* `setField(field: keyof IBuyer, value: string): void` — сохранение значения поля.
* `getData(): IBuyer` — получение всех данных покупателя.
* `clear(): void` — очистка данных.
* `validate(): Record<keyof IBuyer, string>` — проверка заполненности данных. Возвращает объект с текстом ошибок.



---

## Слой представления (View)

Все классы представления наследуются от базового класса `Component`.

### Класс `Modal`

Контейнер для модальных окон. Управляет отображением контента и закрытием по клику/Esc.

* **Поля:** `_closeButton: HTMLButtonElement`, `_content: HTMLElement`.
* **Конструктор:** `constructor(container: HTMLElement, events: IEvents)`
* **Методы/Сеттеры:**
* `set content(value: HTMLElement)` — вставляет элемент в контентную область.
* `open(): void` — открывает модальное окно.
* `close(): void` — закрывает модальное окно.



### Класс `Form`

Базовый класс для всех форм. Управляет валидацией, отображением ошибок и активностью кнопки submit.

* **Поля:** `_submit: HTMLButtonElement`, `_errors: HTMLElement`.
* **Конструктор:** `constructor(protected container: HTMLFormElement, protected events: IEvents)`
* **Методы/Сеттеры:**
* `protected onInputChange(field: keyof T, value: string)` — обрабатывает ввод данных.
* `set valid(value: boolean)` — переключает состояние блокировки кнопки сабмита.
* `set errors(value: string)` — устанавливает текст ошибки.
* `render(state: Partial<T> & IFormState)` — рендерит состояние формы.



### Класс `Contacts`

Наследуется от `Form`. Отвечает за форму контактных данных.

* **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents)`
* **Сеттеры:** 
* `set phone(value: string)` — устанавливает значение в input телефона.
* `set email(value: string)` — устанавливает значение в input почты.



### Класс `Order`

Наследуется от `Form`. Отвечает за форму выбора оплаты и ввода адреса.

* **Поля:** Коллекция кнопок способа оплаты.
* **Конструктор:** `constructor(container: HTMLFormElement, events: IEvents)`
* **Сеттеры:**
* `set address(value: string)` — устанавливает значение в input адреса.
* `set payment(name: string)` — управляет выделением активной кнопки способа оплаты.



### Классы карточек (Card)

Базовый класс **`Card`** содержит общие элементы (заголовок, цена).

* **Поля:** `titleElement: HTMLElement`, `priceElement: HTMLElement`.
* **Конструктор:** `constructor(blockName: string, container: HTMLElement)`
* **Сеттеры:** `set title(value: string)`, `set price(value: number | null)`.

**Наследники:**

* **`CardCatalog`** — карточка для главной страницы.
* *Поля:* `imageElement`, `categoryElement`.
* *Сеттеры:* `category`, `image`.


* **`CardPreview`** — детальное описание товара в модалке предпросмотра. Наследуется от `CardCatalog`.
* *Поля:* `textElement`, `buttonElement`.
* *Сеттеры:* `description`, `buttonText`, `disabled` (блокировка кнопки).


* **`CardBasket`** — компактная строка в корзине.
* *Поля:* `indexElement`, `buttonElement` (кнопка удаления).
* *Сеттеры:* `index`.



### Класс `Basket`

Отвечает за отображение списка товаров в корзине и итоговой стоимости.

* **Поля:** `listElement: HTMLElement`, `totalElement: HTMLElement`, `buttonElement: HTMLButtonElement`.
* **Конструктор:** `constructor(container: HTMLElement, protected events: IEvents)`
* **Сеттеры:**
* `set items(items: HTMLElement[])` — рендерит карточки. При пустом массиве выводит «Корзина пуста».
* `set total(total: number)` — выводит итоговую сумму.
* `set valid(value: boolean)` — блокирует/разблокирует кнопку «Оформить».



### Компоненты страницы (Header и Gallery)

* **`Header`** — управляет счетчиком товаров на иконке корзины.
* *Конструктор:* `constructor(protected events: IEvents, container: HTMLElement)`
* *Сеттер:* `set counter(value: number)`.


* **`Gallery`** — отвечает за вывод сетки карточек на главной странице.
* *Конструктор:* `constructor(container: HTMLElement)`
* *Сеттер:* `set catalog(items: HTMLElement[])` — заменяет содержимое контейнера новыми элементами.



### Класс `Success`

Отвечает за отображение модального окна успешного заказа.

* **Поля:** `_close: HTMLButtonElement`, `_total: HTMLElement`.
* **Конструктор:** `constructor(container: HTMLElement, actions: ISuccessActions)`
* **Сеттеры:** `set total(value: number)` — выводит списанную сумму синапсов.

---

## Список событий в приложении

**View -> Presenter (Пользовательские действия):**

* `card:select` — клик по карточке в галерее, открытие превью.
* `card:toBasket` — добавление/удаление товара в окне превью.
* `basket:open` — клик по иконке корзины в шапке.
* `basket:removeFromBasket` — клик по иконке удаления в карточке корзины.
* `order:open` — переход к оформлению заказа из корзины.
* `order:submit` — переход к вводу контактов.
* `contacts:submit` — отправка заказа на сервер.
* `^order\..*:change` / `^contacts\..*:change` — регулярное выражение для событий изменения полей в формах.

**Model -> Presenter (Обновление данных):**

* `catalog:changed` — данные каталога обновлены сервером.
* `preview:changed` — выбран новый товар для модалки.
* `basket:changed` — изменился состав корзины.
* `buyer:changed` — обновились данные покупателя (триггерит валидацию).

## Взаимодействие слоев (Презентер)

Роль Презентера выполняет скрипт `src/main.ts`. Он инициализирует экземпляры моделей и представлений, а затем связывает их с помощью брокера событий (`EventEmitter`). В обработчиках событий (колбэках) Презентер вызывает методы слоев данных и передает измененные данные в методы рендера слоя представлений.