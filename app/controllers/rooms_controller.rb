# frozen_string_literal: true

class RoomsController < ApplicationController

  layout 'dashboard'

  def index
    team_id = current_user.team_id
    @rooms = Room.where(team_id: team_id)
  end

  def show
    @room = Room.find_by(id: params[:id])
  end

  def new
    title = "Untitled Room - " + SecureRandom.alphanumeric(6).upcase
    status = "Not Started"
    category = "Live"
    language = "JavaScript"
    team_id = current_user.team_id
    room = Room.new(title: title, status: status, category: category, language: language,
                    creator: current_user,
                    team_id: team_id
                    )
    room.save
    redirect_to edit_room_path(id: room.id)
  end

  def edit
    @room = Room.find_by(id: params[:id])
  end

  def update
    @room = Room.find_by(id: params[:id])
    if @room.update(rooms_params) 
      redirect_to rooms_path 
    else
      render :edit
    end
  end

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
