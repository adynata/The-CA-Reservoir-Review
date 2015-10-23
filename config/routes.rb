Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root "reservoirs#index"

  # root 'welcome#index'
  get 'api/reservoirs/coordinates' => 'reservoirs#coordinates'

  # TODO: make api the prefix to all of the routes serving data


  get 'api/reservoirs/:id/daily' => 'reservoirs#all_daily'
  get 'api/reservoirs/daily_by_range/:id/:year1/:year2' => 'reservoirs#daily_by_range'
  get 'api/reservoirs/daily_by_year/:id/:year' => 'reservoirs#daily_by_year'
  get 'api/reservoirs/average_by_range/:id/:year1/:year2' => 'reservoirs#average_by_range'
  get 'api/reservoirs/average_by_year/:id/:year' => 'reservoirs#average_by_year'
  get 'api/reservoirs/by_hydrologic/:hr/' => 'reservoirs#by_hydrologic'
  get 'api/reservoirs/monthly_av_by_year/:id/:year' => 'reservoirs#monthly_by_year'
  get 'api/reservoirs/monthly_av_vs_capacity/:id/:year' => 'reservoirs#av_of_capacity_monthly'

  # get 'reservoirs/:id' => 'reservoirs#show'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
