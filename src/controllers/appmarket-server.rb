require 'sinatra'
require 'sinatra/json'
require 'haml'
require 'models/appliances'

# appliances metadata
APPMARKET_DIR = ENV['APPMARKET_DIR'] || 'data/'
appliances = Appliances.new(APPMARKET_DIR)

get '/' do
    redirect '/appliance'
end

get '/robots.txt' do
    content_type :text
    "User-agent: *\nDisallow: /"
end

get '/appliance/?', :provides => :html do
    # ON marketplace wants JSON
    pass if request.user_agent =~ /OpenNebula/i

    apps = appliances.get_all_list
    haml :index, :locals => { :appliances => apps }
end

get '/appliance/?' do
    apps = appliances.get_all_list
    json :sEcho => 1, :appliances => apps
end

get '/appliance/:id/?' do
    app = appliances.get(params[:id])
    if app.nil?
        error 404
    else
        haml :appliance, :locals => {:appliance => app}
    end
end

get '/appliance/:id/download/?:file_id?' do
    app = appliances.get(params[:id])
    file_id = params[:file_id].to_i
    if app.nil? || file_id >= app['files'].size
        error 404
    else
        file = app['files'][file_id]
        if file['size']>0 && file['location']
            headers["OpenNebula-AppMarket-Size"] = file['size'].to_s
            redirect file['location']
        else
            error 404
        end
    end
end
