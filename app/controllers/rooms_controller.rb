# frozen_string_literal: true

class RoomsController < ApplicationController
  def index
    @rooms = Room.all
  end

  def show
    @room = Room.find_by(id: params[:id])
  end

  def new
    title = "Untitled Room - " + SecureRandom.alphanumeric(6).upcase
    status = "Not Started"
    category = "Live"
    language = "JavaScript"
    users_id = current_user.id
    teams_id = current_user.team_id
    room = Room.new(title: title, status: status, category: category, language: language,
                    users_id: users_id,
                    teams_id: teams_id
                    )
    room.save
    redirect_to room_path(id: room.id)
  end

  # def create
  #   @room = current_user.rooms.new(rooms_params)
  #   if @room.save
  #     redirect_to rooms_path
  #   else
  #     render :new
  #   end
  # end

  def destroy
    @room = Room.find_by(id: params[:id])
    @room.destroy
    redirect_to rooms_path
  end

  private

  def rooms_params
    params.require(:room).permit(:title, :language, :category, :status).merge(team_id:current_user.team_id)
  end
end
