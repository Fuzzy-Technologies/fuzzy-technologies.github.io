<!-- no heading auto -->

<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="64x64" href="/static/images/favicon-64x64.png">
<link rel="icon" type="image/png" sizes="128x128" href="/static/images/favicon-128x128.png">

<link rel="stylesheet" href="/static/style.css">

<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
  <h1 style="margin: 0; font-size: 1.8rem;">
    <a href="https://fuzzy-technologies.github.io/TKSBrokerAPI" style="color: #ff79c6; text-decoration: none;">
      ⚙️ TKSBrokerAPI
    </a>
  </h1>
  <a href="https://fuzzy-technologies.github.io/">
    <img src="/static/images/FuzzyTechnologies-Logo-transp.png" alt="Fuzzy Technologies Logo" width="200" />
  </a>
</div>

<a href="https://fuzzy-technologies.github.io/TKSBrokerAPI">
  <img src="/static/images/TKSBrokerAPI-Logo.png" alt="TKSBrokerAPI Logo">
</a><br>
<a href="https://t.me/TKSBrokerAPI/19"><i>Телеграм-канал платформы: ➤ @TKSBrokerAPI</i></a><br><br>

⚙️ **TKSBrokerAPI** — это опенсорс-платформа собственной разработки для упрощённой работы с брокером Т-Инвестиции через REST API и автоматизации сбора биржевой аналитики и торговых сценариев на Python. 

Она решает типичные задачи трейдеров, аналитиков и разработчиков: подключение к брокеру, запрос информации по портфелю, котировкам и операциям, отправка торговых команд — всё в одном инструменте.

TKSBrokerAPI легко встраивается в CI/CD пайплайны, автосценарии и дата-инжиниринг. Платформа подойдёт как для локальной аналитики, так и для полноценных бэктестов и торговых роботов.

Все сигнальные и торговые сценарии [FMA](https://fuzzy-technologies.github.io/FMA) также работают на базе платформы TKSBrokerAPI.

### Зачем нужна платформа ⚙️ TKSBrokerAPI

Если требуется совместить инвестиции, Python и алготрейдинг, то вам не нужно разбираться в тонкостях сетевых протоколов или документации API. TKSBrokerAPI берёт это на себя.

> Вы пишете гениальную торговую стратегию — всё остальное автоматизирует платформа.

#### 💡 Как это работает

<img src="/static/images/TKSBrokerAPI-flow.png" alt="TKSBrokerAPI Flow">

1. Вы придумываете гениальную торговую идею или алгоритм.
2. Описываете его как сценарий — пошагово, как вы бы торговали вручную.
3. Реализуете сценарий на Python, используя команды и модули TKSBrokerAPI.
4. Платформа берёт на себя подключение к брокеру, обработку данных и выполнение операций.
5. Получаете результат: аналитику, действия и отчёты.
6. ... 🔮 магия 🎩 ...
7. 💰 Профит!

#### 📊 Обогащение и анализ данных

<img src="/static/images/TKSBrokerAPI-extend-data-flow.png" alt="TKSBrokerAPI Analytics"/>

Платформа TKSBrokerAPI помогает не только в торговле, но и в подготовке первичных данных для анализа. Она получает «сырые» данные по активам — акции, облигации, фонды, фьючерсы и валюты — и предоставляет их в удобных форматах:

- 📈 CSV и XLSX — для Excel и табличных редакторов
- 📄 Markdown — для консольных отчётов
- 🧠 Pandas DataFrame — для Data Science и алгоритмов

Как устроено обогащение данных:

1. Запрос: модуль TKSBrokerAPI получает данные с сервера брокера.
2. Обработка: добавляются расчётные метрики, статистика, агрегаты.
3. Сохранение: результат можно вывести в терминал или сохранить в файл.
4. Анализ: подключаете любимый инструмент (Excel, Jupyter, Power BI) и работаете.
5. Алгоритм: на основе анализа создаёте свою стратегию.
6. Автоматизация: реализуете её в сценарии на Python — и снова запускаете через TKSBrokerAPI.
7. ... 🔮 магия 🎩 ...
8. 💰 Профит!


### 📦 Как установить

⚠️ Актуальная и наиболее оптимизированная dev-версия на текущий момент в PyPI: [v1.6.dev248](https://pypi.org/project/tksbrokerapi/1.6.dev248/) (release-версия платформы ожидается до 1 июня 2025).

```shell
pip install tksbrokerapi==1.6.dev248
```

🇷🇺 📚 Документация на русском:
- Код на GitHub: [TKSBrokerAPI](https://github.com/Tim55667757/TKSBrokerAPI/tree/develop)
- Подробное описание и примеры: [README.md](https://github.com/Tim55667757/TKSBrokerAPI/blob/develop/README.md)
- Документация на API: [TKSBrokerAPI module docs](https://tim55667757.github.io/TKSBrokerAPI/docs/tksbrokerapi/TKSBrokerAPI.html)
- Накопительные релиз-ноты: [CHANGELOG.md](https://github.com/Tim55667757/TKSBrokerAPI/blob/develop/CHANGELOG.md)

### 🛠 Как использовать

Платформа работает в двух режимах:

1. **Из командной строки**  

   Запуск сценариев, экспорт данных, получение информации — через простой CLI-интерфейс с ключами.

<details>
  <summary>Пример запроса клиентского портфеля и вывод информации в консоль</summary>

  <pre><code class="language-markdown">
$ tksbrokerapi --overview

TKSBrokerAPI.py     L:1821 INFO    [2022-08-10 22:06:27,150] Statistics of client's portfolio:
# Client's portfolio

* **Actual date:** [2022-08-10 19:06:27] (UTC)
* **Account ID:** [**********]
* **Portfolio cost:** 405705.77 RUB
* **Changes:** +2098.76 RUB (+0.52%)

## Open positions

| Ticker [FIGI]               | Volume (blocked)                | Lots     | Curr. price  | Avg. price   | Current volume cost | Profit (%)
|-----------------------------|---------------------------------|----------|--------------|--------------|---------------------|----------------------
| Ruble                       |                 5.62 (0.00) rub |          |              |              |                     |
|                             |                                 |          |              |              |                     |
| **Currencies:**             |                                 |          |              |              |        13886.03 RUB |
| EUR_RUB__TOM [BBG0013HJJ31] |                 5.29 (0.00) eur | 0.0053   |    62.75 rub |    61.41 rub |          331.96 rub | +7.10 rub (+2.19%)
| CNYRUB_TOM [BBG0013HRTL0]   |               928.93 (0.00) cny | 0.9289   |     9.09 rub |     8.95 rub |         8443.97 rub | +134.69 rub (+1.62%)
| CHFRUB_TOM [BBG0013HQ5K4]   |                 1.00 (0.00) chf | 0.0010   |    60.54 rub |    64.00 rub |           60.54 rub | -3.46 rub (-5.41%)
| GBPRUB_TOM [BBG0013HQ5F0]   |                10.00 (0.00) gbp | 0.0100   |    74.39 rub |    75.88 rub |          743.85 rub | -14.94 rub (-1.97%)
| TRYRUB_TOM [BBG0013J12N1]   |               100.00 (0.00) try | 0.1000   |     3.42 rub |     3.41 rub |          342.00 rub | +0.65 rub (+0.19%)
| USD000UTSTOM [BBG0013HGFT4] |                34.42 (0.05) usd | 0.0344   |    60.66 rub |    60.33 rub |         2088.09 rub | +11.44 rub (+0.55%)
| HKDRUB_TOM [BBG0013HSW87]   |               237.75 (0.00) hkd | 0.2378   |     7.89 rub |     7.83 rub |         1875.61 rub | +14.27 rub (+0.77%)
|                             |                                 |          |              |              |                     |
| **Shares:**                 |                                 |          |              |              |       199987.52 RUB |
| POSI [TCS00A103X66]         |                           3 (0) | 3        |  1161.80 rub |  1120.20 rub |         3485.40 rub | +124.60 rub (+3.71%)
| 288 [BBG00699M8Q7]          |                         800 (0) | 8        |     5.53 hkd |     5.69 hkd |         4424.00 hkd | -128.00 hkd (-2.81%)
| YNDX [BBG006L8G4H1]         |                           4 (0) | 4        |  1971.80 rub |  1958.80 rub |         7887.20 rub | +52.22 rub (+0.67%)
| IBM [BBG000BLNNH6]          |                           1 (1) | 1        |   131.03 usd |   131.13 usd |          131.03 usd | -0.10 usd (-0.08%)
| 1810 [BBG00KVTBY91]         |                        1100 (0) | 11       |    11.79 hkd |    11.76 hkd |        12969.00 hkd | +30.00 hkd (+0.23%)
| 9988 [BBG006G2JVL2]         |                          60 (0) | 6        |    91.80 hkd |    91.05 hkd |         5508.00 hkd | +45.50 hkd (+0.83%)
|                             |                                 |          |              |              |                     |
| **Bonds:**                  |                                 |          |              |              |        56240.33 RUB |
| RU000A105104 [TCS00A105104] |                           5 (0) | 5        |  1012.00 cny |  1013.00 cny |         5064.80 cny | -5.00 cny (-0.10%)
| RU000A101YV8 [TCS00A101YV8] |                          10 (0) | 10       |  1015.40 rub |  1011.21 rub |        10201.30 rub | +41.90 rub (+0.41%)
|                             |                                 |          |              |              |                     |
| **Etfs:**                   |                                 |          |              |              |       135586.27 RUB |
| TGLD [BBG222222222]         |                       30000 (0) | 300      |     0.07 usd |     0.07 usd |         2235.00 usd | -3.39 usd (-0.15%)
|                             |                                 |          |              |              |                     |
| **Futures:** no trades      |                                 |          |              |              |                     |

## Opened pending limit-orders: 1

| Ticker [FIGI]               | Order ID       | Lots (exec.) | Current price (% delta) | Target price  | Action    | Type      | Create date (UTC)
|-----------------------------|----------------|--------------|-------------------------|---------------|-----------|-----------|---------------------
| IBM [BBG000BLNNH6]          | ************   | 1 (0)        |     131.02 usd (-4.36%) |    137.00 usd | ↓ Sell    | Limit     | 2022-08-10 22:02:44

## Opened stop-orders: 3

| Ticker [FIGI]               | Stop order ID                        | Lots   | Current price (% delta) | Target price  | Limit price   | Action    | Type        | Expire type  | Create date (UTC)   | Expiration (UTC)
|-----------------------------|--------------------------------------|--------|-------------------------|---------------|---------------|-----------|-------------|--------------|---------------------|---------------------
| 1810 [BBG00KVTBY91]         | ********-****-****-****-************ | 11     |         N/A hkd (0.00%) |     14.00 hkd |        Market | ↓ Sell    | Take profit | Until cancel | 2022-08-10 11:24:57 | Undefined
| 288 [BBG00699M8Q7]          | ********-****-****-****-************ | 8      |         N/A hkd (0.00%) |      5.80 hkd |        Market | ↓ Sell    | Take profit | Until cancel | 2022-08-10 11:06:28 | Undefined
| IBM [BBG000BLNNH6]          | ********-****-****-****-************ | 1      |     130.99 usd (-4.49%) |    137.15 usd |        Market | ↓ Sell    | Take profit | Until cancel | 2022-08-10 19:02:21 | Undefined

# Analytics

* **Current total portfolio cost:** 405705.77 RUB
* **Changes:** +2098.76 RUB (+0.52%)

## Portfolio distribution by assets

| Type       | Uniques | Percent | Current cost
|------------|---------|---------|-----------------
| Ruble      | 1       | 0.00%   | 5.62 rub
| Currencies | 7       | 3.42%   | 13886.03 rub
| Shares     | 6       | 49.29%  | 199987.52 rub
| Bonds      | 2       | 13.86%  | 56240.33 rub
| Etfs       | 1       | 33.42%  | 135586.27 rub

## Portfolio distribution by companies

| Company                                     | Percent | Current cost
|---------------------------------------------|---------|-----------------
| All money cash                              | 3.42%   | 13891.65 rub
| [POSI] Positive Technologies                | 0.86%   | 3485.40 rub
| [288] WH Group                              | 8.60%   | 34900.94 rub
| [YNDX] Yandex                               | 1.94%   | 7887.20 rub
| [IBM] IBM                                   | 1.96%   | 7948.93 rub
| [1810] Xiaomi                               | 25.22%  | 102312.44 rub
| [9988] Alibaba                              | 10.71%  | 43452.61 rub
| [RU000A105104] РУСАЛ выпуск 5               | 11.35%  | 46039.03 rub
| [RU000A101YV8] Позитив Текнолоджиз выпуск 1 | 2.51%   | 10201.30 rub
| [TGLD] Тинькофф Золото                      | 33.42%  | 135586.28 rub

## Portfolio distribution by sectors

| Sector         | Percent | Current cost
|----------------|---------|-----------------
| All money cash | 3.42%   | 13891.65 rub
| it             | 30.55%  | 123948.08 rub
| consumer       | 19.31%  | 78353.55 rub
| telecom        | 1.94%   | 7887.20 rub
| materials      | 11.35%  | 46039.03 rub
| other          | 33.42%  | 135586.28 rub

## Portfolio distribution by currencies

| Instruments currencies   | Percent | Current cost
|--------------------------|---------|-----------------
| [rub] Российский рубль   | 5.32%   | 21579.52 rub
| [hkd] Гонконгский доллар | 44.99%  | 182541.60 rub
| [usd] Доллар США         | 35.89%  | 145623.30 rub
| [cny] Юань               | 13.43%  | 54483.01 rub
| [eur] Евро               | 0.08%   | 331.96 rub
| [chf] Швейцарский франк  | 0.01%   | 60.54 rub
| [gbp] Фунт стерлингов    | 0.18%   | 743.85 rub
| [try] Турецкая лира      | 0.08%   | 342.00 rub

## Portfolio distribution by countries

| Assets by country                  | Percent | Current cost
|------------------------------------|---------|-----------------
| All other countries                | 36.84%  | 149472.30 rub
| [RU] Российская Федерация          | 16.67%  | 67612.93 rub
| [CN] Китайская Народная Республика | 44.53%  | 180665.99 rub
| [US] Соединенные Штаты Америки     | 1.96%   | 7948.93 rub

TKSBrokerAPI.py     L:1827 INFO    [2022-08-10 22:06:27,153] Client's portfolio is saved to file: [overview.md]
   </code></pre>
</details>

2. **Как Python-модуль**  

   Импортируйте в проект и стройте собственные торговые и аналитические алгоритмы.

<details>
  <summary>Пример структуры собственного трейдерского алгоритма</summary>

  <pre><code class="language-python">
from tksbrokerapi.TKSBrokerAPI import TinkoffBrokerServer, uLogger
from tksbrokerapi.TradeRoutines import *

class TradeScenario(TinkoffBrokerServer):
    def __init__(self, **kwargs):
        super().__init__(token=kwargs["userToken"], accountId=kwargs["userAccount"])  # Инициализация платформы.

        self.tickers = []  # Тикеры биржевых инструментов, с которым будет работать трейдер.
        self.curTicker = None  # Тикер, над которым в данный момент ведётся работа.

    def Steps(self):
        uLogger.info(f"Работаем с инструментом: [{self.curTicker}]")
        pass  # ... код шагов сценария выполняемый над конкретным биржевым инструментом ...

    def Run(self):
        for ticker in self.tickers:
            self.curTicker = ticker

            self.Steps()  # Запускаем трейдера для обработки очередного биржевого инструмента.


def Trade():
    # --- Инициализация основного объекта трейдера:
    trader = TradeScenario(
        userToken="",  # Строка с токеном для доступа к API Т-Инвестиции. Или используйте переменную окружения `TKS_API_TOKEN`.
        userAccount="",  # Строка с accountId пользователя. Или используйте переменную окружения `TKS_ACCOUNT_ID`.
    )

    trader.tickers = ["YNDX", "IBM", "GAZP"]  # Задаём тикеры инструментов для работы трейдера.

    trader.Run()  # Запуск торговых итераций со всеми указанными инструментами.


if __name__ == "__main__":
    Trade()  # Инициализация, параметризация и запуск торгового сценария
   </code></pre>
</details>

<hr/>

<div style="text-align: center; margin-top: 2em;">
  <a href="https://fuzzy-technologies.github.io">
    <img src="/static/images/Technologies-Knowledge-Science.png" alt="Technologies · Knowledge · Science" width="200"/>
  </a>
  <p style="font-size: 0.9em; color: #666;">Fuzzy Technologies · 2025</p>
</div>
