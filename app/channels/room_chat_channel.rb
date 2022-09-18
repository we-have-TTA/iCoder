# frozen_string_literal: true

class RoomChatChannel < ApplicationCable::Channel
  def subscribed
    @room = Room.find_by!(uuid: params[:uuid])
    stream_for @room

    p "\n"*4
    p params
    p "\n"*4
    name = params[:sessionID]
    
    @message = Message.new(username: "system", content: "#{name} join the chat.")
    return unless @message.save
    
    p @room
    p @message
    p '#'*50
    RoomChatChannel.broadcast_to(@room, @message)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
