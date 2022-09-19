# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      def update
        user = User.find(params[:id])

        if user.update(username: user_params[:username])
          render json: {
            message: 'update completed',
            status: '200'
          } and return
        end

        render json: { status: '404' }
      end

      private

      def user_params
        params.permit(:id, :username)
      end
    end
  end
end
