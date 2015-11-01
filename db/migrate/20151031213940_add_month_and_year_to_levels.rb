class AddMonthAndYearToLevels < ActiveRecord::Migration
  def change
    add_column :levels, :month, :integer
    add_column :levels, :year, :integer
  end
end
