# frozen_string_literal: true

class RoomMailer < ApplicationMailer
  def send_invitation_to(user, room)
    @user = user
    if ENV['RAILS_ENV'] == 'production'
      host_ip = ENV.fetch('DOMAIN_NAME', nil)
      @room_url = Rails.application.routes.url_helpers.room_uuid_url(uuid: room.uuid, host: host_ip)
    else
      host_ip = '127.0.0.1'
      @room_url = Rails.application.routes.url_helpers.room_uuid_url(uuid: room.uuid, host: host_ip, port: 3000)
    end
    mail to: @user.email, subject: '你好!!'
  end
end
