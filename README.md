# README

[![CodeFactor](https://www.codefactor.io/repository/github/we-have-tta/icoder/badge)](https://www.codefactor.io/repository/github/we-have-tta/icoder)

:cloud:

```
$ bundle
$ yarn install
$ ./bin/dev
```

## docker command

建立 pg container
`docker run --name rails-db -e POSTGRES_PASSWORD=mysecretpassword -d postgres`

migrate
`docker run --rm -it --link rails-db -e DATABASE_URL=postgres://postgres:mysecretpassword@rails-db/postgres myapp bundle exec rake db:migrate`

建立 rails
`docker run --name myapp --rm -it --link rails-db -p 3000:3000 -e DATABASE_URL=postgres://postgres:mysecretpassword@rails-db/postgres myapp`

- Ruby version

`ruby '3.1.2'`
`gem 'rails', '~> 6.1.6', '>= 6.1.6.1'`

- System dependencies

`tailwind css v2.2.17 for compatibility with rails 6`

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- ...
