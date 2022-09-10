# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'support@icoder.tw'
  layout 'mailer'
end
