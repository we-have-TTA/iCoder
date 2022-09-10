# frozen_string_literal: true

  module Api
    module V1
      module Users
        class RoomsController < ApplicationController
          def find_rooms_by_user
            rooms = Room.where(user_id: params[:userid])
            p params[:format]
            render json: { rooms: }
          end
        end
      end
    end
  end
