# frozen_string_literal: true

class MessagesController < ApplicationController
  def new
    @message = Message.new
  end

  def create
    p '0'*50
    p params
    p '0'*50
    @room = Room.find_by!(uuid: params[:uuid])
    @message = Message.new(msg_params)
    return unless @message.save

    RoomChatChannel.broadcast_to(@room, {message: @message, sessionid: params[:sessionid]})
  end

  private

  def msg_params
    params.require(:message).permit(:content, :username)
  end
end
