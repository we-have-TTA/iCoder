class AddQuestionBelongsToRoom < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :rooms, :question, null: true
  end
end
