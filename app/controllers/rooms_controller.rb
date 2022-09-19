# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room_by_uuid, only: %i[show update send_invitation create_runtime start_room end_room]
  before_action :find_room, only: %i[destroy]
  before_action :authenticate_user!

  def index
    @rooms = Room.where(team: current_user.team).order(id: :desc)
    @rooms = @rooms.where('title like ?', "%#{params[:keyword]}%") if params[:keyword]
    @pagy, @rooms = pagy(@rooms, items: 5)
    @countdown_standard = ENV.fetch('COUNTDOWN_STANDARD', 24).to_i
  end

  def show
    render layout: 'room'
  end

  def create
    # TODO: move to
    rnd = SecureRandom.alphanumeric(6).upcase
    room = Room.new(
      uuid: rnd,
      title: "未命名的會議室 - #{rnd}",
      status: params[:status],
      category: 'Live',
      language: 'JavaScript',
      creator: current_user,
      team: current_user.team,
      question_id: params[:question]
    )
    authorize room
    room.save
    room.question&.update(last_used: Time.now)
    redirect_to "/#{room.uuid}"
  end

  def create_runtime
    # TODO: 離開room後刪除session
    language = params[:language]
    uuid = params[:uuid]
    @room.update(language:)
    host_ip = if ENV['RAILS_ENV'] == 'production'
                '127.0.0.1'
              else
                ENV.fetch('HOST_IP', nil)
              end
    p "host_ip: #{host_ip}"
    username = ENV.fetch('SSH_USER_NAME', nil)
    new_container = "#{uuid}-#{language}"
    # TODO: move to other place
    Net::SSH.start(host_ip, username) do |ssh|
      output = ssh.exec!("docker ps | grep #{uuid}")
                  .split("\n")
                  .map { |e| e[/\b#{uuid}-.+\b/] }
      unused_containers = output - [new_container]
      unless unused_containers.empty?
        p '找到未使用的 container...'
        unused_containers.each do |previous_container_name|
          p "刪除 #{previous_container_name}"
          ssh.exec!("docker rm #{previous_container_name} -f")
        end
        p 'done.'
      end
      unless new_container.in? output
        p '目前沒有可使用的 container...'
        p "建立 #{language} 的 container..."
        ssh.exec!("docker run -dit --name #{new_container} --network webssh #{language.downcase}_sshd")
        p 'done.'
      end
    end
    p "連線至 #{language} 的 container..."
    render json: { container: new_container }
  end

  def invite; end

  def send_invitation
    @user = User.new(
      username: params[:username] || params[:email].split('@').first,
      email: params[:email]
    )
    RoomMailer.send_invitation_to(@user, @room).deliver_now
    redirect_to :invite, notice: "成功邀請 #{@user.username}(#{@user.email})"
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

  def team_plan
    rooms_count = current_user.team.rooms.where(status: %i[notstarted started]).size
    render json: { permission: current_user.team.plan == 'vip', rooms_count: }
  end

  def countdown
    rooms = current_user.team.rooms.select('uuid', 'created_at')
    rooms_duration = rooms.map do |room|
      { uuid: room[:uuid], existTime: (Time.now - room[:created_at]).to_i }
    end
    render json: { rooms_duration: }
  end

  def start_room
    @room.interview! if @room.may_interview?
  end

  def end_room
    return unless @room.may_endinterview?

    @room.endinterview!
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
    params.require(:room).permit(:title, :language, :category, :status, :question).merge(team: current_user.team)
  end
end
