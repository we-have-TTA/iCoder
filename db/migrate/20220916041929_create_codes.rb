class CreateCodes < ActiveRecord::Migration[6.1]
  def change
    create_table :codes do |t|
      t.text :content
      t.belongs_to :room, null: false, foreign_key: true

      t.timestamps
    end
  end
end
