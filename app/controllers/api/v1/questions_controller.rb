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
        code = Code.create(
          content: codes_params[:code],
          room: Room.find_by(uuid: codes_params[:uuid]),
          language: codes_params[:language]
        )

        ActionCable.server.broadcast(
          'room_channel',
          {
            type: 'code',
            sessionID: params[:sessionID],
            body: {
              code: code.content,
              language: code.language,
              time: Time.now.strftime('%y / %m / %d %T')
            }
          }
        )
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

      private

      def codes_params
        params.permit(:code, :language, :uuid)
      end
    end
  end
end
