# == Schema Information
#
# Table name: reservoirs
#
#  id              :integer          not null, primary key
#  name            :string           not null
#  hydrologic_area :string           not null
#  river_basin     :string
#  station_id      :string           not null
#  location        :string           not null
#  max_capacity    :integer          not null
#  county          :string           not null
#  lat             :string           not null
#  lon             :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  elevation       :integer          not null
#  operator        :string
#

class Reservoir < ActiveRecord::Base
  has_many :levels
  # validates

  def all_monthly_levels
  end

  def all_weekly_levels
  end

  def all_daily_levels
  end

end
