# frozen_string_literal: true

class TeamsController < ApplicationController
  before_action :authenticate_user!

  layout 'dashboard'

  def index
    @users = current_user.team.users
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

  def invite
    render html: params
  end

  private

  def team_params
    params.require(:team).permit(:name, :avatar)
  end
end
