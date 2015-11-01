class AddMonthlyAveragesTable < ActiveRecord::Migration
  def change

    create_table :monthly_averages do |t|
      t.integer :reservoir_id, null: false
      t.date :date, null: false
      t.float :level, null: false
      t.timestamps null: false
    end

    add_index :monthly_averages, :reservoir_id
  end
end
