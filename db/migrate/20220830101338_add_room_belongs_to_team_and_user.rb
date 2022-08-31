class AddRoomBelongsToTeamAndUser < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :rooms, :team, null: false
    add_belongs_to :rooms, :user, null: false
  end
end
