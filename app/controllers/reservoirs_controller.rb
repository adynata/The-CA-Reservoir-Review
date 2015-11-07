class ReservoirsController < ApplicationController

  def index
  end

  def show
    @reservoir = Reservoir.find(params[:id])
    render json: @reservoir
  end

  def all_daily
    @reservoir = Reservoir.find(params[:id])
    @all_levels = @reservoir.all_daily_levels
    render json: @all_levels
  end

  def coordinates
    coords = Reservoir.all_coordinates
    render json: coords
  end

  def daily_by_year
    reservoir = Reservoir.find(params[:id])
    levels = reservoir.daily_by_year(params[:year])
    render json: levels
  end

  def daily_by_range
    reservoir = Reservoir.find(params[:id])
    levels = reservoir.daily_by_range(params[:year1], params[:year2])
    render json: levels
  end

  def average_by_year
    reservoir = Reservoir.find(params[:id])
    year = params[:year]
    render json: reservoir.average_by_year(year)
  end

  def average_by_range
    reservoir = Reservoir.find(params[:id])
    year1 = params[:year1]
    year2 = params[:year2]
    render json: reservoir.average_by_range(year1, year2)
  end

  def by_hydrologic
    parsed_hr = params[:hr].split(/(?<=[a-z])(?=[A-Z])/).join(' ')
    stations_by_hr = Reservoir.select("id").where("hydrologic_area = ?", parsed_hr)
    year = params[:year]
    stations_by_hr.map {|id| id.id}
    collection_of_hr_records = Reservoir.collection_of_averages(stations_by_hr, year)
    render json: collection_of_hr_records
  end

  def monthly_by_year
    reservoir = Reservoir.find(params[:id])
    year = params[:year]
    render json: reservoir.monthly_by_year(year)
  end

  def av_of_capacity_monthly
    reservoir = Reservoir.find(params[:id])
    year = params[:year]
    render json: reservoir.monthly_percent_by_year(year)
  end

  def all_stations_av_for_year
    render json: Reservoir.all_averages(params[:year])
  end

  def overall_average
    render json: Reservoir.statewide_average_of_capacity(params[:year])
  end

  private

  def reservoir_params
    params.require(:reservoir).permit(:id, :year, :year1, :year2)
  end

end
