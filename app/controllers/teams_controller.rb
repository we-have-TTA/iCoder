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

  def invite; end

  def send_invitation
    if User.find_by(email: params[:email])
      register = 'true'
      user = User.find_by(email: params[:email])
    else
      register = 'false'
      user = User.new(
        username: params[:username] || params[:email].split('@').first,
        email: params[:email]
      )
    end
    team_id = current_user.team_id
    TeamMailer.send_invitation_to(user, team_id, register).deliver_now
    redirect_to :invite_to_team, notice: "成功邀請 #{user.username}(#{user.email})"
  end

  def join_team; end

  def update
    @team = Team.find(params[:team_id])
    @team.users << current_user
    redirect_to members_path
  end
end
