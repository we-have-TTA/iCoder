# frozen_string_literal: true

class MessagesController < ApplicationController
  def new
    @message = Message.new
  end

  def create
    message = Message.create(msg_params)
    name = current_user ? current_user.username : 'guest'
    return unless message.save

    ActionCable.server.broadcast(
      'room_channel',
      { content: message.content,
        name:,
        time: Time.now.strftime('%y / %m / %d %T') }
    )
  end

  private

  def msg_params
    params.require(:message).permit(:content)
  end
end
