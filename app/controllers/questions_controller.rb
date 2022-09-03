# frozen_string_literal: true

class QuestionsController < ApplicationController
  layout 'dashboard'
  before_action :find_question, only: %i[show edit update destroy]
  def index
    @questions = Question.all
  end

  def new
    @question = Question.new
  end

  def create
    @question = current_user.questions.new(clean_params)
    if @question.save
      redirect_to '/dashboard/questions', notice: '新增成功'
    else
      render :new
    end
  end

  def show; end

  def edit; end

  def update
    if @question.update(clean_params)
      redirect_to '/dashboard/questions', notice: '更新完畢!!'
    else
      render :edit
    end
  end

  def destroy
    @question.destroy
    redirect_to '/dashboard/questions', notice: '刪除完畢!!'
  end

  def search
    render html: params
  end

  private

  def find_question
    @question = Question.find(params[:id])
  end

  def find_team
    @team = current_user.team
  end

  def clean_params
    params.require(:question).permit(:title, :language, :code, :candidate_instructions, :difficulty, :internal_description).merge(team: current_user.team)
  end
end
