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

  MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]

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
      by_year = levels.by_month(month, year: year, field: :date)
      average << month
      average << by_year.average(:level).to_i
      monthly_av["levels"] << average
    end
    p monthly_av
    return monthly_av
  end

  def monthly_percent_by_year(year)
    monthly_av_year = monthly_by_year(year)["levels"]
    monthly_av_overall = averages_to_arr
    monthly_by_av_v_capacity = make_stacked_chart_obj_spec(monthly_av_year, year)
    overall_monthly_by_av_v_capacity = make_stacked_chart_obj_gen(monthly_av_overall)

    return [monthly_by_av_v_capacity, overall_monthly_by_av_v_capacity]
  end

  def make_stacked_chart_obj_spec(levels, year)
    monthly_by_av_v_capacity = {}
    monthly_percent_spec = []
    (0..11).each do |i|
      spec_pair = {}
      average_specific_month = levels[i]
      spec_pair["x"] = MONTHS[i]
      spec_pair["y"] = (average_specific_month[1].to_f/max_capacity.to_f)
      monthly_percent_spec << spec_pair
    end
    monthly_by_av_v_capacity["key"] = name + " % of capacity, " + year.to_s
    monthly_by_av_v_capacity["nonStackable"] = true
    monthly_by_av_v_capacity["values"] = monthly_percent_spec
    monthly_by_av_v_capacity
  end

  def make_stacked_chart_obj_gen(levels)
    overall_monthly = {}
    monthly_percent_overall = []
    (0..11).each do |i|
      overall_pair = {}
      average_overall_month = levels[i]
      overall_pair["label"] = "average for " + MONTHS[i]
      overall_pair["x"] = MONTHS[i]
      overall_pair["y"] = (average_overall_month[1].to_f/max_capacity.to_f)
      monthly_percent_overall << overall_pair
    end
    overall_monthly["key"] = name + " average % of capacity"
    overall_monthly["nonStackable"] = true
    overall_monthly["values"] = monthly_percent_overall
    overall_monthly
  end
# by_month(1).include(:levels).where('extract(year from date) = ?', 2002)

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

  def averages_to_arr
    months = averages_by_month.keys
    arrayed = []
    (1..12).each do |i|
      pair = []
      pair << i
      pair << averages_by_month[months[i - 1]].to_f
      arrayed << pair
    end
    return arrayed
    p arrayed
  end


end
