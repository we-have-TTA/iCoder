# frozen_string_literal: true

class TeamsController < ApplicationController
  before_action :authenticate_user!

  layout 'dashboard'

  def index
    @users = current_user.team.users
    @team = current_user.team_id
  end

  def new; end

  def create; end

  def invite; end

  def send_invitation
    @user = User.new(
      username: params[:username] || params[:email].split('@').first,
      email: params[:email]
    )
    @team_id = current_user.team_id
    TeamMailer.send_invitation_to(@user, @team_id).deliver_now
    redirect_to :invite_to_team, notice: "成功邀請 #{@user.username}(#{@user.email})"
  end


end
