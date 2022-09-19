class AddColumnLanguageToCode < ActiveRecord::Migration[6.1]
  def change
    add_column :codes, :language, :string
  end
end
