# == Schema Information
#
# Table name: reservoirs
#
#  id                :integer          not null, primary key
#  name              :string           not null
#  hydrologic_area   :string           not null
#  river_basin       :string
#  station_id        :string           not null
#  location          :string           not null
#  max_capacity      :integer          not null
#  county            :string           not null
#  lat               :string           not null
#  lon               :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  elevation         :integer          not null
#  operator          :string
#  averages_by_month :hstore           default({}), not null
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
    sta_json = {}
    sta_json["type"] = "FeatureCollection"
    sta_json["features"] = []

    @reservoirs.each do |res|
      res_obj = {}
      res_obj["type"] = "Feature"
      res_obj["properties"] = {}
      res_obj["properties"]["name"] = res.name
      res_obj["properties"]["id"] = res.id
      res_obj["properties"]["county"] = res.county
      res_obj["geometry"] = {}
      res_obj["geometry"]["type"] = "Point"
      res_obj["geometry"]["coordinates"] = []
      res_obj["geometry"]["coordinates"] << res.lat.to_f
      res_obj["geometry"]["coordinates"] << res.lon.to_f
      sta_json["features"] << res_obj
    end
    return sta_json
  end

  def daily_by_year(year)
    by_year1 = levels.where('extract(year from date) = ?', year)
    by_year = {}
    by_year["id"] = self.id
    by_year["reservoir"] = self.name
    by_year["year"] = year
    by_year["levels"] = []
    by_year1.each do |level|
      pair = []
      pair << level.date
      pair << level.level
      by_year["levels"] << pair
    end
    return by_year
  end

  def monthly_by_year(year)
    monthly_av = {}
    monthly_av["id"] = self.id
    monthly_av["reservoir"] = self.name
    monthly_av["year"] = year
    monthly_av["levels"] = []
    (1..12).each do |month|
      average = []
      by_year = levels.where('extract(year from date) = ?', year).by_month(month, field: :date)
      average << month
      average << by_year.average(:level).to_f
      monthly_av["levels"] << average
    end
    return monthly_av
  end




  def daily_by_range(year1, year2)
    if year1 == year2
      return daily_by_year(year1)
    elsif year1 < year2
      range = []
      (year1..year2).each do |year|
        range << daily_by_year(year)
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
