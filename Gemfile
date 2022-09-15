# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.1.2'

gem 'pg', '~> 1.1'
gem 'puma', '~> 5.0'
gem 'rails', '~> 6.1.7'
gem 'sass-rails', '>= 6'
gem 'turbolinks', '~> 5'
gem 'webpacker', '~> 5.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

gem 'aasm', '~> 5.3'
gem 'bootsnap', '>= 1.4.4', require: false
gem 'braintree', '~> 4.8.0'
gem 'devise', '~> 4.8'
gem 'kaminari', '~> 1.2'
gem 'net-imap', '~> 0.2.3', require: false
gem 'net-pop', '~> 0.1.1', require: false
gem 'net-smtp', '~> 0.3.1', require: false
gem 'paranoia', '~> 2.6'
gem 'pundit', '~> 2.2'
gem 'rails-i18n'
gem 'rubocop', '~> 1.35'

# 第三方登入相關
gem 'omniauth-github', github: 'omniauth/omniauth-github', branch: 'master'
gem 'omniauth-google-oauth2'
gem 'omniauth-rails_csrf_protection'

gem 'bcrypt_pbkdf', '~> 1.1'
gem 'dotenv-rails', '~> 2.8'
gem 'ed25519', '~> 1.3'
gem 'net-ssh', '~> 7.0'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'factory_bot_rails', '~> 6.2'
  gem 'faker', '~> 2.22'
end

group :development do
  gem 'foreman', '~> 0.87.2'
  gem 'letter_opener'
  gem 'listen', '~> 3.3'
  gem 'rack-mini-profiler', '~> 2.0'
  gem 'web-console', '>= 4.1.0'
end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'rspec-rails', '~> 5.1'
  gem 'selenium-webdriver', '>= 4.0.0.rc1'
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'pagy', '~> 4.10', '>= 4.10.1'
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
