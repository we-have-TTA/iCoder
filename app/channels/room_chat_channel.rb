# frozen_string_literal: true

class RoomChatChannel < ApplicationCable::Channel
  def subscribed
    @room = Room.find_by!(uuid: params[:uuid])
    stream_for @room

    # name = params[:sessionID]

    # @message = Message.new(username: 'system', content: "#{name} join the chat.")
    return unless @message.save

    # RoomChatChannel.broadcast_to(@room, @message)
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
