# frozen_string_literal: true

class MessagesController < ApplicationController
  def new
    @message = Message.new
  end

  def create
    message = Message.create(msg_params)
    return unless message.save

    ActionCable.server.broadcast(
      'room_channel',
      { type: 'message',
        body: {
          content: message.content,
          name: params.require(:message)[:username],
          time: Time.now.strftime('%y / %m / %d %T')
        } }
    )
  end

  private

  def msg_params
    params.require(:message).permit(:content)
  end
end
