# frozen_string_literal: true

class QuestionsController < ApplicationController
  layout 'dashboard'
  
  before_action :authenticate_user!
  before_action :find_question, only: %i[show edit update destroy]
  def index
    @questions = Question.where(team: current_user.team)
    @questions = Question.where('title like ?', "%#{params[:keyword]}%") if params[:keyword]
  end

  def new
    @question = Question.new
  end

  def create
    @question = current_user.questions.new(question_params)
    if @question.save
      redirect_to questions_path, notice: '新增成功'
    else
      render :new
    end
  end

  def show
    @comment = Comment.new
    @comments = @question.comments.where(parent_id: nil).includes(:user).order(id: :desc)
  end

  def edit; end

  def update
    if @question.update(question_params)
      redirect_to questions_path, notice: '更新完畢!!'
    else
      render :edit
    end
  end

  def destroy
    @question.destroy
    redirect_to questions_path, notice: '刪除完畢!!'
  end

  private

  def find_question
    @question = Question.find(params[:id])
  end

  def question_params
    params.require(:question).permit(:title, :language, :code, :candidate_instructions, :difficulty, :internal_description, :question_type).merge(team: current_user.team)
  end
end
