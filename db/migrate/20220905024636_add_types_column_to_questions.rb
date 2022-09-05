class AddTypesColumnToQuestions < ActiveRecord::Migration[6.1]
  def change
    add_column :questions, :types, :string
  end
end
