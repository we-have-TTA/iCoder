# frozen_string_literal: true

class TeamMailer < ApplicationMailer
  def send_invitation_to(user, team)
    @team_name = team.name
    @user = user
    host_ip = if ENV['RAILS_ENV'] == 'production'
                ENV.fetch('DOMAIN_NAME', nil)
              else
                '127.0.0.1'
              end
    if @user.persisted?
      @team_url = Rails.application.routes.url_helpers.join_to_team_url(team_id: team.id, host: host_ip, port: 3000)
      @team_url = @team_url.sub(':3000', '') if ENV['RAILS_ENV'] == 'production'
      mail to: @user.email, subject: '邀請加入icoder團隊'
    else
      @team_url = Rails.application.routes.url_helpers.new_user_registration_url(team_id: team.id, host: host_ip, port: 3000)
      @team_url = @team_url.sub(':3000', '') if ENV['RAILS_ENV'] == 'production'
      mail to: @user.email, subject: '邀請加入icoder團隊!!'
    end
  end
end
