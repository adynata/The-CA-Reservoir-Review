class CreateLevels < ActiveRecord::Migration
  def change
    create_table :levels do |t|
      t.integer :reservoir_id, null: false
      t.date :date, null: false
      t.integer :level, null: false
      t.timestamps null: false
    end

    add_index :levels, :reservoir_id

  end
end
