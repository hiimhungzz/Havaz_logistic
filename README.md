+ Run dev

- npm i
- npm start

+ Build dev

- npm i -f
- npm rebuild
- npm run build:dev
- cd app-build
- npm i -f
- pm2 start app-dev.yml

+ Build prod

- npm i -f
- npm rebuild
- npm run build:prod
- cd app-build
- npm i -f
- pm2 start app-prod.yml
