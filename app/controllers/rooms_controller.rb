# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room, only: %i[show update edit destroy]

  def index
    @rooms = Room.where(team: current_user.team)
  end

  def show; end

  def create
    title = "Untitled Room - #{SecureRandom.alphanumeric(6).upcase}"
    status = 'Not Started'
    category = 'Live'
    language = 'JavaScript'
    room = Room.create(title:, status:, category:, language:,
                       creator: current_user,
                       team: current_user.team)
    redirect_to edit_room_path(room)
  end

  def edit
    @room = Room.find(params[:id])
  end

  def update
    if @room.update(rooms_params)
      redirect_to rooms_path
    else
      render :edit
    end
  end

  def destroy
    @room.destroy
    redirect_to rooms_path
  end

  private

  def find_room
    @room = Room.find(params[:id])
  end

  def rooms_params
    params.require(:room).permit(:title, :language, :category, :status).merge(team: current_user.team)
  end
end
