class CreateRooms < ActiveRecord::Migration[6.1]
  def change
    create_table :rooms do |t|
      t.string :title
      t.boolean :status
      t.string :type
      t.string :language
      t.integer :user_id
      t.integer :team_id

      t.timestamps
    end
  end
end
