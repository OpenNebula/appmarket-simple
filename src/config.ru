require 'rubygems'
require 'bundler'

Bundler.require

$: << '.'
$: << 'lib/'

require 'controllers/appmarket-server'

run Sinatra::Application
