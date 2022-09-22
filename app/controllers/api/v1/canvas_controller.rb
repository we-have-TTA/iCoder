# frozen_string_literal: true

module Api
  module V1
    class CanvasController < ApplicationController
      def send_canvas_message
        @room = Room.find_by!(uuid: params[:uuid])
        content = params[:content]
        msg = CanvasMessage.new(room: @room, content:)

        msg.save if @room.canvas_messages.empty? || (Time.now - @room.canvas_messages.last.created_at > 5.seconds)

        CanvasChannel.broadcast_to(@room, { sessionID: params[:sessionID], msg: })
      end

      private

      def canvas_message_params
        params.permit(:uuid, :content)
      end
    end
  end
end
