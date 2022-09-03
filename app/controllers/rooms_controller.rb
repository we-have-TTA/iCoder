# frozen_string_literal: true

class RoomsController < ApplicationController
  layout 'dashboard'
  before_action :find_room, only: %i[show edit update destroy]

  def index
    @rooms = Room.where(team: current_user.team)
  end

  def show
    render layout: 'room'
  end

  def create
    # FIXME: fix here after #51
    room = Room.new(
      title: "Untitled Room - #{SecureRandom.alphanumeric(6).upcase}",
      status: 'Not Started',
      category: 'Live',
      language: 'JavaScript',
      creator: current_user,
      team: current_user.team
    )
    room.save
    redirect_to room
    # redirect_to edit_room_path(id: room.id)
  end

  def create_runtime
    # 離開room後刪除session

    # FIXME: 暫時先用user_id，之後用hash_value取代
    language = params[:language]

    if session[:current_language] && session[:current_language] == language
      nil
    else
      remove_room = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} 'docker stop #{current_user.id}-#{session[:current_language]} && docker rm #{current_user.id}-#{session[:current_language]}'"
      build_room = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} 'docker run -dit --name #{current_user.id}-#{language} --network webssh #{language}_sshd'"
      p("try build ...-- #{system build_room}")
      sleep 1
      p("try remove ...-- #{system remove_room}")
      # FIXME: do some check if room remove and build success
      puts 'OK!!'
      session[:current_language] = language
    end
  end

  def push_code
    # 目前需手動重整，待修正
    code = "puts 'HI'"
    File.write("/Users/rexkao/Project/iCoder_dev/123.rb", "#{code}")
    puts code
    push_code = "ssh #{ENV.fetch('SSH_USER_NAME', nil)}@#{ENV.fetch('HOST_IP', nil)} -p 5000 'cat /Users/rexkao/Project/iCoder_dev/123.rb > /home/123.rb'"
    p("try build ...-- #{system push_code}")
    puts 'OK!!'
  end

  def edit; end

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
