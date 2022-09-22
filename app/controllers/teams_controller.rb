# frozen_string_literal: true

class TeamsController < ApplicationController
  before_action :authenticate_user!, except: %i[join_team]

  layout 'dashboard'

  def index
    @users = current_user.team.users
    @team = current_user.team_id
  end

  def new; end

  def create; end

  def edit
    @team = current_user.team
  end

  def update
    @team = current_user.team
    if @team.update(team_params)
      redirect_to members_path, notice: '組織名稱更新成功'
    else
      render :edit, notice: '組織名稱更新失敗'
    end
  end

  def invite; end

  def send_invitation
    user = User.find_by(email: params[:email]) || User.new(
      username: params[:username] || params[:email].split('@').first,
      email: params[:email]
    )
    team = current_user.team
    TeamMailer.send_invitation_to(user, team).deliver_now
    redirect_to :invite_to_team, notice: "成功邀請 #{user.username}(#{user.email})"
  end

  def join_team; end

  def update_member
    @team = Team.find(params[:team_id])
    @team.users << current_user
    redirect_to members_path
  end

  private

  def team_params
    params.require(:team).permit(:name, :avatar)
  end
end
