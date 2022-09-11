# frozen_string_literal: true

class MessagesController < ApplicationController
  def new
    @message = Message.new
  end

  def create
    @message = Message.create(msg_params)
    ActionCable.server.broadcast('room_channel', { content: @message.content }) if @message.save
  end

  private

  def msg_params
    params.require(:message).permit(:content)
  end
end
