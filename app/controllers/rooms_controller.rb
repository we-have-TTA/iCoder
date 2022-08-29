# frozen_string_literal: true

class RoomsController < ApplicationController
  def index
    @rooms = Room.all
  end

  def show
    @room = Room.find_by(id: params[:id])
  end

  def new
    @room = Room.new
  end

  def create
    @room = current_user.rooms.new(rooms_params)
    if @room.save
      redirect_to rooms_path
    else
      render :new
    end
  end

  def destroy
    @room = Room.find_by(id: params[:id])
    @room.destroy
    redirect_to rooms_path
  end

  private

  def rooms_params
    params.require(:room).permit(:title, :language, :category, :status)
  end
end
