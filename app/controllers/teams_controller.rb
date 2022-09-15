# frozen_string_literal: true

class TeamsController < ApplicationController
  before_action :authenticate_user! , except: %i[join_team] 

  layout 'dashboard'

  def index
    @users = current_user.team.users
    @team = current_user.team_id
  end

  def new; end

  def create; end

  def invite; end

  def send_invitation
    p User.find_by(email: params[:email])
    if User.find_by(email: params[:email]) #判斷email是否存在在資料庫
      # 用戶已註冊 寄信 -> 加入到Team
      @register = 'true' 
      @user = User.new(
        username: params[:username] || params[:email].split('@').first,
        email: params[:email]
      )
      @team_id = current_user.team_id
      TeamMailer.send_invitation_to(@user, @team_id, @register).deliver_now
      redirect_to :invite_to_team, notice: "成功邀請 #{@user.username}(#{@user.email})"
    else
      # 用戶未註冊  寄信 -> 連結放註冊畫面
      @register = 'false' 
      @user = User.new(
        username: params[:username] || params[:email].split('@').first,
        email: params[:email]
      )
      @team_id = current_user.team_id
      TeamMailer.send_invitation_to(@user, @team_id, @register).deliver_now
      redirect_to :invite_to_team, notice: "成功邀請 #{@user.username}(#{@user.email})"
    end
  end

  def join_team
    # @team_id = Team.find_by(id: params[:id])
    # @user = User.find_by(username: params[:username])
  end

  def update
    @team = Team.find(params[:team_id])
    @team.users << current_user 
    # render html: params
    redirect_to members_path
  end


end
