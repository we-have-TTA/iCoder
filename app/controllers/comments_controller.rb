class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_quesiton, only:[:create]

  def create
    @comment = @question.comments.new(comment_params)
   if @comment.save
    redirect_to @question, notice:"留言成功"
   else 
    redirect_to @question, notice:"留言失敗"
   end
  end

  def update
  end

  def destroy
  end
  
  private
  def comment_params
    params.require(:comment).permit(:content).merge(user: current_user)
  end

  def find_quesiton
    @question = Question.find(params[:question_id])
  end
end
