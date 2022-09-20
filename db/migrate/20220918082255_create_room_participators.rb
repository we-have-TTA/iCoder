class CreateRoomParticipators < ActiveRecord::Migration[6.1]
  def change
    create_table :room_participators do |t|
      t.belongs_to :room, null: false, foreign_key: true
      t.string :session_id
      t.string :name
      t.datetime :leave_at, precision: 6, null: true

      t.timestamps
    end
  end
end
