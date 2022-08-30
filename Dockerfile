FROM ruby:3.1.2-alpine

RUN mkdir -p /src
COPY Gemfile Gemfile.lock /src/

RUN apk add --update build-base postgresql-dev tzdata

WORKDIR /src
RUN gem install bundler:2.3.15 \
  && bundle config --local without 'production test' \
  && bundle install -j "$(getconf _NPROCESSORS_ONLN)"

COPY . /src/

ENV RAILS_ENV deployment
ENV RAILS_SERVE_STATIC_FILES yes
ENV RAILS_LOG_TO_STDOUT yes

CMD ["bundle", "exec", "rails", "server"]
