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
