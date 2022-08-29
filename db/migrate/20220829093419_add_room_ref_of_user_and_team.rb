class AddRoomRefOfUserAndTeam < ActiveRecord::Migration[6.1]
  def change
    remove_column :rooms, :team_id
    remove_column :rooms, :user_id
    add_belongs_to :rooms, :teams, null: false
    add_belongs_to :rooms, :users, null: false
  end
end
