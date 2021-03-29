module.exports = {
  crosshero: {
    baseUrl: 'https://crosshero.com',
    email: '', // Required
    password: '' // Required
  },
  telegram: {
    enabled: false,
    token: '',
    chatId: ''
  },
  options: {
    browser: {
      // Uncomment if you are using Docker image
      // executablePath: 'google-chrome-unstable',
      headless: true
    },
    page: {
      timeout: 10000
    }
  }
}

