FROM node:12

# Install Chrome and Cron with dependencies
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y vim cron google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
        --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Enable Cron
RUN service cron start

# Don't install Chromium alongside Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Change to unpriviliged user
WORKDIR /home/node/app
RUN chown -R node:node .
USER node

# Copy package requirements
COPY package.json .

# Install package dependendies
RUN npm install
COPY . .

# Install crontab configuration
RUN crontab ./crontab
