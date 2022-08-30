FROM ruby:3.1.2

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
  && apt-get install -y nodejs yarn \
  && mkdir -p /src

COPY Gemfile Gemfile.lock /src/

WORKDIR /src
RUN gem install bundler:2.3.15 \
  && bundle config --local deployment 'true' \
  && bundle config --local frozen 'true' \
  && bundle config --local without 'test' \
  && bundle install -j "$(getconf _NPROCESSORS_ONLN)"

COPY . /src

RUN bundle exec rake assets:precompile

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES yes
ENV RAILS_LOG_TO_STDOUT yes

CMD ["bundle", "exec", "rails", "server"]
