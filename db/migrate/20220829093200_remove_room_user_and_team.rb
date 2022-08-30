class RemoveRoomUserAndTeam < ActiveRecord::Migration[6.1]
  def change
    remove_column :rooms, :team_id
    remove_column :rooms, :user_id
  end
end
