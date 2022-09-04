class AddCodeColumnToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :code, :text
  end
end
