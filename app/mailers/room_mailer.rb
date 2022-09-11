# frozen_string_literal: true

class RoomMailer < ApplicationMailer
  def send_invitation_to(user, room)
    @user = user
    host_ip = if ENV['RAILS_ENV'] == 'production'
                ENV.fetch('DOMAIN_NAME', nil)
              else
                '127.0.0.1'
              end
    @room_url = Rails.application.routes.url_helpers.room_uuid_url(uuid: room.uuid, host: host_ip, port: 3000)
    mail to: @user.email, subject: '你好!!'
  end
end
