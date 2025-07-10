require 'sinatra'
require 'sinatra/json'
require 'haml'
require 'models/appliances'
require 'redcarpet'

# appliances metadata
APPMARKET_URL = ENV["APPMARKET_URL"] || "http://marketplace.opennebula.systems"
APPMARKET_DIR = ENV['APPMARKET_DIR'] || 'data/'
appliances = Appliances.new(APPMARKET_DIR, APPMARKET_URL)


helpers do
    def h(text)
        Rack::Utils.escape_html(text)
    end

    UNITS = %W(B KiB MiB GiB TiB).freeze

    def humanize_size(number)
        number = number.to_i

        if number < 1024
            exponent = 0

        else
            max_exp  = UNITS.size - 1

            exponent = ( Math.log( number ) / Math.log( 1024 ) ).to_i # convert to base
            exponent = max_exp if exponent > max_exp # we need this to avoid overflow for the highest unit

            number  /= 1024 ** exponent
        end

        "#{number} #{UNITS[ exponent ]}"
    end

    def logo(name)
        "/logos/#{name}"
    end
end

before do
    cache_control :no_cache, :no_store, :must_revalidate
end

get '/robots.txt' do
    content_type :text
    "User-agent: *\nDisallow: /"
end


# Return the index.html of the React app
get '/', :provides => :html do
  pass if request.user_agent =~ /OpenNebula/i

  send_file File.join(settings.public_folder, 'index.html'), type: :html
end


get '/appliance/?' do
    version = request.user_agent.match(/^OpenNebula (\d+\.\d+)/)
    version = version && appliances.version?(version[1]) ? version[1] : appliances.latest_one_version
    content_type :json
    apps = appliances.get_all_list(version)
    json :sEcho => 1, :appliances => apps
end

get '/appliance/:id/?', :provides => :html do
    # ON marketplace wants JSON
    pass if request.user_agent =~ /OpenNebula/i

    send_file File.join(settings.public_folder, 'index.html'), type: :html
end

get '/appliance/:id/?' do
    content_type :json
    app = appliances.get(params[:id])
    if app.nil?
        error 404
    else
        json app
    end
end

get '/appliance/:id/download/?:file_id?' do
    app = appliances.get(params[:id])
    file_id = params[:file_id].to_i
    if app.nil? || file_id >= app['files'].size
        error 404
    else
        file = app['files'][file_id]
        if file['size']>0 && file['url']
            headers["OpenNebula-AppMarket-Size"] = file['size'].to_s
            redirect file['url']
        else
            error 404
        end
    end
end

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
