# frozen_string_literal: true

class Api::V1::Rooms::UsersController < ApplicationController
  module Api
    module V1
      module Rooms
        class UsersController < ApplicationController
          def find_rooms_by_user
            rooms = Room.where(user_id: params[:id])
            render json: { rooms: }
          end
        end
      end
    end
  end
end
