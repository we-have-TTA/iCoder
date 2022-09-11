# frozen_string_literal: true

class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_quesiton, only: [:create]
  before_action :find_comment, only: [:destroy]

  def create
    @comment = @question.comments.new(comment_params)
    if @comment.save
      redirect_to @question, notice: '留言成功'
    elsif @comment.content == ''
      redirect_to @question, notice: '留言內容不可空白'
    else
      redirect_to @question, notice: '留言失敗'
    end
  end

  def destroy
    @comment.destroy
    redirect_to @comment.question, notice: '留言刪除'
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :parent_id).merge(user: current_user)
  end

  def find_quesiton
    @question = Question.find(params[:question_id])
  end

  def find_comment
    @comment = current_user.comments.find(params[:id])
  end
end
