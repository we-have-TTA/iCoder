# frozen_string_literal: true

class MessagesController < ApplicationController
  def new
    @message = Message.new
  end

  def create
    @room = Room.find_by!(uuid: params[:uuid])
    @message = Message.new(msg_params)
    return unless @message.save

    RoomChatChannel.broadcast_to(@room, @message)
  end

  private

  def msg_params
    params.require(:message).permit(:content, :username)
  end
end
