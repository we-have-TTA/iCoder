# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room, only: %i[show update edit destroy]

  def index
    @rooms = Room.where(team: current_user.team)
  end

  def show; end

  def create
    # FIXME: fix here after #51
    rnd = SecureRandom.alphanumeric(6).upcase
    room = Room.new(
      uuid: rnd,
      title: "未命名的會議室 - #{rnd}",
      status: 'Not Started',
      category: 'Live',
      language: 'JavaScript',
      creator: current_user,
      team: current_user.team
    )
    room.save
    redirect_to room
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

  def find_room
    @room = Room.find(params[:id])
  end

  def rooms_params
    params.require(:room).permit(:title, :language, :category, :status).merge(team: current_user.team)
  end
end
