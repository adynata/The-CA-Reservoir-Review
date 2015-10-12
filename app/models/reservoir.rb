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

  def daily_by_year(year)
    by_year1 = levels.where('extract(year from date) = ?', year)
    by_year = {}
    by_year["id"] = self.id
    by_year["reservoir"] = self.name
    by_year[year] = []
    by_year1.each do |level|
      pair = []
      pair << level.date
      pair << level.level
      by_year[year] << pair
    end
    return by_year
  end

  def daily_by_range(year1, year2)
    if year1 == year2
      return daily_by_year(year1)
    elsif year1 < year2
      range = {}
      (year1..year2).each do |year|
        range[year] = daily_by_year(year)
      end
      return range
    else
      range = {}
      (year2..year1).each do |year|
        range[year] = daily_by_year(year)
      end
      return range
    end
  end

  def average_by_year(year)
    average = levels.where('extract(year from date) = ?', year).average(:level)
    av_b_yr = {}
    av_b_yr["reservoir"] = self.name
    av_b_yr["average for " + year] = average.to_f
    return av_b_yr
  end

  def average_by_range(year1, year2)
    if year1 == year2
      return average_by_year(year1)
    elsif year1 < year2
      range = {}
      (year1..year2).each do |year|
        range[year] = average_by_year(year)
      end
      return range
    else
      range = {}
      (year2..year1).each do |year|
        range[year] = average_by_year(year)
      end
      return range
    end
  end



end
