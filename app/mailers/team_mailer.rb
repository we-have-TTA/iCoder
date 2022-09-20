# frozen_string_literal: true

class TeamMailer < ApplicationMailer
  def send_invitation_to(user, team_id, register, team_name)
    @team_name = team_name
    @user = user
    host_ip = if ENV['RAILS_ENV'] == 'production'
                ENV.fetch('DOMAIN_NAME', nil)
              else
                'localhost'
              end
    if register == 'true'
      @team_url = Rails.application.routes.url_helpers.join_to_team_url(team_id:, host: host_ip, port: 3000)
      mail to: @user.email, subject: '邀請加入icoder團隊'
    else
      @team_url = Rails.application.routes.url_helpers.new_user_registration_url(host: host_ip, port: 3000, team_id:)
      mail to: @user.email, subject: '邀請加入icoder團隊!!'
    end
  end
end
