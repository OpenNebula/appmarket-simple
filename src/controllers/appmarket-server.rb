require 'sinatra'
require 'sinatra/json'
require 'haml'
require 'models/appliances'
require 'redcarpet'

# appliances metadata
APPMARKET_DIR = ENV['APPMARKET_DIR'] || 'data/'
appliances = Appliances.new(APPMARKET_DIR)

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
end

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
    haml :index, :locals => { :appliances => apps }, :content_type => "text/html"
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
        render = Redcarpet::Render::HTML.new(
            :filter_html => true,
            :no_images => false,
            :no_links => false,
            :no_styles => true,
            :safe_links_only => true,
            :with_toc_data => true,
            :hard_wrap => true,
            :xhtml => true)

        @markdown = Redcarpet::Markdown.new(render,
            :autolink => true,
            :space_after_headers => true)

        haml :appliance, :locals => {:app => app}
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

# vim: ai ts=4 sts=4 et sw=4 ft=ruby
