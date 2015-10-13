# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'
Rails.application.config.assets.precompile += %w( d3.css )
Rails.application.config.assets.precompile += %w( dropdown-menu.css )
Rails.application.config.assets.precompile += %w( d3.js )
Rails.application.config.assets.precompile += %w( selection.js )
Rails.application.config.assets.precompile += %w( sta_json.js )
Rails.application.config.assets.precompile += %w( styling_script.js )
Rails.application.config.assets.precompile += %w( hydro_regions.json.js caCountiesTopo.json.js us.json.js)
Rails.application.config.assets.precompile += %w( d3.min.js jquery.js nv.d3.min.js )
Rails.application.config.assets.precompile += %w( nvd3.css )


# Rails.application.config.assets.precompile += %w( dropdown-menu.css )
# Rails.application.config.assets.precompile += %w( dropdown-menu.css )
# Rails.application.config.assets.precompile += %w( dropdown-menu.css )
# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
