FROM ruby:3.1.2

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
  && apt-get install -y nodejs yarn \
  && mkdir -p /src \
  && apt-get install -y docker.io \
  && apt-get install -y docker-compose \
  && apt-get update && apt-get install -y openssh-server \
  && echo 'root:8888' | chpasswd \
  && echo "Port 22" >> /etc/ssh/sshd_config \
  && echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config \
  && echo "PermitRootLogin yes" >> /etc/ssh/sshd_config \
  && /etc/init.d/ssh restart

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
