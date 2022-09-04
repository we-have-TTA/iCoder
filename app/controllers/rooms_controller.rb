# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room_by_uuid, only: %i[show update send_invitation]
  before_action :find_room, only: %i[destroy]

  def index
    @rooms = Room.where(team: current_user.team)
  end

  def show
    render layout: 'room'
  end

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
    redirect_to "/#{room.uuid}"
  end

  def create_runtime
    # 離開room後刪除session

    # FIXME: 暫時先用user_id，之後用hash_value取代
    # language = params[:language]

    # TODO: fix after#70
    # if session[:current_language] && session[:current_language] == language
    #   nil
    # else
    #   remove_room = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} 'docker stop #{current_user.id}-#{session[:current_language]} && docker rm #{current_user.id}-#{session[:current_language]}'"
    #   build_room = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} 'docker run -dit --name #{current_user.id}-#{language} --network webssh #{language}_sshd'"
    #   p("try build ...-- #{system build_room}")
    #   sleep 3
    #   p("try remove ...-- #{system remove_room}")
    #   # FIXME: do some check if room remove and build success
    #   puts 'OK!!'
    #   session[:current_language] = language
    # end
  end

  def send_invitation
    @user = User.new(
      username: nil || params[:username],
      email: params[:email]
    )
    RoomMailer.send_invitation_to(@user, @room).deliver_now if @user
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

  def find_room_by_uuid
    @room = Room.find_by!(uuid: params[:uuid])
  end

  def rooms_params
    params.require(:room).permit(:title, :language, :category, :status).merge(team: current_user.team)
  end
end
