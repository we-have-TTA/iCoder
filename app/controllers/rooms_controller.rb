# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room_by_uuid, only: %i[show update send_invitation create_runtime]
  before_action :find_room, only: %i[destroy]

  def index
    @rooms = Room.where(team: current_user.team)
  end

  def show
    render layout: 'room'
  end

  def create
    # TODO: move to model
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
    # TODO: 離開room後刪除session
    language = params[:language]
    uuid = params[:uuid]
    host_ip = ENV.fetch('HOST_IP', nil)
    username = ENV.fetch('SSH_USER_NAME', nil)
    new_container_name = "#{uuid}-#{language}"

    Net::SSH.start(host_ip, username) do |ssh|
      output = ssh.exec!("docker ps | grep #{uuid} | awk '{print $12}'")
      previous_container_name = nil
      previous_container_name = output.split('-').last.strip unless output.empty?
      container_is_not_valid = (previous_container_name != language)
      if container_is_not_valid
        p '沒有可使用的 container...'
        if previous_container_name
          p '刪除前一次的 container...'
          ssh.exec!("docker stop #{previous_container_name} && docker rm #{previous_container_name}")
          p 'done.'
        end
        p "建立 #{language} 的 container..."
        ssh.exec!("docker run -dit --name #{new_container_name} --network webssh #{language.downcase}_sshd")
        p 'done.'
      end
    end

   
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
