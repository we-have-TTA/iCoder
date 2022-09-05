class AddInternalDescriptionColumnToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :internal_description, :text
  end
end
