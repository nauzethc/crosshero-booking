# crosshero-booking

Book your CrossHero.com classes from terminal with Node.js. If class is full, you are signed into waiting list by default.

## Setup

```
npm install
```

Set your credentials in `config.js` file.

```
...
  email: 'user@email.com',
  password: 'secr3t'
...
```

Optional: Enable Telegram notifications with your Bot settings and set `telegram.enabled` to `true`.

```
...
telegram: {
  enabled: true,
  token: 'HASH_ID',
  chatId: 'CHAT_ID'
}
...
```

## Run

Get your desired program ID from CrossHero web to use it on automated process.

Tip: Go to any class of your desired program and copy `program_id` value from the URL.

```
node main.js -p PROGRAM_HASH -d "DD/MM/YYYY" -t "HH:MM"
```


## Run with Docker

Edit `config.js` and uncomment `executablePath` option.

```
...
options: {
  browser: {
    executablePath: 'google-chrome-unstable', // <--
...
```

`docker-compose.yml` is ready to install `puppeteer` and Google Chrome inside a Docker container.
Also you can configure `crontab` which is registered within container to run automated bookings.

```
docker-compose up --build
```
