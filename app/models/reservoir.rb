class Reservoir < ActiveRecord::Base
  has_many :levels

  def all_monthly_levels
  end

  def all_weekly_levels
  end

  def all_daily_levels
  end

end
