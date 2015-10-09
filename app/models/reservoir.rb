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

  def self.all_monthly_levels
    # look up rails 4 model scopes

  end

  def all_daily_levels
    daily_levels = []
    levels.each do |level|
      level_daily = {}
      level_daily[level.date.to_s] = level.level
      daily_levels << level_daily
    end
    return daily_levels
  end

  def self.all_coordinates
    @reservoirs = Reservoir.all
    coordinates = []
    @reservoirs.each do |res|
      res_obj = {}
      res_obj[res.name] = {}
      res_obj[res.name]["latitude"] = res.lat
      res_obj[res.name]["longitude"] = res.lon
      res_obj[res.name]["id"] = res.id
      coordinates << res_obj
    end
    p coordinates
  end

  # def range
  #   levels.where("created_at >= :start_date AND created_at <= :end_date",
  # # {start_date: params[:start_date], end_date: params[:end_date]})
  def daily_by_year(year)
    by_year1 = levels.where('extract(year from date) = ?', year)
    by_year = {}
    by_year["id"] = self.id
    by_year[self.name] = []
    by_year1.each do |level|
      pair = []
      pair << level.date
      pair << level.level
      by_year[self.name] << pair
    end
  end

end
