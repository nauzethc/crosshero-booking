const notify = require('./notify')
const puppeteer = require('puppeteer')
const log = require('simple-node-logger').createSimpleLogger()
const { program } = require('commander')
const { crosshero, options } = require('./config')

program.version('0.0.1')
program.requiredOption('-p, --program-id <id>', 'CrossHero program ID')
program.requiredOption('-d, --date <date>', 'Date schedule in "DD/MM/YYYY" format')
program.requiredOption('-t, --time <time>', 'Class time in "HH:MM" format')
;
(async () => {
  // Parse arguments
  program.parse(process.argv)
  const { programId, date, time } = program.opts()

  // Load browser
  const browser = await puppeteer.launch(options.browser)
  const page = await browser.newPage()

  // Step 1: Login
  await page.goto(`${crosshero.baseUrl}/athletes/sign_in`)
  await Promise.all([
    page.waitForSelector('#athlete_email'),
    page.waitForSelector('#athlete_password'),
    page.waitForSelector('input[type=submit]')
  ])
  await page.type('#athlete_email', crosshero.email)
  await page.type('#athlete_password', crosshero.password)
  await page.click('input[type=submit]')
  log.info('Sending credentials to CrossHero.com...')

  // Step 2: Check login
  try {
    await page.waitForSelector('form[action="/dashboard/classes"]', options.page)
    log.info('Login success!')
  } catch (loginError) {
    log.error('Login error')
    log.error(loginError)
    return browser.close()
  }

  // Step 3: Go to program/day schedule page
  const query = `date=${date}&program_id=${programId}`
  await Promise.all([
    page.waitForNavigation(options.page),
    page.goto(`${crosshero.baseUrl}/dashboard/classes?${query}`)
  ])

  // Step 4: Retrieve class schedule and get class ID
  log.info('Retrieving program/day schedule...')
  const classes = await page.evaluate(() => {
    const selector = '#class_reservation_single_class_id option'
    return [...document.querySelectorAll(selector)]
      .filter(node => !!node.value)
      .map(node => [node.textContent, node.value])
      .reduce((acc, pair) => {
        const [time, id] = pair
        acc[time] = id
        return acc
      }, {})
  })
  log.info(JSON.stringify(classes, null, 2))

  // Step 5: Go to class page
  const classId = classes[time]
  if (classId) {
    await Promise.all([
      page.waitForNavigation(options.page),
      page.goto(`${crosshero.baseUrl}/dashboard/classes?id=${classId}`)
    ])
  } else {
    log.error('Class not found with given date and time')
    return browser.close()
  }

  // Step 6: Book class or sign in waiting list
  try {
    log.info(`Trying to book ${time} (${classId}) class...`)
    await page.waitForSelector('#classes-sign-in', options.page)
    await Promise.all([
      page.waitForNavigation(options.page),
      page.click('#classes-sign-in')
    ])
  } catch (classIsFull) {
    log.info('Class is full, trying to sign in waiting list...')
    await page.waitForSelector('#classes-waiting-list', options.page)
    await Promise.all([
      page.waitForNavigation(options.page),
      page.click('#classes-waiting-list')
    ])
  }

  // Step 7: Check process and notify
  try {
    await page.waitForSelector('a[href^="/dashboard/waiting_lists"][data-method=delete]', options.page)
    log.info('You are signed in waiting list')
    await notify(`CrossHero class at ${time} (${date}) is full! You are signed in waiting list`)
  } catch (notInWaitingList) {
    await page.waitForSelector('.alert-info', options.page)
    log.info('Your class was booked successfull!')
    await notify(`CrossHero class at ${time} (${date}) was booked successfully!`)
  }

  // Finish
  log.info('Done')
  return browser.close()
})()
