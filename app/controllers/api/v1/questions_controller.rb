# frozen_string_literal: true

module Api
  module V1
    class QuestionsController < ApplicationController
      def show
        render json: Question.find(params[:id])
      end

      def example
        example = [nil, {
          serial_no: '1',
          language: 'ruby',
          code: 'puts 123'
        }]
        render json: example[params[:id].to_i]
      end

      def send_code
        @room = Room.find_by!(uuid: params[:uuid])
        code = Code.new(
          content: params[:code],
          room: @room,
          language: params[:language]
        )
        code.save if @room.codes.empty? || (Time.now - @room.codes.last.created_at > 5.seconds)

        RoomEditorChannel.broadcast_to(@room, { sessionID: params[:sessionID], code: })
      end
      # when user type in editor, raise request to server,
      # url: post /api/v1/rooms/id/code
      # try to create a version of code
      #   if Time.now - room.questions.last.created_at < 30.seconds
      #     pass
      #   else
      #     create code
      #   end
      # ActionCable.server.broadcast
    end
  end
end
