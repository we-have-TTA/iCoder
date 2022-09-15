class TeamMailer < ApplicationMailer
  def send_invitation_to(user, team_id)
    @user = user
    host_ip = if ENV['RAILS_ENV'] == 'production'
        ENV.fetch('DOMAIN_NAME', nil)
      else
        '127.0.0.1'
      end
    @team_url = Rails.application.routes.url_helpers.member_url(id: team_id, host: host_ip, port: 3000)
    mail to:@user.email, subject:"你好!!"
  end
end
