class AddTeamsBelongsToUser < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :teams, :user
  end
end
