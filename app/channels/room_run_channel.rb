# frozen_string_literal: true

class RoomRunChannel < ApplicationCable::Channel
  def subscribed
    @room = Room.find_by!(uuid: params[:uuid])
    stream_for @room
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
