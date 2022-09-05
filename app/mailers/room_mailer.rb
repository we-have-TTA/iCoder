# frozen_string_literal: true

class RoomMailer < ApplicationMailer
  def send_invitation_to(user, room)
    @user = user
    @room_url = Rails.application.routes.url_helpers.room_uuid_url(uuid: room.uuid, host: 'localhost', port: 3000)
    mail to: @user.email, subject: '你好!!'
  end
end
