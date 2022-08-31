# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room, only: [:show, :edit, :update, :destroy]

  def index
    @rooms = Room.where(team: current_user.team)
  end

  def show
    render layout: "room"
  end

  def new
    # FIXME fix here after #51
    room = Room.new(
      title: "Untitled Room - #{SecureRandom.alphanumeric(6).upcase}",
      status: 'Not Started',
      category: 'Live',
      language: 'JavaScript',
      creator: current_user,
      team: current_user.team)
    room.save
    redirect_to room
    # redirect_to edit_room_path(id: room.id)
  end

  def edit
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

  def rooms_params
    params.require(:room).permit(:title, :language, :category, :status).merge(team: current_user.team)
  end

  def find_room
    @room = Room.find(params[:id])
  end
end
