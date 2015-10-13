class ReservoirsController < ApplicationController
  def index
    @reservoir_list = Reservoir.all
    render :index
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
      stations_by_hr = Reservoir.where("hydrologic_area = ?", parsed_hr)
      render json: stations_by_hr
    end

    def monthly_by_year
      reservoir = Reservoir.find(params[:id])
      year = params[:year]
      render json: reservoir.monthly_by_year(year)
    end


    private

    def reservoir_params
      params.require(:reservoir).permit(:id, :year, :year1, :year2)
    end

end
