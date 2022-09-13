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
    end
  end
end
