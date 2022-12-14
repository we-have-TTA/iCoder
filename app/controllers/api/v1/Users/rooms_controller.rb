# frozen_string_literal: true

module Api
  module V1
    module Users
      class RoomsController < ApplicationController
        def find_rooms_by_user
          current_user = User.find(params[:userid])
          rooms = if params[:allRoom] == 'true'
                    Room.where(team: current_user.team)
                  else
                    Room.where(creator: current_user)
                  end
          render json: { rooms: }
        end
      end
    end
  end
end
